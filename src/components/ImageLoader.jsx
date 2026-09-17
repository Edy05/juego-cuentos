import { motion } from 'framer-motion'

export default function ImageLoader({ progress }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center"
      >
        {/* Animación de carga */}
        <motion.div
          className="text-7xl mb-6"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🎨
        </motion.div>
        
        <h3 className="text-white text-2xl font-bold mb-4 drop-shadow-lg">
          Preparando la aventura...
        </h3>
        
        {/* Barra de progreso */}
        <div className="w-64 h-4 bg-white/20 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <p className="text-white/90 text-sm mt-3 font-semibold">
          {progress}%
        </p>
      </motion.div>
    </div>
  )
}