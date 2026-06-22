import { useState } from 'react';
import { useNavigate } from '../contexts/NavigateContext';
import { api } from '../../services/api';

const VENUE_TYPES = [
  'Bar', 'Sala de Conciertos', 'Plaza', 'Centro Cultural',
  'Estudio', 'Discoteca', 'Café con Música Viva', 'Galería de Arte',
] as const;

export function VenueForm() {
  const { onTabChange } = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [capacity, setCapacity] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!name || !type || !lat || !lng) {
      setError('Completa nombre, tipo y ubicación');
      return;
    }
    setSaving(true);
    try {
      await api.post('/map/points', {
        name,
        description: description || undefined,
        type,
        address: address || undefined,
        phone: phone || undefined,
        capacity: capacity ? parseInt(capacity) : undefined,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
      onTabChange('mapa');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    }
    setSaving(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-lg mx-auto p-4 md:p-6 space-y-6">
        <h1 className="text-xl font-bold text-white">Publicar mi local</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">{error}</div>
        )}

        <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Nombre del local *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none resize-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Tipo *</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none">
              <option value="">Seleccionar tipo</option>
              {VENUE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Dirección</label>
            <input value={address} onChange={e => setAddress(e.target.value)}
              className="w-full bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Teléfono</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Capacidad</label>
              <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)}
                className="w-full bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400">Ubicación *</label>
            <div className="grid grid-cols-2 gap-3">
              <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitud"
                className="w-full bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none" />
              <input value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitud"
                className="w-full bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none" />
            </div>
            <p className="text-xs text-gray-500">
              Sugerencia: abrí{' '}
              <button onClick={() => onTabChange('mapa')} className="text-violet-400 hover:underline">
                el mapa
              </button>
              , buscá tu local y copiá las coordenadas del popup
            </p>
          </div>

          <button onClick={handleSubmit} disabled={saving}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? 'Publicando...' : 'Publicar local'}
          </button>
        </div>
      </div>
    </div>
  );
}
