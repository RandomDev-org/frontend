import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Map } from './Map';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MapView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Mobile Toggle Button */}
      <button
        id="sidebar-toggle-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-20 left-4 z-50 w-12 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-violet-500/50 transition-all"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <SlidersHorizontal className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar - Desktop: always visible 30%, Mobile: overlay when open */}
      <div className="hidden md:block md:w-[30%] h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-16 bottom-0 w-[85%] max-w-sm z-50"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Map - Desktop: 70% width, Mobile: 100% width */}
      <div className="w-full md:w-[70%] h-full">
        <Map />
      </div>
    </div>
  );
}
