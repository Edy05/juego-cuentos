import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// Configuración de los caminos y destinos - REORDENADO para coincidir con el laberinto
const PATHS = [
  {
    id: 'worm',
    color: '#ef4444', // Rojo - se queda en su lugar (izquierda)
    label: 'Camino rojo',
    isCorrect: false,
    destination: '/clarita-worm.png',
    feedback: '¡Oh no! Este camino lleva donde el gusano. Clarita necesita encontrar su hormiguero. 🪱'
  },
  {
    id: 'anthill',
    color: '#22c55e', // Verde - ahora va en la segunda posición (donde estaba el azul)
    label: 'Camino verde',
    isCorrect: true,
    destination: '/clarita-anthill.jpeg',
    feedback: ''
  },
  {
    id: 'bees',
    color: '#3b82f6', // Azul - ahora va en la tercera posición (donde estaba el amarillo)
    label: 'Camino azul',
    isCorrect: false,
    destination: '/clarita-bees.jpeg',
    feedback: '¡Cuidado! Este camino lleva al panal de abejas. ¡No es seguro para Clarita! 🐝'
  },
  {
    id: 'pond',
    color: '#eab308', // Amarillo - ahora va en la cuarta posición (donde estaba el verde)
    label: 'Camino amarillo',
    isCorrect: false,
    destination: '/clarita-pond.png',
    feedback: '¡Ups! Este camino lleva al estanque. Clarita no sabe nadar. 💧'
  }
]

export default function Phase1PathFinder({ onComplete }) {
  const [selectedPath, setSelectedPath] = useState(null)
  const [showDestination, setShowDestination] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handlePathClick = (path) => {
    setSelectedPath(path)
    setShowDestination(true)

    if (path.isCorrect) {
      setTimeout(() => {
        setCompleted(true)
        setTimeout(() => onComplete(1), 3000)
      }, 2500)
    }
  }

  const handleCloseDestination = () => {
    if (!completed) {
      setShowDestination(false)
      setSelectedPath(null)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      
      {/* Imagen de fondo del laberinto */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/clarita-maze.jpeg')" }}
      />

      {/* Header MINIMALISTA - sin texto duplicado, solo indicador de progreso */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 pt-3 pb-2 px-4"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 inline-block shadow-md">
          <p className="text-amber-800 font-bold text-sm md:text-base">
            🐜 Ayuda a Clarita a encontrar su casa
          </p>
        </div>
      </motion.div>

      {/* Espacio flexible para que los botones queden abajo */}
      <div className="flex-grow" />

          {/* ZONA DE BOTONES - Grid responsive con tamaño original */}
      <div className="relative z-10 px-4 pb-4">
        <div className="grid grid-cols-4 gap-1 md:gap-3 max-w-2xl mx-auto">
          {PATHS.map((path, index) => (
            <motion.button
              key={path.id}
              onClick={() => handlePathClick(path)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-25 h-25 rounded-full border-4 border-white shadow-xl flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: path.color }}
            >
              <span className="text-white font-bold text-xs drop-shadow-lg text-center">
                {path.id === 'worm' && '🪱'}
                {path.id === 'bees' && '🐝'}
                {path.id === 'pond' && '💧'}
                {path.id === 'anthill' && '🏠'}
              </span>
            </motion.button>
          ))}
        </div>
        
        {/* Texto de ayuda debajo de los botones */}
        <p className="text-center text-white text-xs md:text-sm font-bold mt-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          Toca un círculo de color para explorar
        </p>
      </div>

      {/* Modal de Destino */}
      <AnimatePresence>
        {showDestination && selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className={`rounded-3xl p-6 text-center shadow-2xl max-w-md w-full border-4 border-white/50 ${
                selectedPath.isCorrect
                  ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500'
              }`}
            >
              <motion.img
                src={selectedPath.destination}
                alt={`Clarita en ${selectedPath.label}`}
                className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto mb-4 rounded-full border-4 border-white/70 bg-white/20 backdrop-blur-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              />

              {selectedPath.isCorrect ? (
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    ¡Clarita encontró su hogar! 🎉
                  </h3>
                  <p className="text-white/95 text-lg drop-shadow">
                    ¡El camino verde lleva al hormiguero!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-white text-lg font-bold mb-4 drop-shadow-lg px-2">
                    {selectedPath.feedback}
                  </p>
                  <motion.button
                    onClick={handleCloseDestination}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2 px-8 py-3 bg-white text-purple-700 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-purple-200"
                  >
                    Intentar de nuevo 🔄
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Victoria Final */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">⭐</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¡Muy bien!
              </h3>
              <p className="text-white text-lg mb-4">
                Clarita llegó sana y salva a casa
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}