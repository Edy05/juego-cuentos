import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Phase2Quiz({ level, onComplete }) {
  const [selectedId, setSelectedId] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [completed, setCompleted] = useState(false)

  // Usar las opciones del nivel actual
  const options = level.phase2Options || [
    { id: 1, emoji: '', label: 'Ayudar a mis amigos a limpiar', isCorrect: true },
    { id: 2, emoji: '🙅‍♀️🍕', label: 'Tirar basura al suelo', isCorrect: false, feedback: '¡Ups! Lina nunca ensuciaría el jardín. ¡Intenta de nuevo!' },
    { id: 3, emoji: '💃🌪️', label: 'Bailar y no hacer caso', isCorrect: false, feedback: '¡Oh no! El jardín necesita nuestra ayuda, no es momento de bailar.' }
  ]

  // Moraleja dinámica según el nivel
  const moral = level.id === 1 
    ? '"Si amas el orden y la limpieza, tu vida florece con más belleza" 🌸'
    : '"Cada cambio bien vivido, despierta un nuevo latido" 🦋'

  const handleSelect = (option) => {
    setSelectedId(option.id)

    if (option.isCorrect) {
      const successMessage = level.id === 1 
        ? '¡Excelente! Lina estaría muy orgullosa de ti.' 
        : '¡Excelente! Estarías muy orgulloso.'
        
      setFeedback({ type: 'success', message: successMessage })
      setCompleted(true)
      setTimeout(() => onComplete(1), 2500) 
    } else {
      setFeedback({ type: 'error', message: option.feedback || '¡Ups! Intenta de nuevo.' })
      setTimeout(() => setSelectedId(null), 1500)
    }

    setTimeout(() => setFeedback(null), 2000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-4 flex flex-col items-center">
      
      {/* FONDO DINÁMICO SEGÚN EL NIVEL */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: level.id === 1 
            ? "url('/phase1-bg.jpg')"   // Nivel 1: Lina
            : "url('/phase2-bg.jpg')"   // Nivel 2: Thomas
        }}
      />
      
      {/* Capa oscura suave para que el contenido sea legible */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Header */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 text-center mb-6 mt-4"
      >
        <div className="text-5xl mb-2 drop-shadow-lg">🤔</div>
        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
          {level.phase2Question || '¿Qué harías tú?'}
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
              px-6 py-4 rounded-3xl text-lg md:text-xl font-bold shadow-2xl text-center max-w-xs
              ${feedback.type === 'success' 
                ? 'bg-green-500 text-white border-4 border-green-300' 
                : 'bg-red-500 text-white border-4 border-red-300'}
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
              className="bg-linear-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">⭐⭐</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¡Muy bien!
              </h3>
              <p className="text-white text-lg mb-4">
                Has ganado tu segunda estrella
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tarjetas de Opciones */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl flex-grow items-center">
        {options.map((option, index) => {
          const isSelected = selectedId === option.id
          const isWrong = isSelected && !option.isCorrect

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 
                flex flex-col items-center justify-center min-h-[200px]
                transition-all duration-300
                ${isWrong 
                  ? 'border-red-500 bg-red-50' 
                  : isSelected 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-purple-200 hover:border-purple-400'}
              `}
            >
              <div className={`text-7xl mb-4 ${isWrong ? 'animate-pulse' : ''}`}>
                {option.emoji}
              </div>
              
              <p className="text-lg md:text-xl font-bold text-gray-700 text-center leading-tight">
                {option.label}
              </p>

              {isWrong && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg"
                >
                  ✕
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Moraleja dinámica según el nivel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 mt-4 text-center"
      >
        <p className="text-white font-semibold italic text-sm md:text-base drop-shadow-lg bg-black/30 px-4 py-2 rounded-full inline-block">
          {moral}
        </p>
      </motion.div>
    </div>
  )
}