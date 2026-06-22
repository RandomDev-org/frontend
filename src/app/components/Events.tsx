import { useState, useEffect } from 'react';
import { Plus, X, Calendar, Clock, Music2, Loader2 } from 'lucide-react';
import { eventsService, type EventItem } from '../../services/events.service';
import { mapsService } from '../../services/maps.service';
import type { Venue } from '../../services/api';
import { useAuth } from '../contexts/AuthContext';

export function Events() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [musicGenre, setMusicGenre] = useState('');
  const [artists, setArtists] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [ticketPrice, setTicketPrice] = useState('');
  const [pointId, setPointId] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvents();
    mapsService.findAll().then(setVenues).catch(() => {});
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventsService.findAll();
      setEvents(data);
    } catch { /* no events yet */ }
    setLoading(false);
  };

  const handleCreate = async () => {
    setError('');
    if (!name || !date || !startTime || !pointId) {
      setError('Completa los campos obligatorios');
      return;
    }
    setSaving(true);
    try {
      await eventsService.create({
        pointId,
        name,
        description: description || undefined,
        date,
        startTime,
        endTime: endTime || undefined,
        musicGenre: musicGenre || undefined,
        artists: artists ? artists.split(',').map(a => a.trim()) : undefined,
        isFree: isFree || undefined,
        ticketPrice: ticketPrice ? parseFloat(ticketPrice) : undefined,
      });
      setShowForm(false);
      setName(''); setDescription(''); setDate(''); setStartTime('');
      setEndTime(''); setMusicGenre(''); setArtists('');
      setIsFree(false); setTicketPrice(''); setPointId('');
      loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear evento');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await eventsService.remove(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch { /* ignore */ }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Eventos</h1>
          {isAuthenticated && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Nuevo evento
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">{error}</div>
        )}

        {showForm && (
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Crear evento</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-400">Local *</label>
                <select value={pointId} onChange={e => setPointId(e.target.value)}
                  className="w-full bg-[#121212] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-violet-500 outline-none">
                  <option value="">Seleccionar local</option>
                  {venues.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400">Nombre del evento *</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-[#121212] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-violet-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400">Descripción</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  className="w-full bg-[#121212] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-violet-500 outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Fecha *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#121212] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-violet-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Hora inicio *</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-[#121212] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-violet-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Hora fin</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-[#121212] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-violet-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Género musical</label>
                <input value={musicGenre} onChange={e => setMusicGenre(e.target.value)}
                  className="w-full bg-[#121212] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-violet-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400">Artistas (separados por coma)</label>
                <input value={artists} onChange={e => setArtists(e.target.value)}
                  placeholder="Banda A, Banda B..."
                  className="w-full bg-[#121212] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-violet-500 outline-none" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)}
                    className="accent-violet-500" />
                  Gratuito
                </label>
                {!isFree && (
                  <input type="number" value={ticketPrice} onChange={e => setTicketPrice(e.target.value)}
                    placeholder="Precio" step="0.01"
                    className="w-24 bg-[#121212] text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-violet-500 outline-none" />
                )}
              </div>
            </div>
            <button onClick={handleCreate} disabled={saving}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? 'Creando...' : 'Crear evento'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl py-20 text-center">
            <p className="text-gray-400 text-sm">No hay eventos todavía</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(event => (
              <div key={event.id} className="bg-[#1A1A1A] rounded-xl border border-white/10 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-white">{event.name}</h3>
                  {isAuthenticated && (
                    <button onClick={() => handleDelete(event.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {event.description && (
                  <p className="text-xs text-gray-400">{event.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {event.startTime.slice(0, 5)}{event.endTime ? ` - ${event.endTime.slice(0, 5)}` : ''}
                  </span>
                  {event.musicGenre && (
                    <span className="flex items-center gap-1">
                      <Music2 className="w-3.5 h-3.5" />
                      {event.musicGenre}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    {event.isFree ? 'Gratis' : `$${event.ticketPrice}`}
                  </span>
                </div>
                {event.artists && event.artists.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {event.artists.map((a, i) => (
                      <span key={i} className="text-xs bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
