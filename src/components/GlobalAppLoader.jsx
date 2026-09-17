import { motion } from 'framer-motion'
import useImagePreloader from '../hooks/useImagePreloader'
import { globalImages } from '../data/gameImages'

export default function GlobalAppLoader({ children }) {
  const { isLoaded, progress } = useImagePreloader(globalImages)

  // Mientras no esté cargado, mostramos la pantalla de carga
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-[9999]">
        <motion.div 
          className="text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Mariposa animada */}
          <motion.div
            className="text-8xl mb-6 drop-shadow-2xl"
            animate={{ 
              rotate: [0, 15, -15, 0], 
              scale: [1, 1.1, 1],
              y: [0, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🦋
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Preparando el Jardín Mágico...
          </h2>
          
          {/* Barra de progreso */}
          <div className="w-64 md:w-80 h-4 bg-white/20 rounded-full overflow-hidden mx-auto backdrop-blur-sm border border-white/30">
            <motion.div
              className="h-full bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          
          <p className="text-white/80 text-sm mt-3 font-semibold">
            {progress}%
          </p>
        </motion.div>
      </div>
    )
  }

  // Cuando termina de cargar, muestra la app real
  return children
}