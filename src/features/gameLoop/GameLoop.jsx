// src/features/gameLoop/GameLoop.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Phase1DragDrop from './phases/Phase1DragDrop'

export default function GameLoop({ level, onComplete, onExit }) {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [starsEarned, setStarsEarned] = useState(0)

  const handlePhaseComplete = (stars) => {
    setStarsEarned(prev => prev + stars)
    
    // Por ahora solo tenemos Fase 1, pero aquí irá la lógica de transición
    if (currentPhase === 1) {
      setTimeout(() => setCurrentPhase(2), 1000)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Barra superior con info del nivel */}
      <div className="fixed top-0 left-0 right-0 bg-purple-900/90 backdrop-blur-md text-white p-3 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            ← Salir
          </button>
          
          <div className="text-center">
            <div className="text-2xl">{level.emoji}</div>
            <div className="text-sm font-semibold">Nivel {level.id}</div>
          </div>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(star => (
              <motion.span
                key={star}
                animate={star <= starsEarned ? { scale: [1, 1.3, 1] } : {}}
                className={`text-3xl ${star <= starsEarned ? '' : 'grayscale opacity-30'}`}
              >
                ⭐
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de la fase actual */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          {currentPhase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Phase1DragDrop onComplete={handlePhaseComplete} />
            </motion.div>
          )}

          {currentPhase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-h-screen flex items-center justify-center bg-gray-900 text-white"
            >
              <div className="text-center p-8">
                <h2 className="text-4xl font-bold mb-4">🎯 Fase 2: Próximamente</h2>
                <p className="text-xl">Aquí irá la pregunta específica del cuento</p>
                <button
                  onClick={() => onComplete(starsEarned)}
                  className="mt-8 px-8 py-4 bg-purple-600 rounded-xl text-xl font-bold hover:bg-purple-700"
                >
                  Finalizar Nivel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}