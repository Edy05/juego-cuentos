import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Diferencias a encontrar
const DIFFERENCES = [
  { id: 1, emoji: '🦋', x: 85, y: 15, label: 'Mariposa extra' },
  { id: 2, emoji: '🌸', x: 15, y: 75, label: 'Flor brillante' },
  { id: 3, emoji: '🍄', x: 70, y: 85, label: 'Hongo escondido' },
  { id: 4, emoji: '✨', x: 45, y: 45, label: 'Destello mágico' }
]

export default function Phase1SimonDifferences({ onComplete }) {
  const [found, setFound] = useState([])
  const [showError, setShowError] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleDifferenceClick = (diff) => {
    if (found.includes(diff.id)) return
    
    const newFound = [...found, diff.id]
    setFound(newFound)

    if (newFound.length === DIFFERENCES.length) {
      setTimeout(() => {
        setCompleted(true)
        setTimeout(() => onComplete(1), 3000)
      }, 1000)
    }
  }

  const handleBackgroundClick = () => {
    setShowError(true)
    setTimeout(() => setShowError(false), 800)
  }

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      
      {/* Header flotante */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-20 left-4 z-20"
      >
      
      </motion.div>

      {/* Contenedor de imágenes - Ocupa TODO el espacio disponible */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* Mitad superior (Referencia) */}
        <div 
          className="relative flex-1 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/simon-differences.jpeg')"
          }}
        >
          <div className="absolute top-2 left-2 bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-gray-700">
            🔍 Encuentra las diferencias
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="h-1 bg-white/50 w-full" />

        {/* Mitad inferior (Juego con diferencias) */}
        <div 
          className="relative flex-1 bg-cover bg-center bg-no-repeat cursor-crosshair"
          style={{ 
            backgroundImage: "url('/simon-differences.jpeg')"
          }}
          onClick={handleBackgroundClick}
        >
        

          {/* Diferencias superpuestas */}
          {DIFFERENCES.map((diff) => {
            const isFound = found.includes(diff.id)
            return (
              <motion.button
                key={diff.id}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDifferenceClick(diff)
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute flex items-center justify-center cursor-pointer ${
                  isFound ? 'pointer-events-none' : ''
                }`}
                style={{
                  left: `${diff.x}%`,
                  top: `${diff.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                whileHover={!isFound ? { scale: 1.2 } : {}}
                whileTap={!isFound ? { scale: 0.9 } : {}}
              >
                <span className={`text-3xl md:text-4xl drop-shadow-lg ${
                  isFound ? 'opacity-50' : 'opacity-90'
                }`}>
                  {diff.emoji}
                </span>

                {isFound && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute w-12 h-12 md:w-16 md:h-16 border-4 border-green-500 rounded-full bg-green-500/20"
                  />
                )}
              </motion.button>
            )
          })}

          {/* Feedback de error */}
          <AnimatePresence>
            {showError && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
              >
                ❌
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Contador flotante abajo */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
          <p className="text-amber-900 font-bold text-sm">
            {found.length} / {DIFFERENCES.length} encontradas
          </p>
        </div>
      </div>

      {/* Modal de Victoria */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">⭐</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¡Simón está orgulloso!
              </h3>
              <p className="text-white text-lg mb-4">
                Encontraste todas las diferencias con paciencia
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}