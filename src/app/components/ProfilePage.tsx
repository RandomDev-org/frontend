import { useState, useEffect, type FormEvent } from 'react';
import { User, Mail, Phone, MapPin, Music2, History, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../../services/api';
import { profileService, type UserPreferences } from '../../services/profile.service';

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<'profile' | 'preferences' | 'history'>('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');

  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [genresStr, setGenresStr] = useState('');

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    loadProfile();
    loadPreferences();
    loadHistory();
  }, [user?.id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await api.get<any>(`/profiles/${user!.id}`);
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phoneNumber ?? '');
      setUsername(data.username ?? '');
    } catch { /* ignore */ }
    setLoading(false);
  };

  const loadPreferences = async () => {
    try {
      const data = await profileService.getPreferences(user!.id);
      setPrefs(data);
      setGenresStr(data.preferredGenres?.join(', ') ?? '');
    } catch { /* no prefs yet */ }
  };

  const loadHistory = async () => {
    try {
      const data = await api.get<{ data: any[] }>(`/profiles/${user!.id}/history`);
      setHistory(data.data ?? []);
    } catch { /* ignore */ }
  };

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await api.patch(`/profiles/${user!.id}`, {
        name,
        email,
        phoneNumber: phone || undefined,
        username: username || undefined,
      });
      setSuccess('Perfil actualizado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
    setSaving(false);
  };

  const savePreferences = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const genres = genresStr.split(',').map(g => g.trim()).filter(Boolean);
      await profileService.updatePreferences(user!.id, { preferredGenres: genres });
      setSuccess('Preferencias actualizadas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
    setSaving(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Inicia sesión para ver tu perfil
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{user?.name}</h1>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-white/10 pb-2">
          {[
            { id: 'profile', label: 'Perfil', icon: User },
            { id: 'preferences', label: 'Preferencias', icon: Music2 },
            { id: 'history', label: 'Historial', icon: History },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                tab === t.id
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">{error}</div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-400">{success}</div>
        )}

        {tab === 'profile' && (
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-[#1A1A1A] text-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#1A1A1A] text-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full bg-[#1A1A1A] text-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#1A1A1A] text-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none"
                />
              </div>
            </div>
            <button
              type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar
            </button>
          </form>
        )}

        {tab === 'preferences' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Géneros musicales (separados por coma)</label>
              <input
                value={genresStr} onChange={e => setGenresStr(e.target.value)}
                placeholder="Jazz, Rock, Electrónica..."
                className="w-full bg-[#1A1A1A] text-white rounded-lg px-4 py-2.5 text-sm border border-white/10 focus:border-violet-500 outline-none"
              />
            </div>
            <button
              onClick={savePreferences} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar preferencias
            </button>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-sm text-gray-400">No hay historial todavía</p>
            ) : (
              history.map((entry: any) => (
                <div key={entry.id} className="bg-[#1A1A1A] rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-white">{entry.role}</p>
                  <p className="text-xs text-gray-400">{entry.genre && `${entry.genre} · `}{new Date(entry.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
