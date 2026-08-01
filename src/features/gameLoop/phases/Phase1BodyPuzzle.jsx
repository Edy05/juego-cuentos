import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Definición de las partes y las opciones
const BODY_PARTS = [
  {
    id: 'head',
    name: 'Cabeza',
    correctId: 'thomas',
    options: [
      { id: 'thomas', label: 'Thomas', isCorrect: true, img: '/thomas-head.png', emoji: '🐛' },
      { id: 'lina', label: 'Lina', isCorrect: false, feedback: '¡Esa es Lina la mariquita! ', img: '/lina-head.png', emoji: '' },
      { id: 'butterfly', label: 'Mariposa', isCorrect: false, feedback: '¡Esa es una mariposa! 🦋', img: '/butterfly-head.png', emoji: '🦋' }
    ]
  },
  {
    id: 'torso',
    name: 'Cuerpo',
    correctId: 'thomas',
    options: [
      { id: 'thomas', label: 'Verde', isCorrect: true, img: '/thomas-body.png', emoji: '' },
      { id: 'lina', label: 'Rojo', isCorrect: false, feedback: '¡Ese es el caparazón de Lina! 🐞', emoji: '' },
      { id: 'butterfly', label: 'Azul', isCorrect: false, feedback: '¡Eso es de una mariposa! 🦋', emoji: '🔵' }
    ]
  },
  {
    id: 'arms',
    name: 'Patitas',
    correctId: 'thomas',
    options: [
      { id: 'thomas', label: 'Cortas', isCorrect: true, emoji: '' },
      { id: 'lina', label: '6 patas', isCorrect: false, feedback: '¡Esas son patas de hormiga! 🐜', emoji: '🐜' },
      { id: 'butterfly', label: 'Alas', isCorrect: false, feedback: '¡Esas son alas! 🦋', emoji: '' }
    ]
  },
  {
    id: 'legs',
    name: 'Cola',
    correctId: 'thomas',
    options: [
      { id: 'thomas', label: 'Verde', isCorrect: true, emoji: '' },
      { id: 'lina', label: 'Negra', isCorrect: false, feedback: '¡Esa es la cola de Lina! ⚫', emoji: '⚫' },
      { id: 'butterfly', label: 'Brillos', isCorrect: false, feedback: '¡Eso es polvo mágico! ✨', emoji: '✨' }
    ]
  }
]

