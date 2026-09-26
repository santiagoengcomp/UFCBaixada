import { useState } from 'react';
import { Plus, Edit2, Trash2, X, GripVertical } from 'lucide-react';
import { getPositions, savePositions, addPosition, updatePosition, deletePosition, getFormations, saveFormations, addFormation, getSettings } from '../store';
import type { Position, Formation, FormationSlot } from '../types';

export default function Positions() {
  const [positions, setPositions] = useState(getPositions());
  const [formations, setFormations] = useState(getFormations());
  const settings = getSettings();
  const [tab, setTab] = useState<'positions' | 'formations'>('positions');
  const [showPosForm, setShowPosForm] = useState(false);
  const [showFormForm, setShowFormForm] = useState(false);
  const [editingPos, setEditingPos] = useState<string | null>(null);
  const [posForm, setPosForm] = useState({ name: '', abbreviation: '', color: '#3b82f6', order: 1, active: true });

  const openAddPos = () => {
    setPosForm({ name: '', abbreviation: '', color: '#3b82f6', order: positions.length + 1, active: true });
    setEditingPos(null);
    setShowPosForm(true);
  };

  const openEditPos = (pos: Position) => {
    setPosForm({ name: pos.name, abbreviation: pos.abbreviation, color: pos.color, order: pos.order, active: pos.active });
    setEditingPos(pos.id);
    setShowPosForm(true);
  };

  const handlePosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPos) {
      updatePosition(editingPos, posForm);
    } else {
      addPosition(posForm);
    }
    setPositions(getPositions());
    setShowPosForm(false);
  };

  const handleDeletePos = (id: string) => {
    deletePosition(id);
    setPositions(getPositions());
  };

  const [formForm, setFormForm] = useState({ name: '', slots: [] as FormationSlot[] });

  const openAddForm = () => {
    setFormForm({ name: '', slots: [] });
    setShowFormForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFormation(formForm);
    setFormations(getFormations());
    setShowFormForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Posições & Formações</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-2">
        <button onClick={() => setTab('positions')} className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${tab === 'positions' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}>
          Posições
        </button>
        <button onClick={() => setTab('formations')} className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${tab === 'formations' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}>
          Formações
        </button>
      </div>

      {/* Positions Tab */}
      {tab === 'positions' && (
        <div className="space-y-4">
          <button onClick={openAddPos} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.primaryColor }}>
            <Plus size={16} /> Nova Posição
          </button>

          <div className="space-y-2">
            {positions.sort((a, b) => a.order - b.order).map(pos => (
              <div key={pos.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center gap-4">
                <GripVertical size={16} className="text-gray-500" />
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: pos.color }} />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{pos.name}</p>
                  <p className="text-gray-400 text-xs">Abreviação: {pos.abbreviation} • Ordem: {pos.order}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${pos.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {pos.active ? 'Ativa' : 'Inativa'}
                </span>
                <button onClick={() => openEditPos(pos)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400"><Edit2 size={14} /></button>
                <button onClick={() => handleDeletePos(pos.id)} className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formations Tab */}
      {tab === 'formations' && (
        <div className="space-y-4">
          <button onClick={openAddForm} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.primaryColor }}>
            <Plus size={16} /> Nova Formação
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formations.map(form => (
              <div key={form.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="text-white font-semibold mb-2">{form.name}</h3>
                <p className="text-gray-400 text-xs mb-3">{form.slots.length} posições</p>
                {/* Mini field preview */}
                <div className="relative bg-green-900/30 rounded-lg h-48 border border-green-800/50">
                  {form.slots.map((slot, i) => (
                    <div key={i} className="absolute w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-[8px] font-bold text-gray-800 transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                      {slot.label.slice(0, 3)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Position Form Modal */}
      {showPosForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{editingPos ? 'Editar Posição' : 'Nova Posição'}</h3>
              <button onClick={() => setShowPosForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handlePosSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nome *</label>
                <input type="text" required value={posForm.name} onChange={e => setPosForm({ ...posForm, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Abreviação *</label>
                  <input type="text" required maxLength={4} value={posForm.abbreviation} onChange={e => setPosForm({ ...posForm, abbreviation: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Ordem</label>
                  <input type="number" value={posForm.order} onChange={e => setPosForm({ ...posForm, order: Number(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Cor</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={posForm.color} onChange={e => setPosForm({ ...posForm, color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer" />
                  <input type="text" value={posForm.color} onChange={e => setPosForm({ ...posForm, color: e.target.value })}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={posForm.active} onChange={e => setPosForm({ ...posForm, active: e.target.checked })} className="rounded" />
                Ativa
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPosForm(false)} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.primaryColor }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formation Form Modal */}
      {showFormForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Nova Formação</h3>
              <button onClick={() => setShowFormForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nome (ex: 4-3-3) *</label>
                <input type="text" required value={formForm.name} onChange={e => setFormForm({ ...formForm, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
              </div>
              <p className="text-xs text-gray-400">Dica: Duplicar uma formação existente e editar os slots pelo console ou usar as formações padrão.</p>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowFormForm(false)} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.primaryColor }}>Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
