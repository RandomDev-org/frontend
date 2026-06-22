import { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Map } from './Map';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mapsService } from '../../services/maps.service';
import type { Venue } from '../../services/api';

export function MapView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const fetchBounds = useCallback(
    async (neLat: number, neLng: number, swLat: number, swLng: number) => {
      try {
        const data = await mapsService.findByBounds(neLat, neLng, swLat, swLng);
        setVenues(data);
      } catch {
        // gateway o maps caido; mantener datos anteriores
      }
    },
    [],
  );

  const filteredVenues = venues.filter((v) => {
    const matchesGenre =
      selectedGenres.length === 0 || selectedGenres.includes(v.type);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      v.name.toLowerCase().includes(q) ||
      (v.address ?? '').toLowerCase().includes(q);
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-20 left-4 z-50 w-12 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-violet-500/50 transition-all"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <SlidersHorizontal className="w-6 h-6" />
        )}
      </button>

      <div className="hidden md:block md:w-[30%] h-full">
        <Sidebar
          venues={filteredVenues}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGenres={selectedGenres}
          onGenresChange={setSelectedGenres}
          onVenueSelect={setSelectedVenueId}
        />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-16 bottom-0 w-[85%] max-w-sm z-50"
            >
              <Sidebar
                venues={filteredVenues}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedGenres={selectedGenres}
                onGenresChange={setSelectedGenres}
                onVenueSelect={setSelectedVenueId}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="w-full md:w-[70%] h-full">
        <Map
          venues={filteredVenues}
          selectedVenueId={selectedVenueId}
          onVenueSelect={setSelectedVenueId}
          onBoundsChange={fetchBounds}
        />
      </div>
    </div>
  );
}
