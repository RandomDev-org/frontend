import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { VenueCard } from './VenueCard';
import { motion } from 'motion/react';
import { useState } from 'react';

const genres = ['Jazz', 'Rock', 'Electrónica', 'Hip Hop', 'Indie', 'Blues'];

// Conectar al microservicio de venues cuando este disponible
const mockVenues: {
  id: number;
  image: string;
  venueName: string;
  eventName: string;
  band: string;
  time: string;
  attendees: number;
  genre: string;
}[] = [];

export function Sidebar() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const filteredVenues = mockVenues.filter((venue) => {
    const matchesGenre =
      selectedGenres.length === 0 || selectedGenres.includes(venue.genre);
    const matchesSearch =
      searchQuery === '' ||
      venue.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.band.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.venueName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="h-full bg-[#0F0F0F] border-r border-white/10 flex flex-col">
      {/* Buscador */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            id="sidebar-search"
            type="text"
            placeholder="Buscar eventos, bandas o lugares..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>
      </div>

      {/* Filtros de genero */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filtrar por género</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <motion.button
              key={genre}
              id={`filter-genre-${genre.replace(/\s+/g, '-').toLowerCase()}`}
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

      {/* Contador */}
      <div className="px-4 py-2 border-b border-white/10">
        <p className="text-xs text-gray-500">
          {filteredVenues.length}{' '}
          {filteredVenues.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
        </p>
      </div>

      {/* Lista de venues */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {filteredVenues.map((venue, index) => (
          <motion.div
            key={venue.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <VenueCard {...venue} />
          </motion.div>
        ))}

        {/* Estado vacio */}
        {filteredVenues.length === 0 && (
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
                : 'Ups, aún no hay nada por aquí'}
            </p>
            <p className="text-gray-600 text-xs leading-relaxed max-w-[200px]">
              {searchQuery || selectedGenres.length > 0
                ? 'Intenta con otros filtros o términos.'
                : 'Puedes volver a revisar más tarde, actualizamos el contenido frecuentemente.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
