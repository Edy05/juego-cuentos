import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Fases 1
import Phase1Detective from './phases/Phase1Detective'
import Phase1BodyPuzzle from './phases/Phase1BodyPuzzle'
import Phase1PathFinder from './phases/Phase1PathFinder'
import Phase1ClaritaPaths from './phases/Phase1ClaritaPaths'
import Phase1SimonDifferences from './phases/Phase1SimonDifferences'
import Phase1RojoletCatch from './phases/Phase1RojoletCatch'
import Phase1Level7Habitats from './phases/Phase1Level7Habitats'

// Fases 2
import Phase2Quiz from './phases/Phase2Quiz'
import Phase2Thomas from './phases/Phase2Thomas'
import Phase2SimonLake from './phases/Phase2SimonLake'
import Phase2RojoletFriends from './phases/Phase2RojoletFriends'
import Phase2Level7Puzzle from './phases/Phase2Level7Puzzle' // ✅ NUEVO

// Utilidades
import MemoryGame from './phases/MemoryGame'
import useImagePreloader from '../../hooks/useImagePreloader'
import ImageLoader from '../../components/ImageLoader'
import { levelImages, defaultImages } from '../../data/gameImages'

export default function GameLoop({ level, onComplete, onExit }) {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [starsEarned, setStarsEarned] = useState(0)

  const imagesToLoad = useMemo(() => levelImages[level.id] || defaultImages, [level.id])
  const { isLoaded, progress } = useImagePreloader(imagesToLoad)

  const handlePhaseComplete = (stars) => {
    setStarsEarned(prev => prev + stars)
    if (currentPhase === 1) {
      setTimeout(() => setCurrentPhase(2), 4500)
    } else if (currentPhase === 2) {
      setTimeout(() => onComplete(starsEarned + stars), 4500)
    }
  }

  if (!isLoaded) {
    return <ImageLoader progress={progress} />
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-0 left-0 right-0 bg-purple-900/90 backdrop-blur-md text-white p-3 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={onExit} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm md:text-base">← Salir</button>
          <div className="text-center">
            <div className="text-2xl">{level.emoji}</div>
            <div className="text-xs md:text-sm font-semibold">Nivel {level.id}</div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            {[1, 2, 3].map(star => (
              <motion.span key={star} animate={star <= starsEarned ? { scale: [1, 1.3, 1] } : {}} className={`text-2xl md:text-3xl ${star <= starsEarned ? '' : 'grayscale opacity-30'}`}>⭐</motion.span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-16 md:pt-20">
        <AnimatePresence mode="wait">
          {currentPhase === 1 && (
            <motion.div key="phase1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              {level.id === 1 && <Phase1Detective onComplete={handlePhaseComplete} />}
              {level.id === 2 && <Phase1BodyPuzzle onComplete={handlePhaseComplete} />}
              {level.id === 3 && <Phase1ClaritaPaths onComplete={handlePhaseComplete} />}
              {level.id === 4 && <MemoryGame pairs={['memory1', 'memory2', 'memory3']} onComplete={handlePhaseComplete} />}
              {level.id === 5 && <Phase1SimonDifferences onComplete={handlePhaseComplete} />}
              {level.id === 6 && <Phase1RojoletCatch onComplete={handlePhaseComplete} />}
              {level.id === 7 && <Phase1Level7Habitats onComplete={handlePhaseComplete} />}
            </motion.div>
          )}

          {currentPhase === 2 && (
            <motion.div key="phase2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              {level.id === 1 && <Phase2Quiz level={level} onComplete={handlePhaseComplete} />}
              {level.id === 2 && <Phase2Thomas onComplete={handlePhaseComplete} />}
              {level.id === 3 && <Phase1PathFinder onComplete={handlePhaseComplete} />}
              {level.id === 4 && <MemoryGame pairs={['memory4', 'memory5', 'memory6', 'memory7']} onComplete={handlePhaseComplete} />}
              {level.id === 5 && <Phase2SimonLake onComplete={handlePhaseComplete} />}
              {level.id === 6 && <Phase2RojoletFriends onComplete={handlePhaseComplete} />}
              {/* ✅ NUEVO: Nivel 7 Fase 2 - Rompecabezas */}
              {level.id === 7 && <Phase2Level7Puzzle onComplete={handlePhaseComplete} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}