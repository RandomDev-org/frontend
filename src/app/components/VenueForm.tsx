import { useState, useRef } from 'react';
import { useNavigate } from '../contexts/NavigateContext';
import { api } from '../../services/api';

const VENUE_TYPES = [
  'Bar', 'Sala de Conciertos', 'Plaza', 'Centro Cultural',
  'Estudio', 'Discoteca', 'Café con Música Viva', 'Galería de Arte',
] as const;

export function VenueForm() {
  const { onTabChange } = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [capacity, setCapacity] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [poster, setPoster] = useState('');
  const [posterPreview, setPosterPreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('La imagen no puede superar los 5 MB. Seleccioná una más pequeña.');
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_W = 1200;
      let { width, height } = img;
      if (width > MAX_W) {
        height = Math.round((height * MAX_W) / width);
        width = MAX_W;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPosterPreview(dataUrl);
      setPoster(dataUrl);
    };
    img.src = URL.createObjectURL(file);
  };

  const searchAddress = async () => {
    if (!address.trim()) return;
    setSearching(true);
    setError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
        { headers: { 'User-Agent': 'MusicSpot/1.0' } },
      );
      const data = await res.json();
      if (data.length > 0) {
        const r = data[0];
        setLat(r.lat);
        setLng(r.lon);
        setAddress(r.display_name);
      } else {
        setError('No se encontró la dirección. Probá con más detalles (ciudad, país)');
      }
    } catch {
      setError('Error al buscar dirección');
    }
    setSearching(false);
  };

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
        poster: poster || undefined,
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
            <label className="text-xs text-gray-400">Dirección *</label>
            <div className="flex gap-2">
              <input value={address} onChange={e => setAddress(e.target.value)}
                placeholder="Ej: Av. Larco 123, Miraflores"
                className="flex-1 bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none" />
              <button onClick={searchAddress} disabled={searching || !address.trim()}
                className="px-4 py-2.5 rounded-lg bg-violet-500/20 text-violet-300 text-sm hover:bg-violet-500/30 transition-colors disabled:opacity-50 whitespace-nowrap">
                {searching ? '...' : 'Buscar'}
              </button>
            </div>
            {lat && lng && (
              <p className="text-xs text-gray-500">
                Ubicación encontrada: {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Ingresá la dirección y presioná "Buscar" para ubicarlo automáticamente
            </p>
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

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Imagen del local</label>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
            <div className="flex items-center gap-3">
              <button onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-[#121212] text-gray-300 text-sm border border-white/10 hover:border-violet-500 transition-colors">
                Seleccionar imagen
              </button>
              <span className="text-xs text-gray-500">PNG, JPG</span>
            </div>
            {posterPreview && (
              <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                <img src={posterPreview} alt="Preview" className="w-full h-32 object-cover" />
              </div>
            )}
            <p className="text-xs text-gray-500">
              También podés pegar una URL de imagen en el campo dirección
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400">O URL de imagen</label>
            <input value={poster} onChange={e => { setPoster(e.target.value); setPosterPreview(e.target.value); }}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full bg-[#121212] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none" />
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
