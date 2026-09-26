import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, HandMetal, Calendar, Users, MapPin, Lock, ChevronRight, Star, Target } from 'lucide-react';
import { getPlayers, getPositions, getGoals, getAssists, getMatches, getSettings, getFormations } from '../store';

export default function Home() {
  const settings = getSettings();
  const players = getPlayers().filter(p => p.active);
  const positions = getPositions();
  const goals = getGoals();
  const assists = getAssists();
  const matches = getMatches();
  const formations = getFormations();

  // Artilharia
  const topScorers = useMemo(() => {
    const byPlayer: Record<string, number> = {};
    goals.forEach(g => { byPlayer[g.playerId] = (byPlayer[g.playerId] || 0) + g.quantity; });
    return Object.entries(byPlayer)
      .map(([playerId, total]) => ({ player: players.find(p => p.id === playerId), total }))
      .filter(r => r.player)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [goals, players]);

  // Assistências
  const topAssists = useMemo(() => {
    const byPlayer: Record<string, number> = {};
    assists.forEach(a => { byPlayer[a.playerId] = (byPlayer[a.playerId] || 0) + 1; });
    return Object.entries(byPlayer)
      .map(([playerId, total]) => ({ player: players.find(p => p.id === playerId), total }))
      .filter(r => r.player)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [assists, players]);

  // Últimas partidas
  const lastMatches = useMemo(() => {
    return [...matches].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  }, [matches]);

  // Jogadores por posição
  const playersByPosition = useMemo(() => {
    return positions.filter(p => p.active).map(pos => ({
      position: pos,
      players: players.filter(p => p.primaryPositionId === pos.id),
    })).filter(g => g.players.length > 0);
  }, [players, positions]);

  const getPosColor = (posId: string) => positions.find(p => p.id === posId)?.color || '#6b7280';
  const getPosName = (posId: string) => positions.find(p => p.id === posId)?.abbreviation || '';

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    finished: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const statusLabels: Record<string, string> = {
    scheduled: 'Agendada', finished: 'Finalizada', cancelled: 'Cancelada',
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-gray-900 to-gray-900" />
        <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2" style={{ borderColor: settings.primaryColor }} />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl border-2" style={{ backgroundColor: settings.primaryColor + '22', borderColor: settings.primaryColor }}>⚽</div>
              )}
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white">{settings.teamName}</h1>
                <p className="text-gray-400 text-sm sm:text-base mt-1">{settings.seasonName}</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{settings.headerText}</p>
              </div>
            </div>
            <Link to="/login" className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs transition-colors" title="Área Administrativa">
              <Lock size={12} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <Users size={20} className="mx-auto mb-1" style={{ color: settings.primaryColor }} />
            <p className="text-2xl font-bold text-white">{players.length}</p>
            <p className="text-xs text-gray-400">Jogadores</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <Calendar size={20} className="mx-auto mb-1 text-yellow-400" />
            <p className="text-2xl font-bold text-white">{matches.length}</p>
            <p className="text-xs text-gray-400">Partidas</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <Trophy size={20} className="mx-auto mb-1 text-yellow-400" />
            <p className="text-2xl font-bold text-white">{goals.reduce((s, g) => s + g.quantity, 0)}</p>
            <p className="text-xs text-gray-400">Gols</p>
          </div>
        </div>
      </section>

      {/* Rankings */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Artilharia */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-yellow-500/10 to-transparent">
              <Trophy size={18} className="text-yellow-400" />
              <h2 className="text-white font-semibold">Artilharia</h2>
            </div>
            {topScorers.length > 0 ? (
              <div className="divide-y divide-gray-700/50">
                {topScorers.map((item, index) => (
                  <div key={item.player!.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-7 text-center">
                      {index === 0 ? <Star size={18} className="text-yellow-400 mx-auto" /> :
                       <span className="text-gray-400 text-sm font-bold">{index + 1}</span>}
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: getPosColor(item.player!.primaryPositionId) }}>
                      {item.player!.nickname[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{item.player!.nickname}</p>
                      <p className="text-gray-500 text-xs">{item.player!.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-400">{item.total}</p>
                      <p className="text-[10px] text-gray-500">gols</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">Nenhum gol registrado ainda</div>
            )}
          </div>

          {/* Assistências */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-blue-500/10 to-transparent">
              <HandMetal size={18} className="text-blue-400" />
              <h2 className="text-white font-semibold">Garçons</h2>
            </div>
            {topAssists.length > 0 ? (
              <div className="divide-y divide-gray-700/50">
                {topAssists.map((item, index) => (
                  <div key={item.player!.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-7 text-center">
                      {index === 0 ? <Star size={18} className="text-blue-400 mx-auto" /> :
                       <span className="text-gray-400 text-sm font-bold">{index + 1}</span>}
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: getPosColor(item.player!.primaryPositionId) }}>
                      {item.player!.nickname[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{item.player!.nickname}</p>
                      <p className="text-gray-500 text-xs">{item.player!.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-400">{item.total}</p>
                      <p className="text-[10px] text-gray-500">assist.</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">Nenhuma assistência registrada ainda</div>
            )}
          </div>
        </div>
      </section>

      {/* Últimas Partidas */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-gray-400" />
          <h2 className="text-white font-semibold">Últimas Partidas</h2>
        </div>
        {lastMatches.length > 0 ? (
          <div className="space-y-3">
            {lastMatches.map(match => (
              <div key={match.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{match.date}</span>
                    {match.location && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={10} /> {match.location}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[match.status]}`}>
                    {statusLabels[match.status]}
                  </span>
                </div>
                {match.teams.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {match.teams.map(team => (
                      <div key={team.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-700/30">
                        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: team.color }} />
                        <span className="text-white text-sm font-medium truncate">{team.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">{team.playerIds.length} jog.</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center text-gray-500 text-sm">
            Nenhuma partida registrada ainda
          </div>
        )}
      </section>

      {/* Elenco */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-gray-400" />
          <h2 className="text-white font-semibold">Elenco</h2>
        </div>
        <div className="space-y-4">
          {playersByPosition.map(group => (
            <div key={group.position.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700" style={{ backgroundColor: group.position.color + '15' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.position.color }} />
                <h3 className="text-white text-sm font-medium">{group.position.name}</h3>
                <span className="text-xs text-gray-400 ml-auto">{group.players.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3">
                {group.players.map(player => (
                  <div key={player.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: group.position.color }}>
                      {player.nickname[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{player.nickname}</p>
                      {player.secondaryPositionId && (
                        <p className="text-[10px] text-gray-500">
                          Também: {getPosName(player.secondaryPositionId)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-xs">{settings.footerText}</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-[10px] text-gray-600">
              <Target size={10} />
              <span>{formations.length} formações</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-600">
              <Users size={10} />
              <span>{players.length} jogadores</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