export default function Phase1BodyPuzzle({ onComplete }) {
  const [completedParts, setCompletedParts] = useState({})
  const [selectedPart, setSelectedPart] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const isFinished = Object.keys(completedParts).length === BODY_PARTS.length

  const handleOptionClick = (option, part) => {
    if (isAnimating) return // Prevenir múltiples clics
    
    setIsAnimating(true)
    
    if (option.isCorrect) {
      setFeedback({ type: 'success', message: `¡Perfecto! Esa es la ${part.name}. ✨` })
      setCompletedParts({ ...completedParts, [part.id]: option })
      setSelectedPart(null)
      
      setTimeout(() => {
        setFeedback(null)
        setIsAnimating(false)
        if (Object.keys(completedParts).length === BODY_PARTS.length - 1) {
          setTimeout(() => onComplete(1), 500)
        }
      }, 1000)
    } else {
      setFeedback({ type: 'error', message: option.feedback })
      setIsAnimating(false)
      setTimeout(() => setFeedback(null), 2000)
    }
  }

  const handleCloseModal = () => {
    if (!isAnimating) {
      setSelectedPart(null)
    }
  }

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-400 to-emerald-600 p-4">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
        >
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-700 mb-2">¡Thomas está completo!</h2>
          <p className="text-gray-600 text-lg mb-6">Has ganado tu primera estrella</p>
          <div className="text-6xl animate-bounce">⭐</div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-green-100 via-emerald-100 to-teal-100 p-4 flex flex-col items-center" style={{ touchAction: 'pan-y' }}>
      
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-green-800">
          🧩 ¡Arma a Thomas!
        </h2>
        <p className="text-sm md:text-base text-green-700 mt-2">
          Toca un espacio vacío para completarlo
        </p>
      </motion.div>

      {/* Feedback Flotante */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            className={`
              fixed top-24 left-1/2 -translate-x-1/2 z-50 
              px-6 py-4 rounded-3xl text-lg font-bold shadow-2xl text-center max-w-xs
              ${feedback.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-orange-500 text-white'}
            `}
            style={{ pointerEvents: 'none' }}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CUERPO DE THOMAS - Espacios para completar */}
      <div className="flex-grow flex items-center justify-center w-full max-w-md">
        <div className="bg-white/90 rounded-3xl p-6 shadow-2xl border-4 border-green-400 w-full">
          <div className="text-center mb-4">
            <p className="text-lg font-bold text-green-700">Thomas</p>
            <div className="text-sm text-green-600">
              {Object.keys(completedParts).length} / {BODY_PARTS.length} completados
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            {BODY_PARTS.map((part) => {
              const isCompleted = completedParts[part.id]
              
              return (
                <motion.button
                  key={part.id}
                  onClick={() => !isCompleted && !isAnimating && setSelectedPart(part)}
                  disabled={isCompleted || isAnimating}
                  whileHover={!isCompleted && !isAnimating ? { scale: 1.05 } : {}}
                  whileTap={!isCompleted && !isAnimating ? { scale: 0.95 } : {}}
                  className={`
                    w-full h-24 rounded-2xl border-4 flex items-center justify-center text-4xl
                    transition-all duration-300 touch-manipulation
                    ${isCompleted 
                      ? 'bg-green-500 border-green-600 cursor-default opacity-80' 
                      : 'bg-yellow-50 border-yellow-400 border-dashed cursor-pointer animate-pulse'}
                  `}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  {isCompleted ? (
                    completedParts[part.id].img ? (
                      <img 
                        src={completedParts[part.id].img} 
                        alt={part.name}
                        className="w-16 h-16 object-contain"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <span>{completedParts[part.id].emoji || '✅'}</span>
                    )
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-1">❓</span>
                      <span className="text-sm font-bold text-yellow-700">{part.name}</span>
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* MODAL DE SELECCIÓN - Optimizado para móviles */}
      <AnimatePresence>
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/70 z-40 flex items-end md:items-center justify-center p-0 md:p-4"
            style={{ 
              touchAction: 'none',
              pointerEvents: 'auto'
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl md:rounded-3xl p-4 md:p-6 w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
              style={{ 
                touchAction: 'pan-y',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="text-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-3xl font-bold text-green-800 mb-2">
                  Elige la {selectedPart.name}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">¿Cuál es la {selectedPart.name} de Thomas?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {selectedPart.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleOptionClick(option, selectedPart)}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      handleOptionClick(option, selectedPart)
                    }}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-linear-to-br from-purple-100 to-pink-100 rounded-2xl p-4 md:p-6 border-4 border-purple-300 hover:border-purple-500 active:border-purple-600 transition-all min-h-[180px] md:min-h-[250px] flex flex-col items-center justify-center cursor-pointer"
                    style={{ 
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      pointerEvents: 'auto'
                    }}
                  >
                    {option.img ? (
                      <img 
                        src={option.img} 
                        alt={option.label}
                        className="w-24 h-24 md:w-40 md:h-40 object-contain mb-3 md:mb-4"
                        onError={(e) => { e.target.style.display = 'none' }}
                        draggable={false}
                      />
                    ) : null}
                    <span 
                      className="text-5xl md:text-7xl mb-3 md:mb-4" 
                      style={{ display: option.img ? 'none' : 'block' }}
                    >
                      {option.emoji}
                    </span>
                    <span className="text-base md:text-xl font-bold text-purple-800 text-center">
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={handleCloseModal}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleCloseModal()
                }}
                className="mt-4 md:mt-6 w-full py-3 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-xl text-gray-700 font-bold text-lg transition-colors"
                style={{ 
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}