import { Star, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

// Conectar al microservicio de eventos cuando este disponible
const specialEvents: {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  attendees: number;
  price: string;
  featured: boolean;
  genre: string;
}[] = [];

function EmptyState({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <RefreshCw className="w-8 h-8 text-gray-600" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">
        Ups, aún no hay {label} por aquí
      </h3>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
        Puedes volver a revisar más tarde, actualizamos el contenido frecuentemente.
      </p>
    </motion.div>
  );
}

export function Events() {
  const featured = specialEvents.filter((e) => e.featured);
  const upcoming = specialEvents.filter((e) => !e.featured);

  return (
    <div className="h-full w-full bg-[#121212] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0F0F0F] px-4 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Eventos Especiales
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Descubre los mejores conciertos y festivales de la temporada
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">

          {/* Destacados */}
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-violet-400" />
            Eventos destacados
          </h2>

          {featured.length === 0 ? (
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl mb-12">
              <EmptyState label="eventos destacados" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* cards cuando lleguen del backend */}
            </div>
          )}

          {/* Proximos */}
          <h2 className="text-xl font-semibold text-white mb-6">
            Próximos eventos
          </h2>

          {upcoming.length === 0 ? (
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl">
              <EmptyState label="próximos eventos" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* cards cuando lleguen del backend */}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
