import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, Trophy, Medal } from 'lucide-react';
import { getGoals, getPlayers, getMatches, addGoal, updateGoal, deleteGoal, getSettings } from '../store';

export default function Goals() {
  const [goals, setGoals] = useState(getGoals());
  const players = getPlayers();
  const matches = getMatches();
  const settings = getSettings();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterMatch, setFilterMatch] = useState('');

  const [form, setForm] = useState({ matchId: '', playerId: '', quantity: 1, minute: undefined as number | undefined, observation: '' });

  const ranking = useMemo(() => {
    const byPlayer: Record<string, number> = {};
    const filteredGoals = filterMatch ? goals.filter(g => g.matchId === filterMatch) : goals;
    filteredGoals.forEach(g => { byPlayer[g.playerId] = (byPlayer[g.playerId] || 0) + g.quantity; });
    return Object.entries(byPlayer)
      .map(([playerId, total]) => ({ player: players.find(p => p.id === playerId), total }))
      .filter(r => r.player)
      .sort((a, b) => b.total - a.total);
  }, [goals, players, filterMatch]);

  const openAdd = () => {
    setForm({ matchId: matches[0]?.id || '', playerId: players[0]?.id || '', quantity: 1, minute: undefined, observation: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (goal: typeof goals[0]) => {
    setForm({ matchId: goal.matchId, playerId: goal.playerId, quantity: goal.quantity, minute: goal.minute, observation: goal.observation || '' });
    setEditingId(goal.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateGoal(editingId, form);
    } else {
      addGoal(form);
    }
    setGoals(getGoals());
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    setGoals(getGoals());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Artilharia</h1>
          <p className="text-gray-400 text-sm">Ranking de goleadores</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm" style={{ backgroundColor: settings.primaryColor }}>
          <Plus size={18} /> Registrar Gol
        </button>
      </div>

      {/* Filter */}
      <select value={filterMatch} onChange={e => setFilterMatch(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
        <option value="">Todas as partidas</option>
        {matches.map(m => <option key={m.id} value={m.id}>{m.date} - {m.location || 'Sem local'}</option>)}
      </select>

      {/* Ranking */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {ranking.length > 0 ? (
          <div className="divide-y divide-gray-700/50">
            {ranking.map((item, index) => (
              <div key={item.player!.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-700/30">
                <div className="w-8 text-center">
                  {index === 0 ? <Trophy size={20} className="text-yellow-400 mx-auto" /> :
                   index === 1 ? <Medal size={20} className="text-gray-300 mx-auto" /> :
                   index === 2 ? <Medal size={20} className="text-amber-600 mx-auto" /> :
                   <span className="text-gray-400 text-sm font-medium">{index + 1}</span>}
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: settings.primaryColor }}>
                  {item.player!.nickname[0]}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{item.player!.nickname}</p>
                  <p className="text-gray-400 text-xs">{item.player!.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-yellow-400">{item.total}</p>
                  <p className="text-xs text-gray-400">gols</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Trophy size={48} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum gol registrado</p>
          </div>
        )}
      </div>

      {/* Goals List */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Registro de Gols</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {goals.map(goal => {
            const player = players.find(p => p.id === goal.playerId);
            const match = matches.find(m => m.id === goal.matchId);
            return (
              <div key={goal.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-700/30">
                <span className="text-yellow-400 text-sm font-bold">⚽ {goal.quantity}</span>
                <span className="text-white text-sm flex-1">{player?.nickname || 'N/A'}</span>
                <span className="text-xs text-gray-400">{match?.date || ''}</span>
                {goal.minute && <span className="text-xs text-gray-500">{goal.minute}'</span>}
                <button onClick={() => openEdit(goal)} className="p-1 rounded hover:bg-gray-600 text-gray-400"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(goal.id)} className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{editingId ? 'Editar Gol' : 'Registrar Gol'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Partida *</label>
                <select required value={form.matchId} onChange={e => setForm({ ...form, matchId: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                  {matches.map(m => <option key={m.id} value={m.id}>{m.date} - {m.location || 'Sem local'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Jogador *</label>
                <select required value={form.playerId} onChange={e => setForm({ ...form, playerId: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                  {players.map(p => <option key={p.id} value={p.id}>{p.nickname} - {p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Quantidade</label>
                  <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Minuto</label>
                  <input type="number" min="1" max="120" value={form.minute || ''} onChange={e => setForm({ ...form, minute: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" placeholder="Opcional" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Observação</label>
                <input type="text" value={form.observation} onChange={e => setForm({ ...form, observation: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" placeholder="Ex: falta, pênalti, jogada individual" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.primaryColor }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
