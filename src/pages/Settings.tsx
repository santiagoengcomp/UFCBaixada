import { useState } from 'react';
import { Save, RotateCcw, Palette, Type, Image, ToggleLeft } from 'lucide-react';
import { getSettings, saveSettings, getFormations, resetStore } from '../store';
import type { AppSettings } from '../types';

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const formations = getFormations();
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetStore();
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400 text-sm">Personalize o sistema</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowReset(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30">
            <RotateCcw size={16} /> Resetar
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.primaryColor }}>
            <Save size={16} /> {saved ? 'Salvo!' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Team Info */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Type size={18} className="text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Informações do Time</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nome do Time</label>
            <input type="text" value={settings.teamName} onChange={e => setSettings({ ...settings, teamName: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Apelido</label>
            <input type="text" value={settings.teamNickname} onChange={e => setSettings({ ...settings, teamNickname: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Temporada</label>
            <input type="text" value={settings.seasonName} onChange={e => setSettings({ ...settings, seasonName: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Logo URL</label>
            <input type="url" value={settings.logoUrl} onChange={e => setSettings({ ...settings, logoUrl: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette size={18} className="text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Cores</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Cor Primária</label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0" />
              <input type="text" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Cor Secundária</label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.secondaryColor} onChange={e => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0" />
              <input type="text" value={settings.secondaryColor} onChange={e => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Cor de Destaque</label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.accentColor} onChange={e => setSettings({ ...settings, accentColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0" />
              <input type="text" value={settings.accentColor} onChange={e => setSettings({ ...settings, accentColor: e.target.value })}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
            </div>
          </div>
        </div>
        {/* Preview */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: settings.primaryColor }} />
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: settings.secondaryColor }} />
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: settings.accentColor }} />
          <span className="text-xs text-gray-400 ml-2">Preview</span>
        </div>
      </div>

      {/* Texts */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Image size={18} className="text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Textos</h3>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Texto do Cabeçalho</label>
          <input type="text" value={settings.headerText} onChange={e => setSettings({ ...settings, headerText: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Texto do Rodapé</label>
          <input type="text" value={settings.footerText} onChange={e => setSettings({ ...settings, footerText: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
        </div>
      </div>

      {/* Defaults */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-4">
        <h3 className="text-lg font-semibold text-white">Padrões</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Formação Padrão</label>
            <select value={settings.defaultFormationId} onChange={e => setSettings({ ...settings, defaultFormationId: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
              {formations.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Valor Padrão (R$)</label>
            <input type="number" value={settings.defaultPaymentAmount} onChange={e => setSettings({ ...settings, defaultPaymentAmount: Number(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ToggleLeft size={18} className="text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Módulos</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(settings.modulesEnabled).map(([key, value]) => {
            const labels: Record<string, string> = {
              players: 'Jogadores', payments: 'Pagamentos', goals: 'Artilharia',
              assists: 'Assistências', matches: 'Partidas', draw: 'Sorteio', virtualField: 'Campo Virtual',
            };
            return (
              <label key={key} className="flex items-center gap-2 p-2 rounded-lg bg-gray-700/30 cursor-pointer">
                <input type="checkbox" checked={value}
                  onChange={e => setSettings({ ...settings, modulesEnabled: { ...settings.modulesEnabled, [key]: e.target.checked } })}
                  className="rounded" />
                <span className="text-sm text-gray-300">{labels[key] || key}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Reset Confirm */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-sm w-full text-center">
            <RotateCcw size={40} className="mx-auto text-red-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Resetar Sistema?</h3>
            <p className="text-gray-400 text-sm mb-4">Todos os dados serão perdidos e restaurados ao padrão. Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm">Cancelar</button>
              <button onClick={handleReset} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium">Resetar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
