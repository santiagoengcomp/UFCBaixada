import { useMemo } from 'react';
import { Users, UserCheck, UserX, CreditCard, Trophy, HandMetal, Calendar, AlertTriangle } from 'lucide-react';
import { getPlayers, getPayments, getGoals, getAssists, getMatches, getPositions, getSettings } from '../store';

export default function Dashboard() {
  const players = getPlayers();
  const payments = getPayments();
  const goals = getGoals();
  const assists = getAssists();
  const matches = getMatches();
  const positions = getPositions();
  const settings = getSettings();

  const stats = useMemo(() => {
    const activePlayers = players.filter(p => p.active);
    const availablePlayers = players.filter(p => p.available);
    const noPosition = players.filter(p => p.active && !positions.find(pos => pos.id === p.primaryPositionId));
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthPayments = payments.filter(p => p.reference === currentMonth);
    const paidAmount = monthPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = monthPayments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

    // Goals ranking
    const goalsByPlayer: Record<string, number> = {};
    goals.forEach(g => { goalsByPlayer[g.playerId] = (goalsByPlayer[g.playerId] || 0) + g.quantity; });
    const topScorer = Object.entries(goalsByPlayer).sort((a, b) => b[1] - a[1])[0];
    const topScorerPlayer = topScorer ? players.find(p => p.id === topScorer[0]) : null;

    // Assists ranking
    const assistsByPlayer: Record<string, number> = {};
    assists.forEach(a => { assistsByPlayer[a.playerId] = (assistsByPlayer[a.playerId] || 0) + 1; });
    const topAssist = Object.entries(assistsByPlayer).sort((a, b) => b[1] - a[1])[0];
    const topAssistPlayer = topAssist ? players.find(p => p.id === topAssist[0]) : null;

    const lastPlayers = [...players].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
    const lastPayments = [...payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

    return { activePlayers, availablePlayers, noPosition, paidAmount, pendingAmount, topScorerPlayer, topScorer, topAssistPlayer, topAssist, lastPlayers, lastPayments };
  }, [players, payments, goals, assists, matches, positions]);

  const statCards = [
    { label: 'Jogadores Ativos', value: stats.activePlayers.length, icon: Users, color: settings.primaryColor },
    { label: 'Disponíveis', value: stats.availablePlayers.length, icon: UserCheck, color: '#10b981' },
    { label: 'Sem Posição', value: stats.noPosition.length, icon: UserX, color: '#f59e0b' },
    { label: 'Recebido (mês)', value: `R$ ${stats.paidAmount}`, icon: CreditCard, color: '#10b981' },
    { label: 'Pendente (mês)', value: `R$ ${stats.pendingAmount}`, icon: AlertTriangle, color: '#ef4444' },
    { label: 'Partidas', value: matches.length, icon: Calendar, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm">{settings.seasonName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={16} style={{ color: card.color }} />
              <span className="text-xs text-gray-400">{card.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Rankings */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={20} className="text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Artilheiro da Temporada</h3>
          </div>
          {stats.topScorerPlayer ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: settings.primaryColor }}>
                {stats.topScorerPlayer.nickname[0]}
              </div>
              <div>
                <p className="text-white font-medium">{stats.topScorerPlayer.nickname}</p>
                <p className="text-gray-400 text-sm">{stats.topScorerPlayer.name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-yellow-400">{stats.topScorer[1]}</p>
                <p className="text-xs text-gray-400">gols</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum gol registrado</p>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <HandMetal size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Líder de Assistências</h3>
          </div>
          {stats.topAssistPlayer ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: settings.secondaryColor }}>
                {stats.topAssistPlayer.nickname[0]}
              </div>
              <div>
                <p className="text-white font-medium">{stats.topAssistPlayer.nickname}</p>
                <p className="text-gray-400 text-sm">{stats.topAssistPlayer.name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-blue-400">{stats.topAssist[1]}</p>
                <p className="text-xs text-gray-400">assistências</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma assistência registrada</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Últimos Jogadores</h3>
          <div className="space-y-3">
            {stats.lastPlayers.map(p => {
              const pos = positions.find(pos => pos.id === p.primaryPositionId);
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                    {p.nickname[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{p.nickname} - {p.name}</p>
                    <p className="text-xs text-gray-500">{pos?.name || 'Sem posição'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {p.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Últimos Pagamentos</h3>
          <div className="space-y-3">
            {stats.lastPayments.map(pay => {
              const player = players.find(p => p.id === pay.playerId);
              const statusColors: Record<string, string> = {
                paid: 'bg-green-500/20 text-green-400',
                pending: 'bg-yellow-500/20 text-yellow-400',
                overdue: 'bg-red-500/20 text-red-400',
                exempt: 'bg-gray-500/20 text-gray-400',
              };
              const statusLabels: Record<string, string> = {
                paid: 'Pago', pending: 'Pendente', overdue: 'Atrasado', exempt: 'Isento',
              };
              return (
                <div key={pay.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                    {player?.nickname[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{player?.nickname || 'Jogador'}</p>
                    <p className="text-xs text-gray-500">R$ {pay.amount} • {pay.reference}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[pay.status]}`}>
                    {statusLabels[pay.status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
