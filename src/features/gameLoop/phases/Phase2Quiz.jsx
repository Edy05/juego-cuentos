import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Phase2Quiz({ level, onComplete }) {
  const [selectedId, setSelectedId] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [completed, setCompleted] = useState(false)

  // Opciones con imágenes para el Nivel 1 (Lina)
  const optionsLevel1 = [
    {
      id: 1,
      label: 'Ayudar a limpiar',
      img: '/lina-clean.jpeg',
      isCorrect: true,
      feedback: ''
    },
    {
      id: 2,
      label: 'Ir al espacio',
      img: '/lina-space.jpeg',
      isCorrect: false,
      feedback: '¡Ups! Lina es detective del jardín, no astronauta. '
    },
    {
      id: 3,
      label: 'Bailar',
      img: '/lina-dance.jpeg',
      isCorrect: false,
      feedback: '¡Oh no! Lina es responsable. ¡Primero hay que limpiar! 🧹'
    },
    {
      id: 4,
      label: 'Nadar',
      img: '/lina-swim.jpeg',
      isCorrect: false,
      feedback: '¡Ups! Lina tiene una misión en el jardín. '
    }
  ]

  // Opciones por defecto para otros niveles
  const optionsDefault = [
    { id: 1, emoji: '', label: 'Ayudar a limpiar', isCorrect: true },
    { id: 2, emoji: '🙅‍♀️', label: 'Tirar basura', isCorrect: false, feedback: '¡Ups! Lina nunca ensuciaría. ' },
    { id: 3, emoji: '💃', label: 'Bailar', isCorrect: false, feedback: '¡Primero hay que limpiar! ' }
  ]

  const options = level.id === 1 ? optionsLevel1 : optionsDefault

  const handleSelect = (option) => {
    setSelectedId(option.id)

    if (option.isCorrect) {
      const successMessage = level.id === 1 
        ? '¡Excelente! Lina siempre ayuda. ' 
        : '¡Excelente!'
        
      setFeedback({ type: 'success', message: successMessage })
      setCompleted(true)
      setTimeout(() => onComplete(1), 2500) 
    } else {
      setFeedback({ type: 'error', message: option.feedback || '¡Ups! Intenta de nuevo.' })
      setTimeout(() => setSelectedId(null), 2000)
    }

    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-4 flex flex-col items-center">
      
      {/* Fondo dinámico según el nivel */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: level.id === 1 
            ? "url('/detective-bg.jpeg')"
            : level.id === 2
              ? "url('/phase2-bg.jpg')"
              : "url('/phase1-bg.jpg')"
        }}
      />
      
      <div className="absolute inset-0 bg-black/40" />

      {/* Header */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 text-center mb-4 mt-4"
      >
        <div className="text-4xl mb-1 drop-shadow-lg">🤔</div>
        <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
          {level.phase2Question || '¿Qué haría Lina?'}
        </h2>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`
              fixed top-24 left-1/2 -translate-x-1/2 z-50 
              px-6 py-4 rounded-3xl text-lg font-bold shadow-2xl text-center
              ${feedback.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-orange-500 text-white'}
            `}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">⭐⭐</div>
              <h3 className="text-2xl font-bold text-white mb-3">¡Muy bien!</h3>
              <p className="text-white text-lg">Has ganado tu segunda estrella</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tarjetas de Opciones - PEQUEÑAS */}
      <div className="relative z-10 grid grid-cols-2 gap-3 w-full max-w-lg flex-grow items-center px-2">
        {options.map((option, index) => {
          const isSelected = selectedId === option.id
          const isWrong = isSelected && !option.isCorrect

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: isSelected ? 1.05 : 1
              }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative rounded-xl overflow-hidden shadow-xl
                transition-all duration-300
                ${isWrong 
                  ? 'ring-4 ring-red-500' 
                  : isSelected && option.isCorrect
                    ? 'ring-4 ring-green-500'
                    : 'ring-2 ring-white/30 hover:ring-white/60'}
              `}
              style={{
                aspectRatio: '1/1',
                maxHeight: '150px'
              }}
            >
              {option.img ? (
                <img 
                  src={option.img} 
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-white/90 flex flex-col items-center justify-center p-3`}>
                  <div className="text-4xl mb-2">{option.emoji}</div>
                  <p className="text-xs font-bold text-gray-700 text-center">
                    {option.label}
                  </p>
                </div>
              )}

              {/* Label pequeño */}
              {option.img && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white font-bold text-xs text-center">
                    {option.label}
                  </p>
                </div>
              )}

              {/* Indicador */}
              {isWrong && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold"
                >
                  ✕
                </motion.div>
              )}

              {isSelected && option.isCorrect && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Moraleja */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 mt-4 text-center"
      >
        <p className="text-white font-semibold italic text-xs md:text-sm drop-shadow-lg bg-black/30 px-3 py-1 rounded-full inline-block">
          {level.id === 1
            ? '"Si amas el orden y la limpieza..." 🌸'
            : '"Cada cambio bien vivido..." 🦋'}
        </p>
      </motion.div>
    </div>
  )
}