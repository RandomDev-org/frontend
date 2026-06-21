import { Music2, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate?: (tab: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="h-full w-full bg-[#121212] overflow-y-auto">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-[#121212] to-fuchsia-950/30" />

        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8">
              <Music2 className="w-4 h-4 text-violet-400" />
              <span className="text-xs md:text-sm text-violet-300">Descubre música en vivo cerca de ti</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight"
          >
            Encuentra tu próximo
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              evento musical
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto"
          >
            Explora locales, descubre bandas emergentes y conecta con la escena musical de tu ciudad
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
          >
            <button
              id="hero-btn-eventos"
              onClick={() => onNavigate?.('eventos')}
              className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/50 transition-all font-medium"
            >
              Explorar eventos
            </button>
            <button
              id="hero-btn-mapa"
              onClick={() => onNavigate?.('mapa')}
              className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all font-medium"
            >
              Ver mapa
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 hover:border-violet-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Mapa Interactivo</h3>
              <p className="text-gray-400">
                Visualiza todos los eventos musicales cerca de ti en tiempo real
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 hover:border-violet-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Eventos Seleccionados</h3>
              <p className="text-gray-400">
                Descubre eventos especiales y conciertos exclusivos seleccionados para ti
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 hover:border-violet-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Tendencias</h3>
              <p className="text-gray-400">
                Mantente al día con las bandas emergentes y los géneros más populares
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 md:py-16 px-4 md:px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 md:gap-8 text-center">
          <div>
            <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1 md:mb-2">
              250+
            </div>
            <div className="text-xs md:text-base text-gray-400">Eventos este mes</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1 md:mb-2">
              80+
            </div>
            <div className="text-xs md:text-base text-gray-400">Locales asociados</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1 md:mb-2">
              15K+
            </div>
            <div className="text-xs md:text-base text-gray-400">Usuarios activos</div>
          </div>
        </div>
      </div>
    </div>
  );
}
