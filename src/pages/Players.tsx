import { useState } from 'react';
import { Edit2, Trash2, X, Search, UserPlus, Users } from 'lucide-react';
import { getPlayers, getPositions, addPlayer, updatePlayer, deletePlayer, getSettings } from '../store';
import type { Player } from '../types';

export default function Players() {
  const [players, setPlayers] = useState(getPlayers());
  const [positions] = useState(getPositions());
  const settings = getSettings();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterPos, setFilterPos] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', nickname: '', phone: '', primaryPositionId: '', secondaryPositionId: '',
    active: true, available: true, monthlyFee: 50, perGameFee: 0, notes: '', avatar: '',
  });

  const filteredPlayers = players.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.nickname.toLowerCase().includes(search.toLowerCase());
    const matchPos = !filterPos || p.primaryPositionId === filterPos;
    return matchSearch && matchPos;
  });

  const openAdd = () => {
    setForm({ name: '', nickname: '', phone: '', primaryPositionId: positions[0]?.id || '', secondaryPositionId: '', active: true, available: true, monthlyFee: settings.defaultPaymentAmount, perGameFee: 0, notes: '', avatar: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (player: Player) => {
    setForm({
      name: player.name, nickname: player.nickname, phone: player.phone || '',
      primaryPositionId: player.primaryPositionId, secondaryPositionId: player.secondaryPositionId || '',
      active: player.active, available: player.available, monthlyFee: player.monthlyFee || 0,
      perGameFee: player.perGameFee || 0, notes: player.notes || '', avatar: player.avatar || '',
    });
    setEditingId(player.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePlayer(editingId, form);
    } else {
      addPlayer(form);
    }
    setPlayers(getPlayers());
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deletePlayer(id);
    setPlayers(getPlayers());
    setConfirmDelete(null);
  };

  const getPosColor = (posId: string) => positions.find(p => p.id === posId)?.color || '#6b7280';
  const getPosName = (posId: string) => positions.find(p => p.id === posId)?.name || 'N/A';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Jogadores</h1>
          <p className="text-gray-400 text-sm">{players.length} jogadores cadastrados</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm" style={{ backgroundColor: settings.primaryColor }}>
          <UserPlus size={18} /> Novo Jogador
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Buscar jogador..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500" />
        </div>
        <select value={filterPos} onChange={e => setFilterPos(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
          <option value="">Todas as posições</option>
          {positions.map(pos => <option key={pos.id} value={pos.id}>{pos.name}</option>)}
        </select>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPlayers.map(player => (
          <div key={player.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: getPosColor(player.primaryPositionId) }}>
                  {player.nickname[0]}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{player.nickname}</p>
                  <p className="text-gray-400 text-xs">{player.name}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(player)} className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setConfirmDelete(player.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: getPosColor(player.primaryPositionId) + '22', color: getPosColor(player.primaryPositionId) }}>
                {getPosName(player.primaryPositionId)}
              </span>
              {player.secondaryPositionId && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: getPosColor(player.secondaryPositionId) + '22', color: getPosColor(player.secondaryPositionId) }}>
                  {getPosName(player.secondaryPositionId)}
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${player.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {player.active ? 'Ativo' : 'Inativo'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${player.available ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {player.available ? 'Disponível' : 'Indisponível'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users size={48} className="mx-auto mb-3 opacity-30" />
          <p>Nenhum jogador encontrado</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{editingId ? 'Editar Jogador' : 'Novo Jogador'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Nome completo *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Apelido *</label>
                  <input type="text" required value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Telefone</label>
                  <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Posição principal *</label>
                  <select required value={form.primaryPositionId} onChange={e => setForm({ ...form, primaryPositionId: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                    {positions.map(pos => <option key={pos.id} value={pos.id}>{pos.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Posição secundária</label>
                  <select value={form.secondaryPositionId} onChange={e => setForm({ ...form, secondaryPositionId: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                    <option value="">Nenhuma</option>
                    {positions.map(pos => <option key={pos.id} value={pos.id}>{pos.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Valor mensal (R$)</label>
                  <input type="number" value={form.monthlyFee} onChange={e => setForm({ ...form, monthlyFee: Number(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Valor por jogo (R$)</label>
                  <input type="number" value={form.perGameFee} onChange={e => setForm({ ...form, perGameFee: Number(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Observações</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded" />
                  Ativo
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} className="rounded" />
                  Disponível
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.primaryColor }}>
                  {editingId ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-sm w-full text-center">
            <Trash2 size={40} className="mx-auto text-red-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Confirmar exclusão?</h3>
            <p className="text-gray-400 text-sm mb-4">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
