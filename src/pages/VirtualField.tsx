import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { getPlayers, getPositions, getFormations, getSettings } from '../store';

export default function VirtualField() {
  const [formationId, setFormationId] = useState(getSettings().defaultFormationId);
  const [, setRefresh] = useState(0);
  const formations = getFormations();
  const players = getPlayers();
  const positions = getPositions();
  const settings = getSettings();

  const formation = formations.find(f => f.id === formationId);
  const activePlayers = players.filter(p => p.active && p.available);

  const assignedPlayers = useMemo(() => {
    if (!formation) return {};
    const result: Record<string, typeof players[0]> = {};
    const used = new Set<string>();
    const slots = formation.slots;

    // First assign goalkeepers to goalkeeper slots
    const gkSlots = slots.filter(s => s.positionId === 'pos-gk');
    const gkPlayers = activePlayers.filter(p => p.primaryPositionId === 'pos-gk');
    gkSlots.forEach((slot, i) => {
      if (gkPlayers[i] && !used.has(gkPlayers[i].id)) {
        result[slot.id] = gkPlayers[i];
        used.add(gkPlayers[i].id);
      }
    });

    // Then assign by position
    const otherSlots = slots.filter(s => s.positionId !== 'pos-gk');
    otherSlots.forEach(slot => {
      if (result[slot.id]) return;
      const matchingPlayers = activePlayers.filter(p => 
        !used.has(p.id) && (p.primaryPositionId === slot.positionId || p.secondaryPositionId === slot.positionId)
      );
      if (matchingPlayers.length > 0) {
        const randomPlayer = matchingPlayers[Math.floor(Math.random() * matchingPlayers.length)];
        result[slot.id] = randomPlayer;
        used.add(randomPlayer.id);
      }
    });

    // Fill remaining slots with any available player
    const remainingSlots = slots.filter(s => !result[s.id]);
    const remainingPlayers = activePlayers.filter(p => !used.has(p.id));
    remainingSlots.forEach((slot, i) => {
      if (remainingPlayers[i]) {
        result[slot.id] = remainingPlayers[i];
        used.add(remainingPlayers[i].id);
      }
    });

    return result;
  }, [formation, activePlayers]);

  const unassignedPlayers = activePlayers.filter(p => !Object.values(assignedPlayers).find(ap => ap.id === p.id));

  const getPosColor = (posId: string) => positions.find(p => p.id === posId)?.color || '#6b7280';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Campo Virtual</h1>
          <p className="text-gray-400 text-sm">Visualização dos jogadores em campo</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={formationId} onChange={e => setFormationId(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
            {formations.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <button onClick={() => setRefresh(r => r + 1)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600">
            <RefreshCw size={16} /> Atualizar
          </button>
        </div>
      </div>

      {/* Field */}
      <div className="relative bg-gradient-to-b from-green-800 to-green-900 rounded-2xl border-2 border-green-600 aspect-[2/3] max-w-md mx-auto overflow-hidden">
        {/* Field markings */}
        <div className="absolute inset-0">
          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
          {/* Top penalty area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-[15%] border-b border-l border-r border-white/30" />
          {/* Bottom penalty area */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-[15%] border-t border-l border-r border-white/30" />
          {/* Top goal */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[4%] border-b border-l border-r border-white/40" />
          {/* Bottom goal */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-[4%] border-t border-l border-r border-white/40" />
        </div>

        {/* Players on field */}
        {formation?.slots.map(slot => {
          const player = assignedPlayers[slot.id];
          return (
            <div
              key={slot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div className="relative">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white/30"
                  style={{ backgroundColor: player ? getPosColor(player.primaryPositionId) : '#4b5563' }}>
                  {player ? player.nickname.slice(0, 2).toUpperCase() : '?'}
                </div>
                {!player && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white" />
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] text-white font-medium mt-0.5 bg-black/50 px-1.5 py-0.5 rounded whitespace-nowrap">
                {player ? player.nickname : slot.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Unassigned players */}
      {unassignedPlayers.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Jogadores sem posição no campo ({unassignedPlayers.length})</h3>
          <div className="flex flex-wrap gap-2">
            {unassignedPlayers.map(p => (
              <span key={p.id} className="text-xs px-3 py-1.5 rounded-full bg-gray-700 text-gray-300">
                {p.nickname}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Legenda de Posições</h3>
        <div className="flex flex-wrap gap-3">
          {positions.filter(p => p.active).map(pos => (
            <div key={pos.id} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pos.color }} />
              <span className="text-xs text-gray-400">{pos.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
