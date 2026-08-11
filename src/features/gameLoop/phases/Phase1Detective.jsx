import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 10 hojas sucias distribuidas por el jardín
const LEAVES = [
  { id: 1, x: '15%', y: '45%', rotation: 25 },
  { id: 2, x: '35%', y: '55%', rotation: -15 },
  { id: 3, x: '55%', y: '48%', rotation: 45 },
  { id: 4, x: '72%', y: '52%', rotation: -30 },
  { id: 5, x: '25%', y: '65%', rotation: 60 },
  { id: 6, x: '48%', y: '68%', rotation: -45 },
  { id: 7, x: '65%', y: '62%', rotation: 20 },
  { id: 8, x: '82%', y: '58%', rotation: -60 },
  { id: 9, x: '42%', y: '75%', rotation: 35 },
  { id: 10, x: '58%', y: '72%', rotation: -25 },
]

export default function Phase1Detective({ onComplete }) {
  const [cleanedLeaves, setCleanedLeaves] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [completed, setCompleted] = useState(false)

  const handleLeafClick = (leafId) => {
    if (cleanedLeaves.includes(leafId)) return

    setCleanedLeaves([...cleanedLeaves, leafId])
    setFeedback({ type: 'success', message: '¡Hoja limpia! ' })

    const newTotal = cleanedLeaves.length + 1
    
    if (newTotal === 10) {
      setCompleted(true)
      setTimeout(() => onComplete(1), 2500)
    }

    setTimeout(() => setFeedback(null), 800)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* IMAGEN DE FONDO - Lina la Mariquita Detective */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/detective-bg.jpeg')" }}
      />
      
      {/* Capa oscura muy suave para que las hojas resalten */}
      <div className="absolute inset-0 bg-white/10" />

      {/* Header con contador */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm shadow-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐞</span>
          <h2 className="text-xl md:text-2xl font-bold text-amber-800">
            Lina la Mariquita Detective
          </h2>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-full border-2 border-green-400">
          <span className="text-lg font-bold text-green-800">
            🍃 {cleanedLeaves.length}/10
          </span>
        </div>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-3xl text-lg font-bold shadow-2xl bg-green-500 text-white"
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hojas secias interactivas */}
      {LEAVES.map((leaf, index) => {
        const isCleaned = cleanedLeaves.includes(leaf.id)
        
        return (
          <motion.button
            key={leaf.id}
            onClick={() => handleLeafClick(leaf.id)}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: isCleaned ? 0 : 1, 
              rotate: isCleaned ? 180 : leaf.rotation 
            }}
            transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
            whileHover={!isCleaned ? { scale: 1.2 } : {}}
            whileTap={!isCleaned ? { scale: 0.9 } : {}}
            className={`
              absolute text-5xl cursor-pointer
              ${isCleaned ? 'pointer-events-none' : ''}
            `}
            style={{ 
              left: leaf.x, 
              top: leaf.y,
              filter: isCleaned ? 'grayscale(100%) opacity(0)' : 'none'
            }}
          >
            🍂
          </motion.button>
        )
      })}

      {/* Modal de Victoria */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">🔍✨</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¡Jardín limpio!
              </h3>
              <p className="text-white text-lg mb-4">
                Lina encontró todas las pistas
              </p>
              <div className="text-6xl animate-bounce">⭐</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instrucciones */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl">
          <p className="text-amber-800 font-bold text-sm md:text-base">
             Toca las hojas secas para limpiarlas
          </p>
        </div>
      </div>
    </div>
  )
}