import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { VenueCard } from './VenueCard';
import { motion } from 'motion/react';
import type { Venue } from '../../services/api';

const genres = ['Jazz', 'Rock', 'Electrónica', 'Hip Hop', 'Indie', 'Blues'];

export function Sidebar({
  venues,
  searchQuery,
  onSearchChange,
  selectedGenres,
  onGenresChange,
  onVenueSelect,
}: {
  venues: Venue[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGenres: string[];
  onGenresChange: (g: string[]) => void;
  onVenueSelect: (id: string) => void;
}) {
  const toggleGenre = (genre: string) => {
    onGenresChange(
      selectedGenres.includes(genre)
        ? selectedGenres.filter((g) => g !== genre)
        : [...selectedGenres, genre]
    );
  };

  return (
    <div className="h-full bg-[#0F0F0F] border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar lugares..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>
      </div>

      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filtrar por tipo</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <motion.button
              key={genre}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                selectedGenres.includes(genre)
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-[#1A1A1A] text-gray-400 border border-white/10 hover:border-violet-500/30 hover:text-white'
              }`}
            >
              {genre}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 border-b border-white/10">
        <p className="text-xs text-gray-500">
          {venues.length}{' '}
          {venues.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {venues.map((venue, index) => (
          <motion.div
            key={venue.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onVenueSelect(venue.id)}
          >
            <VenueCard
              image=""
              venueName={venue.name}
              eventName={venue.name}
              band=""
              time=""
              attendees={0}
              genre={venue.type}
            />
          </motion.div>
        ))}

        {venues.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              {searchQuery || selectedGenres.length > 0
                ? 'Sin resultados'
                : 'Aún no hay lugares por aquí'}
            </p>
            <p className="text-gray-600 text-xs leading-relaxed max-w-[200px]">
              {searchQuery || selectedGenres.length > 0
                ? 'Intenta con otros filtros.'
                : 'Navega por el mapa para descubrir lugares.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
