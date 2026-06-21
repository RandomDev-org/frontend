import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { ZoomIn, ZoomOut, X, Navigation, Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VenueCard } from './VenueCard';

// Mock vacio - conectar al microservicio de venues
const venues: {
  id: number;
  name: string;
  lat: number;
  lng: number;
  genre: string;
  image: string;
  eventName: string;
  band: string;
  time: string;
  attendees: number;
}[] = [];


const genreColors: Record<string, string> = {
  Jazz: '#f59e0b',
  Electrónica: '#06b6d4',
  Rock: '#ef4444',
  'Hip Hop': '#10b981',
  Indie: '#8b5cf6',
};

function createVenueIcon(genre: string, isSelected: boolean) {
  const color = genreColors[genre] ?? '#8b5cf6';
  const size = isSelected ? 44 : 36;
  const ring = isSelected
    ? `box-shadow:0 0 0 3px rgba(255,255,255,0.6),0 4px 20px ${color}bb;`
    : `box-shadow:0 2px 10px ${color}88;`;

  return L.divIcon({
    className: '',
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};
          display:flex;align-items:center;justify-content:center;${ring};transition:all 0.2s;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style="width:2px;height:8px;background:${color};opacity:0.8;"></div>
      </div>`,
  });
}

const userLocationIcon = L.divIcon({
  className: '',
  iconAnchor: [20, 20],
  html: `
    <div style="width:40px;height:40px;border-radius:50%;
      background:rgba(139,92,246,0.2);
      display:flex;align-items:center;justify-content:center;
      animation:pulse 2s ease-in-out infinite;">
      <div style="width:16px;height:16px;border-radius:50%;
        background:#8b5cf6;
        box-shadow:0 0 0 3px rgba(139,92,246,0.5);"></div>
    </div>`,
});

// -----------------------------------------------------------------
// Tipos
// -----------------------------------------------------------------
interface IpLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

type BannerState = 'hidden' | 'visible' | 'loading' | 'denied';

// -----------------------------------------------------------------
// IPLocationInit: vuela a la ciudad por IP al montar
// -----------------------------------------------------------------
function IPLocationInit({
  onFound,
}: {
  onFound: (loc: IpLocation | null) => void;
}) {
  const map = useMap();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        if (data.latitude && data.longitude) {
          map.flyTo([data.latitude, data.longitude], 13, {
            animate: true,
            duration: 1.5,
          });
          onFound({
            lat: data.latitude,
            lng: data.longitude,
            city: data.city ?? '',
            country: data.country_name ?? '',
          });
        } else {
          onFound(null);
        }
      })
      .catch(() => onFound(null));
  }, []);

  return null;
}

// -----------------------------------------------------------------
// MapControls: zoom + boton GPS preciso
// El GPS se resuelve aqui dentro para tener acceso directo a useMap()
// -----------------------------------------------------------------
function MapControls({
  bannerState,
  setBannerState,
}: {
  bannerState: BannerState;
  setBannerState: (s: BannerState) => void;
}) {
  const map = useMap();
  const userMarkerRef = useRef<L.Marker | null>(null);

  const requestGPS = () => {
    if (!navigator.geolocation) {
      setBannerState('denied');
      setTimeout(() => setBannerState('hidden'), 4000);
      return;
    }

    setBannerState('loading');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Eliminar marcador anterior
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        // Colocar marcador preciso
        userMarkerRef.current = L.marker([latitude, longitude], {
          icon: userLocationIcon,
        })
          .addTo(map)
          .bindPopup(
            '<div style="color:#fff;font-size:12px;font-weight:600;">Tu ubicación</div>'
          );

        // Volar a la posicion GPS exacta
        map.flyTo([latitude, longitude], 16, { animate: true, duration: 1.2 });
        setBannerState('hidden');
      },
      (err) => {
        const msg = err.code === err.PERMISSION_DENIED ? 'denied' : 'denied';
        console.warn('Geolocation error:', err.message);
        setBannerState(msg as BannerState);
        setTimeout(() => setBannerState('hidden'), 4000);
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
      <button
        id="map-zoom-in"
        onClick={() => map.zoomIn()}
        title="Acercar"
        className="w-10 h-10 bg-[#1A1A1A]/90 border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all backdrop-blur-sm"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        id="map-zoom-out"
        onClick={() => map.zoomOut()}
        title="Alejar"
        className="w-10 h-10 bg-[#1A1A1A]/90 border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all backdrop-blur-sm"
      >
        <ZoomOut className="w-5 h-5" />
      </button>

      <div className="w-full h-px bg-white/10" />

      <button
        id="map-locate"
        onClick={requestGPS}
        disabled={bannerState === 'loading'}
        title="Mi ubicación exacta"
        className={`w-10 h-10 border rounded-lg flex items-center justify-center active:scale-95 transition-all backdrop-blur-sm ${
          bannerState === 'loading'
            ? 'bg-violet-600/60 border-violet-500/50 text-white cursor-wait'
            : 'bg-[#1A1A1A]/90 border-white/10 text-white hover:bg-violet-600/40 hover:border-violet-500/50'
        }`}
      >
        {bannerState === 'loading'
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <Navigation className="w-5 h-5" />
        }
      </button>
    </div>
  );
}

// -----------------------------------------------------------------
// Componente principal
// -----------------------------------------------------------------
export function Map() {
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [ipLocation, setIpLocation] = useState<IpLocation | null>(null);
  const [bannerState, setBannerState] = useState<BannerState>('hidden');

  // Referencia interna para que MapControls pueda llamar requestGPS
  // via el boton del banner (acepta ubicacion exacta)
  const requestGPSRef = useRef<() => void>(() => {});

  const selectedVenue = venues.find((v) => v.id === selectedVenueId) ?? null;

  const handleIpFound = (loc: IpLocation | null) => {
    if (loc) {
      setIpLocation(loc);
      setBannerState('visible');
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        minZoom={3}
        maxZoom={19}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          noWrap={true}
        />

        {venues.map((venue) => (
          <Marker
            key={venue.id}
            position={[venue.lat, venue.lng]}
            icon={createVenueIcon(venue.genre, selectedVenueId === venue.id)}
            eventHandlers={{
              click: () =>
                setSelectedVenueId(selectedVenueId === venue.id ? null : venue.id),
            }}
          >
            <Popup>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{venue.name}</div>
              <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>{venue.genre}</div>
            </Popup>
          </Marker>
        ))}

        <IPLocationInit onFound={handleIpFound} />

        {/* MapControls expone requestGPS via ref para que el banner pueda invocarlo */}
        <MapControlsWithRef
          bannerState={bannerState}
          setBannerState={setBannerState}
          requestGPSRef={requestGPSRef}
        />
      </MapContainer>

      {/* ----------------------------------------------------------------
          Backdrop difuminado cuando el aviso esta visible
      ----------------------------------------------------------------- */}
      <AnimatePresence>
        {bannerState === 'visible' && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[999]"
            onClick={() => setBannerState('hidden')}
          />
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------
          Modal de ubicacion - centrado sobre el mapa
      ----------------------------------------------------------------- */}
      <AnimatePresence>
        {bannerState === 'visible' && (
          <motion.div
            key="banner"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="absolute inset-0 flex items-center justify-center z-[1000] px-6 pointer-events-none"
          >
            <div className="w-full max-w-md pointer-events-auto">
              <div className="bg-[#161616]/98 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
                {/* Icono */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-violet-400" />
                  </div>
                </div>

                {/* Titulo */}
                <h2 className="text-white text-xl font-bold text-center mb-2">
                  {ipLocation?.city
                    ? `Detectamos que estás en ${ipLocation.city}`
                    : 'Activa tu ubicación'}
                </h2>

                {/* Subtitulo */}
                <p className="text-gray-400 text-sm text-center leading-relaxed mb-8">
                  Activa tu ubicación exacta para descubrir eventos y locales
                  cerca de ti en tiempo real.
                </p>

                {/* Botones */}
                <div className="flex flex-col gap-3">
                  <button
                    id="banner-accept-location"
                    onClick={() => requestGPSRef.current()}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/30 active:scale-[0.98] transition-all"
                  >
                    Activar ubicación exacta
                  </button>
                  <button
                    id="banner-dismiss-location"
                    onClick={() => setBannerState('hidden')}
                    className="w-full py-3 bg-white/5 border border-white/10 text-gray-400 font-medium rounded-xl hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all"
                  >
                    Continuar sin activar
                  </button>
                </div>

                {/* Nota de privacidad */}
                <p className="text-gray-600 text-xs text-center mt-5">
                  Tu ubicación no se almacena ni se comparte con terceros.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Toast: obteniendo GPS */}
        {bannerState === 'loading' && (
          <motion.div
            key="loading-toast"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001]"
          >
            <div className="bg-[#1A1A1A]/95 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl">
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin shrink-0" />
              <span className="text-sm text-white whitespace-nowrap">Obteniendo tu ubicación...</span>
            </div>
          </motion.div>
        )}

        {/* Toast: permiso denegado */}
        {bannerState === 'denied' && (
          <motion.div
            key="denied-toast"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001]"
          >
            <div className="bg-[#1A1A1A]/95 backdrop-blur-md border border-red-500/20 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <p className="text-sm text-white font-medium whitespace-nowrap">Permiso denegado</p>
                <p className="text-xs text-gray-400">Actívalo en la configuración del navegador.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card del venue seleccionado */}
      <AnimatePresence>
        {selectedVenue && (
          <motion.div
            key={selectedVenue.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-6 md:left-6 md:translate-x-0 w-[calc(100%-2rem)] max-w-sm z-[1000]"
          >
            <div className="relative">
              <button
                id="btn-close-venue-card"
                onClick={() => setSelectedVenueId(null)}
                className="absolute -top-3 -right-3 z-10 w-7 h-7 bg-[#1A1A1A] border border-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-all shadow-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <VenueCard
                image={selectedVenue.image}
                venueName={selectedVenue.name}
                eventName={selectedVenue.eventName}
                band={selectedVenue.band}
                time={selectedVenue.time}
                attendees={selectedVenue.attendees}
                genre={selectedVenue.genre}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-1 right-2 text-[10px] text-white/30 z-[999] pointer-events-none select-none">
        MusicSpot Maps
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// Wrapper de MapControls que expone requestGPS via ref externo
// -----------------------------------------------------------------
function MapControlsWithRef({
  bannerState,
  setBannerState,
  requestGPSRef,
}: {
  bannerState: BannerState;
  setBannerState: (s: BannerState) => void;
  requestGPSRef: React.MutableRefObject<() => void>;
}) {
  const map = useMap();
  const userMarkerRef = useRef<L.Marker | null>(null);

  const requestGPS = () => {
    if (!navigator.geolocation) {
      setBannerState('denied');
      setTimeout(() => setBannerState('hidden'), 4000);
      return;
    }

    setBannerState('loading');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        userMarkerRef.current = L.marker([latitude, longitude], {
          icon: userLocationIcon,
        })
          .addTo(map)
          .bindPopup(
            '<div style="color:#fff;font-size:12px;font-weight:600;">Tu ubicación</div>'
          );

        map.flyTo([latitude, longitude], 16, { animate: true, duration: 1.2 });
        setBannerState('hidden');
      },
      () => {
        setBannerState('denied');
        setTimeout(() => setBannerState('hidden'), 4000);
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  };

  // Exponer requestGPS al componente padre via ref
  requestGPSRef.current = requestGPS;

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
      <button
        id="map-zoom-in"
        onClick={() => map.zoomIn()}
        title="Acercar"
        className="w-10 h-10 bg-[#1A1A1A]/90 border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all backdrop-blur-sm"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        id="map-zoom-out"
        onClick={() => map.zoomOut()}
        title="Alejar"
        className="w-10 h-10 bg-[#1A1A1A]/90 border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all backdrop-blur-sm"
      >
        <ZoomOut className="w-5 h-5" />
      </button>

      <div className="w-full h-px bg-white/10" />

      <button
        id="map-locate"
        onClick={requestGPS}
        disabled={bannerState === 'loading'}
        title="Mi ubicación exacta"
        className={`w-10 h-10 border rounded-lg flex items-center justify-center active:scale-95 transition-all backdrop-blur-sm ${
          bannerState === 'loading'
            ? 'bg-violet-600/60 border-violet-500/50 text-white cursor-wait'
            : 'bg-[#1A1A1A]/90 border-white/10 text-white hover:bg-violet-600/40 hover:border-violet-500/50'
        }`}
      >
        {bannerState === 'loading'
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <Navigation className="w-5 h-5" />
        }
      </button>
    </div>
  );
}
