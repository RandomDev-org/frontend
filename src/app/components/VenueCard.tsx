import { MapPin, Clock, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface VenueCardProps {
  image: string;
  venueName: string;
  eventName: string;
  band: string;
  time: string;
  attendees: number;
  genre: string;
}

export function VenueCard({
  image,
  venueName,
  eventName,
  band,
  time,
  attendees,
  genre
}: VenueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20">
        <img
          src={image}
          alt={venueName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="text-xs bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full">
            {genre}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-medium mb-1">{eventName}</h3>
          <p className="text-sm text-gray-400">{band}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{venueName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5" />
            <span>{attendees} asistirán</span>
          </div>
          <button
            id={`btn-confirmar-${venueName.replace(/\s+/g, '-').toLowerCase()}`}
            className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-violet-500/50 transition-all"
          >
            Confirmar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
