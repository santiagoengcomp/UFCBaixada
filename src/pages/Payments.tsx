import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, Search, Check, DollarSign, AlertTriangle, CreditCard } from 'lucide-react';
import { getPayments, getPlayers, addPayment, updatePayment, deletePayment, getSettings } from '../store';
import type { Payment } from '../types';

export default function Payments() {
  const [payments, setPayments] = useState(getPayments());
  const players = getPlayers();
  const settings = getSettings();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const [form, setForm] = useState({
    playerId: '', type: 'monthly' as Payment['type'], reference: '', amount: settings.defaultPaymentAmount,
    status: 'pending' as Payment['status'], method: 'pix' as Payment['method'],
    dueDate: '', paidDate: '', observation: '',
  });

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const player = players.find(pl => pl.id === p.playerId);
      const matchSearch = !search || player?.name.toLowerCase().includes(search.toLowerCase()) || player?.nickname.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || p.status === filterStatus;
      const matchMonth = !filterMonth || p.reference === filterMonth;
      return matchSearch && matchStatus && matchMonth;
    });
  }, [payments, players, search, filterStatus, filterMonth]);

  const stats = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pending = payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
    return { total, paid, pending };
  }, [payments]);

  const openAdd = () => {
    setForm({ playerId: players[0]?.id || '', type: 'monthly', reference: new Date().toISOString().slice(0, 7), amount: settings.defaultPaymentAmount, status: 'pending', method: 'pix', dueDate: '', paidDate: '', observation: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (payment: Payment) => {
    setForm({ playerId: payment.playerId, type: payment.type, reference: payment.reference, amount: payment.amount, status: payment.status, method: payment.method || 'pix', dueDate: payment.dueDate, paidDate: payment.paidDate || '', observation: payment.observation || '' });
    setEditingId(payment.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePayment(editingId, form);
    } else {
      addPayment(form);
    }
    setPayments(getPayments());
    setShowForm(false);
  };

  const markAsPaid = (id: string) => {
    updatePayment(id, { status: 'paid', paidDate: new Date().toISOString().split('T')[0] });
    setPayments(getPayments());
  };

  const handleDelete = (id: string) => {
    deletePayment(id);
    setPayments(getPayments());
  };

  const statusColors: Record<string, string> = {
    paid: 'bg-green-500/20 text-green-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    overdue: 'bg-red-500/20 text-red-400',
    exempt: 'bg-gray-500/20 text-gray-400',
  };
  const statusLabels: Record<string, string> = {
    paid: 'Pago', pending: 'Pendente', overdue: 'Atrasado', exempt: 'Isento',
  };
  const typeLabels: Record<string, string> = {
    monthly: 'Mensal', game: 'Jogo', extra: 'Extra', other: 'Outro',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Pagamentos</h1>
          <p className="text-gray-400 text-sm">{payments.length} registros</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm" style={{ backgroundColor: settings.primaryColor }}>
          <Plus size={18} /> Novo Pagamento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-green-400" />
            <span className="text-xs text-gray-400">Recebido</span>
          </div>
          <p className="text-lg font-bold text-green-400">R$ {stats.paid}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-400">Pendente</span>
          </div>
          <p className="text-lg font-bold text-yellow-400">R$ {stats.pending}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={14} className="text-blue-400" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-lg font-bold text-blue-400">R$ {stats.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Buscar jogador..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
          <option value="">Todos status</option>
          <option value="paid">Pago</option>
          <option value="pending">Pendente</option>
          <option value="overdue">Atrasado</option>
          <option value="exempt">Isento</option>
        </select>
        <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Jogador</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Tipo</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Referência</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Valor</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => {
                const player = players.find(p => p.id === payment.playerId);
                return (
                  <tr key={payment.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{player?.nickname || 'N/A'}</p>
                      <p className="text-xs text-gray-400 sm:hidden">{typeLabels[payment.type]} • {payment.reference}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">{typeLabels[payment.type]}</td>
                    <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{payment.reference}</td>
                    <td className="px-4 py-3 text-white font-medium">R$ {payment.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[payment.status]}`}>
                        {statusLabels[payment.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {payment.status !== 'paid' && (
                          <button onClick={() => markAsPaid(payment.id)} className="p-1.5 rounded hover:bg-green-500/20 text-green-400" title="Marcar como pago">
                            <Check size={14} />
                          </button>
                        )}
                        <button onClick={() => openEdit(payment)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(payment.id)} className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CreditCard size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum pagamento encontrado</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{editingId ? 'Editar Pagamento' : 'Novo Pagamento'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Jogador *</label>
                <select required value={form.playerId} onChange={e => setForm({ ...form, playerId: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                  {players.map(p => <option key={p.id} value={p.id}>{p.nickname} - {p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Payment['type'] })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                    <option value="monthly">Mensal</option>
                    <option value="game">Jogo</option>
                    <option value="extra">Extra</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Referência (mês)</label>
                  <input type="month" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Valor (R$) *</label>
                  <input type="number" required min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Payment['status'] })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                    <option value="pending">Pendente</option>
                    <option value="paid">Pago</option>
                    <option value="overdue">Atrasado</option>
                    <option value="exempt">Isento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Método</label>
                  <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value as Payment['method'] })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                    <option value="pix">Pix</option>
                    <option value="cash">Dinheiro</option>
                    <option value="card">Cartão</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Vencimento</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
              </div>
              {form.status === 'paid' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Data do Pagamento</label>
                  <input type="date" value={form.paidDate} onChange={e => setForm({ ...form, paidDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Observação</label>
                <textarea value={form.observation} onChange={e => setForm({ ...form, observation: e.target.value })} rows={2}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
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
