import { useState } from 'react';
import { Dices, RefreshCw, Save, Eye } from 'lucide-react';
import { getPlayers, getPositions, getFormations, getSettings, addMatch, saveDraw } from '../store';
import type { Team, DrawConfig, DrawResult } from '../types';

export default function Draw() {
  const settings = getSettings();
  const allPlayers = getPlayers();
  const positions = getPositions();
  const formations = getFormations();
  const availablePlayers = allPlayers.filter(p => p.active && p.available);

  const [config, setConfig] = useState<DrawConfig>({
    date: new Date().toISOString().split('T')[0],
    availablePlayerIds: availablePlayers.map(p => p.id),
    numberOfTeams: 2,
    teamNames: ['Verdes', 'Azuis'],
    teamColors: ['#16a34a', '#2563eb'],
    formationId: settings.defaultFormationId,
    balanceByPosition: true,
    distributeGoalkeepers: true,
  });

  const [result, setResult] = useState<DrawResult | null>(null);
  const [showField, setShowField] = useState(false);

  const togglePlayer = (id: string) => {
    setConfig(prev => ({
      ...prev,
      availablePlayerIds: prev.availablePlayerIds.includes(id)
        ? prev.availablePlayerIds.filter(p => p !== id)
        : [...prev.availablePlayerIds, id],
    }));
  };

  const selectAll = () => setConfig(prev => ({ ...prev, availablePlayerIds: availablePlayers.map(p => p.id) }));
  const selectNone = () => setConfig(prev => ({ ...prev, availablePlayerIds: [] }));

  const performDraw = () => {
    const selectedPlayers = availablePlayers.filter(p => config.availablePlayerIds.includes(p.id));
    
    if (selectedPlayers.length < config.numberOfTeams * 2) {
      alert('Jogadores insuficientes para formar os times!');
      return;
    }

    const teams: Team[] = Array.from({ length: config.numberOfTeams }, (_, i) => ({
      id: `team-${Date.now()}-${i}`,
      name: config.teamNames[i] || `Time ${i + 1}`,
      color: config.teamColors[i] || '#6b7280',
      playerIds: [],
    }));

    // Shuffle players
    const shuffled = [...selectedPlayers].sort(() => Math.random() - 0.5);

    if (config.distributeGoalkeepers) {
      const goalkeepers = shuffled.filter(p => p.primaryPositionId === 'pos-gk');
      const others = shuffled.filter(p => p.primaryPositionId !== 'pos-gk');
      
      // Distribute goalkeepers evenly
      goalkeepers.forEach((gk, i) => {
        teams[i % teams.length].playerIds.push(gk.id);
      });

      // Distribute others
      if (config.balanceByPosition) {
        // Group by position
        const byPosition: Record<string, typeof others> = {};
        others.forEach(p => {
          const pos = p.primaryPositionId;
          if (!byPosition[pos]) byPosition[pos] = [];
          byPosition[pos].push(p);
        });

        // Shuffle each group and distribute
        Object.values(byPosition).forEach(group => {
          const shuffledGroup = group.sort(() => Math.random() - 0.5);
          shuffledGroup.forEach((player, i) => {
            // Find team with fewest players
            const minTeam = teams.reduce((min, t) => t.playerIds.length < min.playerIds.length ? t : min, teams[0]);
            minTeam.playerIds.push(player.id);
          });
        });
      } else {
        others.forEach((player, i) => {
          teams[i % teams.length].playerIds.push(player.id);
        });
      }
    } else {
      shuffled.forEach((player, i) => {
        teams[i % teams.length].playerIds.push(player.id);
      });
    }

    const drawResult: DrawResult = {
      teams,
      config,
      createdAt: new Date().toISOString(),
    };

    setResult(drawResult);
  };

  const saveAsMatch = () => {
    if (!result) return;
    addMatch({
      date: config.date,
      status: 'scheduled',
      teams: result.teams,
    });
    saveDraw(result);
    alert('Partida salva com sucesso!');
  };

  const getPosColor = (posId: string) => positions.find(p => p.id === posId)?.color || '#6b7280';
  const getPosName = (posId: string) => positions.find(p => p.id === posId)?.abbreviation || '?';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Sorteio de Times</h1>
        <p className="text-gray-400 text-sm">Sorteie jogadores para formar times equilibrados</p>
      </div>

      {/* Config */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Data</label>
            <input type="date" value={config.date} onChange={e => setConfig({ ...config, date: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nº de Times</label>
            <select value={config.numberOfTeams} onChange={e => {
              const n = Number(e.target.value);
              setConfig({ ...config, numberOfTeams: n, teamNames: Array.from({ length: n }, (_, i) => config.teamNames[i] || `Time ${i + 1}`), teamColors: Array.from({ length: n }, (_, i) => config.teamColors[i] || ['#16a34a', '#2563eb', '#ef4444', '#f59e0b'][i]) });
            }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
              <option value={2}>2 Times</option>
              <option value={3}>3 Times</option>
              <option value={4}>4 Times</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Formação</label>
            <select value={config.formationId} onChange={e => setConfig({ ...config, formationId: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
              {formations.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input type="checkbox" checked={config.balanceByPosition} onChange={e => setConfig({ ...config, balanceByPosition: e.target.checked })} className="rounded" />
              Equilibrar por posição
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input type="checkbox" checked={config.distributeGoalkeepers} onChange={e => setConfig({ ...config, distributeGoalkeepers: e.target.checked })} className="rounded" />
              Distribuir goleiros
            </label>
          </div>
        </div>

        {/* Team names & colors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: config.numberOfTeams }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="color" value={config.teamColors[i] || '#6b7280'} onChange={e => {
                const colors = [...config.teamColors]; colors[i] = e.target.value;
                setConfig({ ...config, teamColors: colors });
              }} className="w-8 h-8 rounded cursor-pointer" />
              <input type="text" value={config.teamNames[i] || ''} onChange={e => {
                const names = [...config.teamNames]; names[i] = e.target.value;
                setConfig({ ...config, teamNames: names });
              }} placeholder={`Time ${i + 1}`}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-green-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Player Selection */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Jogadores Disponíveis ({config.availablePlayerIds.length}/{availablePlayers.length})</h3>
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">Todos</button>
            <button onClick={selectNone} className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">Nenhum</button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
          {availablePlayers.map(player => (
            <label key={player.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${config.availablePlayerIds.includes(player.id) ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-700/50 border border-transparent'}`}>
              <input type="checkbox" checked={config.availablePlayerIds.includes(player.id)} onChange={() => togglePlayer(player.id)} className="rounded" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{player.nickname}</p>
                <p className="text-[10px] text-gray-400">{getPosName(player.primaryPositionId)}</p>
              </div>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getPosColor(player.primaryPositionId) }} />
            </label>
          ))}
        </div>
      </div>

      {/* Draw Button */}
      <div className="flex gap-3">
        <button onClick={performDraw} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: settings.primaryColor }}>
          <Dices size={20} /> Sortear Times
        </button>
        {result && (
          <button onClick={performDraw} className="px-4 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600">
            <RefreshCw size={20} />
          </button>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Resultado do Sorteio</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowField(!showField)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 text-white text-xs hover:bg-gray-600">
                <Eye size={14} /> {showField ? 'Lista' : 'Campo'}
              </button>
              <button onClick={saveAsMatch} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs" style={{ backgroundColor: settings.primaryColor }}>
                <Save size={14} /> Salvar Partida
              </button>
            </div>
          </div>

          {!showField ? (
            <div className="grid md:grid-cols-2 gap-4">
              {result.teams.map(team => (
                <div key={team.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: team.color }} />
                    <h3 className="text-white font-semibold">{team.name}</h3>
                    <span className="text-xs text-gray-400 ml-auto">{team.playerIds.length} jogadores</span>
                  </div>
                  <div className="space-y-2">
                    {team.playerIds.map(pid => {
                      const player = allPlayers.find(p => p.id === pid);
                      if (!player) return null;
                      return (
                        <div key={pid} className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-gray-700/50">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: getPosColor(player.primaryPositionId) }}>
                            {getPosName(player.primaryPositionId)}
                          </div>
                          <span className="text-sm text-white">{player.nickname}</span>
                          <span className="text-xs text-gray-400 ml-auto">{player.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Field View */
            <div className="grid md:grid-cols-2 gap-4">
              {result.teams.map(team => (
                <div key={team.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: team.color }} />
                    <h3 className="text-white font-semibold">{team.name}</h3>
                  </div>
                  <div className="relative bg-green-900/30 rounded-lg aspect-[2/3] border border-green-800/50">
                    {/* Center line */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
                    
                    {team.playerIds.map((pid, i) => {
                      const player = allPlayers.find(p => p.id === pid);
                      if (!player) return null;
                      const total = team.playerIds.length;
                      const cols = Math.ceil(Math.sqrt(total));
                      const row = Math.floor(i / cols);
                      const col = i % cols;
                      const x = ((col + 0.5) / cols) * 100;
                      const y = ((row + 0.5) / Math.ceil(total / cols)) * 100;
                      return (
                        <div key={pid} className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                          style={{ left: `${x}%`, top: `${y}%` }}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white/30"
                            style={{ backgroundColor: getPosColor(player.primaryPositionId) }}>
                            {player.nickname.slice(0, 2)}
                          </div>
                          <span className="text-[8px] text-white mt-0.5 bg-black/50 px-1 rounded">{player.nickname}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
