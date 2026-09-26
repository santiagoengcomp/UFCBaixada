import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, MapPin } from 'lucide-react';
import { getMatches, getPlayers, getPositions, addMatch, updateMatch, deleteMatch, getSettings } from '../store';
import type { Match } from '../types';

export default function Matches() {
  const [matches, setMatches] = useState(getMatches());
  const players = getPlayers();
  const positions = getPositions();
  const settings = getSettings();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({ date: '', location: '', observation: '', status: 'scheduled' as Match['status'] });

  const openAdd = () => {
    setForm({ date: new Date().toISOString().split('T')[0], location: '', observation: '', status: 'scheduled' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (match: Match) => {
    setForm({ date: match.date, location: match.location || '', observation: match.observation || '', status: match.status });
    setEditingId(match.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMatch(editingId, form);
    } else {
      addMatch({ ...form, teams: [] });
    }
    setMatches(getMatches());
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteMatch(id);
    setMatches(getMatches());
  };

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-500/20 text-blue-400',
    finished: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };
  const statusLabels: Record<string, string> = {
    scheduled: 'Agendada', finished: 'Finalizada', cancelled: 'Cancelada',
  };

  const getPosColor = (posId: string) => positions.find(p => p.id === posId)?.color || '#6b7280';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Partidas</h1>
          <p className="text-gray-400 text-sm">{matches.length} partidas registradas</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm" style={{ backgroundColor: settings.primaryColor }}>
          <Plus size={18} /> Nova Partida
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {matches.sort((a, b) => b.date.localeCompare(a.date)).map(match => (
          <div key={match.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-white font-medium text-sm">{match.date}</p>
                  <div className="flex items-center gap-2">
                    {match.location && <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} />{match.location}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[match.status]}`}>{statusLabels[match.status]}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(match)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(match.id)} className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>

            {/* Teams */}
            {match.teams.length > 0 && (
              <div className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {match.teams.map(team => (
                    <div key={team.id} className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
                        <h4 className="text-white text-sm font-medium">{team.name}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {team.playerIds.map(pid => {
                          const player = players.find(p => p.id === pid);
                          if (!player) return null;
                          return (
                            <span key={pid} className="text-xs px-2 py-0.5 rounded-full bg-gray-600/50 text-gray-300 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getPosColor(player.primaryPositionId) }} />
                              {player.nickname}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {match.observation && (
              <div className="px-4 pb-3">
                <p className="text-xs text-gray-400">{match.observation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Calendar size={48} className="mx-auto mb-3 opacity-30" />
          <p>Nenhuma partida registrada</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{editingId ? 'Editar Partida' : 'Nova Partida'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Data *</label>
                <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Local</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" placeholder="Ex: Campo do Parque" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Match['status'] })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                  <option value="scheduled">Agendada</option>
                  <option value="finished">Finalizada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
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
