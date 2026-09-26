import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, HandMetal, Calendar, Users, MapPin, Lock, Star, Target, TrendingUp, Award, Clock, ChevronRight, Zap } from 'lucide-react';
import { getPlayers, getPositions, getGoals, getAssists, getMatches, getSettings, getFormations } from '../store';

export default function Home() {
  const settings = getSettings();
  const players = getPlayers().filter(p => p.active);
  const positions = getPositions();
  const goals = getGoals();
  const assists = getAssists();
  const matches = getMatches();
  const formations = getFormations();
  const [selectedMatchField, setSelectedMatchField] = useState(0);

  // Próxima partida
  const nextMatch = useMemo(() => {
    const scheduled = matches.filter(m => m.status === 'scheduled' && new Date(m.date) >= new Date());
    return scheduled.sort((a, b) => a.date.localeCompare(b.date))[0];
  }, [matches]);

  // Última partida finalizada
  const lastMatch = useMemo(() => {
    const finished = matches.filter(m => m.status === 'finished');
    return finished.sort((a, b) => b.date.localeCompare(a.date))[0];
  }, [matches]);

  // Calcular placar de uma partida
  const getMatchScore = (matchId: string) => {
    const matchGoals = goals.filter(g => g.matchId === matchId);
    const match = matches.find(m => m.id === matchId);
    if (!match || match.teams.length < 2) return { team1: 0, team2: 0 };

    const team1Players = match.teams[0]?.playerIds || [];
    const team2Players = match.teams[1]?.playerIds || [];

    const team1Goals = matchGoals
      .filter(g => team1Players.includes(g.playerId))
      .reduce((sum, g) => sum + g.quantity, 0);
    
    const team2Goals = matchGoals
      .filter(g => team2Players.includes(g.playerId))
      .reduce((sum, g) => sum + g.quantity, 0);

    return { team1: team1Goals, team2: team2Goals };
  };

  // Gols por jogador em uma partida
  const getMatchGoalsByPlayer = (matchId: string) => {
    const matchGoals = goals.filter(g => g.matchId === matchId);
    return matchGoals.reduce((acc, g) => {
      acc[g.playerId] = (acc[g.playerId] || 0) + g.quantity;
      return acc;
    }, {} as Record<string, number>);
  };

  // Assistências por jogador em uma partida
  const getMatchAssistsByPlayer = (matchId: string) => {
    const matchAssists = assists.filter(a => a.matchId === matchId);
    return matchAssists.reduce((acc, a) => {
      acc[a.playerId] = (acc[a.playerId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

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

  // Estatísticas gerais
  const stats = useMemo(() => {
    const totalGoals = goals.reduce((sum, g) => sum + g.quantity, 0);
    const totalAssists = assists.length;
    const avgGoalsPerMatch = matches.length > 0 ? (totalGoals / matches.length).toFixed(1) : '0';
    const finishedMatches = matches.filter(m => m.status === 'finished').length;
    
    return {
      totalGoals,
      totalAssists,
      avgGoalsPerMatch,
      finishedMatches,
      totalMatches: matches.length,
    };
  }, [goals, assists, matches]);

  // Últimas partidas
  const lastMatches = useMemo(() => {
    return [...matches].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
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

  // Campo Virtual Component
  const VirtualFieldMini = ({ match, teamIndex }: { match: typeof lastMatch; teamIndex: number }) => {
    if (!match || !match.teams[teamIndex]) return null;
    
    const team = match.teams[teamIndex];
    const formation = formations[0]; // Usar primeira formação disponível
    const teamPlayers = team.playerIds.map(id => players.find(p => p.id === id)).filter(Boolean);

    return (
      <div className="relative bg-gradient-to-b from-green-800 to-green-900 rounded-xl border-2 border-green-600 aspect-[2/3] max-w-xs mx-auto overflow-hidden">
        {/* Field markings */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
          <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-[15%] border-b border-l border-r border-white/30" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-[15%] border-t border-l border-r border-white/30" />
        </div>

        {/* Players */}
        {formation?.slots.slice(0, teamPlayers.length).map((slot, i) => {
          const player = teamPlayers[i];
          if (!player) return null;
          const playerGoals = getMatchGoalsByPlayer(match.id)[player.id] || 0;
          
          return (
            <div
              key={i}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div className="relative">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border-2 border-white/30"
                  style={{ backgroundColor: getPosColor(player.primaryPositionId) }}
                >
                  {player.nickname.slice(0, 2).toUpperCase()}
                </div>
                {playerGoals > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[8px] font-bold text-gray-900">
                    {playerGoals}
                  </div>
                )}
              </div>
              <span className="text-[8px] text-white font-medium mt-0.5 bg-black/50 px-1 rounded whitespace-nowrap">
                {player.nickname}
              </span>
            </div>
          );
        })}
      </div>
    );
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <Users size={20} className="mx-auto mb-1" style={{ color: settings.primaryColor }} />
            <p className="text-2xl font-bold text-white">{players.length}</p>
            <p className="text-xs text-gray-400">Jogadores</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <Calendar size={20} className="mx-auto mb-1 text-blue-400" />
            <p className="text-2xl font-bold text-white">{stats.totalMatches}</p>
            <p className="text-xs text-gray-400">Partidas</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <Trophy size={20} className="mx-auto mb-1 text-yellow-400" />
            <p className="text-2xl font-bold text-white">{stats.totalGoals}</p>
            <p className="text-xs text-gray-400">Gols</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <HandMetal size={20} className="mx-auto mb-1 text-blue-400" />
            <p className="text-2xl font-bold text-white">{stats.totalAssists}</p>
            <p className="text-xs text-gray-400">Assistências</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center col-span-2 sm:col-span-1">
            <TrendingUp size={20} className="mx-auto mb-1 text-green-400" />
            <p className="text-2xl font-bold text-white">{stats.avgGoalsPerMatch}</p>
            <p className="text-xs text-gray-400">Média Gols/Jogo</p>
          </div>
        </div>
      </section>

      {/* Próxima Partida */}
      {nextMatch && (
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-blue-400" />
              <h2 className="text-white font-semibold text-lg">Próxima Partida</h2>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-2">{nextMatch.date}</p>
              {nextMatch.location && (
                <p className="text-gray-400 flex items-center justify-center gap-1 mb-4">
                  <MapPin size={14} /> {nextMatch.location}
                </p>
              )}
              {nextMatch.teams.length > 0 && (
                <div className="flex items-center justify-center gap-6">
                  {nextMatch.teams.map((team, i) => (
                    <div key={team.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: team.color }}>
                        {team.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-white font-semibold">{team.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Última Partida com Placar */}
      {lastMatch && (
        <section className="max-w-6xl mx-auto px-4 pb-6">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-green-900/20 to-transparent">
              <Award size={20} className="text-green-400" />
              <h2 className="text-white font-semibold text-lg">Última Partida</h2>
              <span className="ml-auto text-sm text-gray-400">{lastMatch.date}</span>
            </div>

            {/* Placar */}
            <div className="p-6">
              {(() => {
                const score = getMatchScore(lastMatch.id);
                return (
                  <div className="flex items-center justify-center gap-8 mb-6">
                    {lastMatch.teams.map((team, i) => (
                      <div key={team.id} className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto" style={{ backgroundColor: team.color }}>
                            {team.name.slice(0, 2).toUpperCase()}
                          </div>
                          <p className="text-white font-semibold">{team.name}</p>
                        </div>
                        <div className="text-5xl font-bold text-white">
                          {i === 0 ? score.team1 : score.team2}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {lastMatch.location && (
                <p className="text-center text-gray-400 text-sm flex items-center justify-center gap-1 mb-6">
                  <MapPin size={14} /> {lastMatch.location}
                </p>
              )}

              {/* Gols da partida */}
              {(() => {
                const goalsByPlayer = getMatchGoalsByPlayer(lastMatch.id);
                const scorers = Object.entries(goalsByPlayer)
                  .map(([playerId, qty]) => ({ player: players.find(p => p.id === playerId), qty }))
                  .filter(s => s.player)
                  .sort((a, b) => b.qty - a.qty);

                if (scorers.length > 0) {
                  return (
                    <div className="bg-gray-700/30 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <Trophy size={14} className="text-yellow-400" /> Gols da Partida
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {scorers.map(({ player, qty }) => (
                          <div key={player!.id} className="flex items-center gap-2 text-sm">
                            <span className="text-yellow-400">⚽</span>
                            <span className="text-white">{player!.nickname}</span>
                            <span className="text-gray-400 ml-auto">{qty}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Assistências da partida */}
              {(() => {
                const assistsByPlayer = getMatchAssistsByPlayer(lastMatch.id);
                const assisters = Object.entries(assistsByPlayer)
                  .map(([playerId, qty]) => ({ player: players.find(p => p.id === playerId), qty }))
                  .filter(a => a.player)
                  .sort((a, b) => b.qty - a.qty);

                if (assisters.length > 0) {
                  return (
                    <div className="bg-gray-700/30 rounded-xl p-4 mt-3">
                      <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <HandMetal size={14} className="text-blue-400" /> Assistências
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {assisters.map(({ player, qty }) => (
                          <div key={player!.id} className="flex items-center gap-2 text-sm">
                            <span className="text-blue-400">🎯</span>
                            <span className="text-white">{player!.nickname}</span>
                            <span className="text-gray-400 ml-auto">{qty}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Campo Virtual da Última Partida */}
            {lastMatch.teams.length >= 2 && (
              <div className="border-t border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Target size={18} className="text-green-400" /> Escalações em Campo
                  </h3>
                  <div className="flex gap-2">
                    {lastMatch.teams.map((team, i) => (
                      <button
                        key={team.id}
                        onClick={() => setSelectedMatchField(i)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedMatchField === i 
                            ? 'text-white' 
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                        style={selectedMatchField === i ? { backgroundColor: team.color } : {}}
                      >
                        {team.name}
                      </button>
                    ))}
                  </div>
                </div>
                <VirtualFieldMini match={lastMatch} teamIndex={selectedMatchField} />
              </div>
            )}
          </div>
        </section>
      )}

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

      {/* Histórico de Partidas */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-gray-400" />
          <h2 className="text-white font-semibold">Histórico de Partidas</h2>
        </div>
        {lastMatches.length > 0 ? (
          <div className="space-y-3">
            {lastMatches.map(match => {
              const score = getMatchScore(match.id);
              return (
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
                  {match.teams.length >= 2 && match.status === 'finished' && (
                    <div className="flex items-center justify-center gap-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: match.teams[0].color }} />
                        <span className="text-white text-sm font-medium">{match.teams[0].name}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {score.team1} - {score.team2}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{match.teams[1].name}</span>
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: match.teams[1].color }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
