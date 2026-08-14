import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Opciones de alas
const WINGS_OPTIONS = [
  {
    id: 'mosca',
    label: 'Alas de mosca',
    img: '/mosca-alas.jpeg',
    isCorrect: false,
    feedback: '¡Oh no! Thomas parece una mosca volando en círculos. ¡Esas no son sus alas! 🪰',
    transformation: '/thomas-mosca.jpeg'
  },
  {
    id: 'pajaro',
    label: 'Alas de pájaro',
    img: '/pajaro-alas.jpeg',
    isCorrect: false,
    feedback: '¡Ups! Thomas con alas de pájaro se ve muy extraño. ¡Él no es un ave! 🐦',
    transformation: '/thomas-pajaro.jpeg'
  },
  {
    id: 'mariquita',
    label: 'Alas de mariquita',
    img: '/mariquita-alas.jpeg',
    isCorrect: false,
    feedback: '¡Esas son las alas de Lina! Thomas necesita sus propias alas. ',
    transformation: '/thomas-mariquita.jpeg'
  },
  {
    id: 'mariposa',
    label: 'Alas de mariposa',
    img: '/mariposa-alas.jpeg',
    isCorrect: true,
    feedback: '',
    transformation: '/thomas-mariposa.jpeg'
  }
]

export default function Phase2Thomas({ onComplete }) {
  const [selectedWings, setSelectedWings] = useState(null)
  const [showTransformation, setShowTransformation] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleWingsSelect = (option) => {
    setSelectedWings(option)
    setShowTransformation(true)

    if (option.isCorrect) {
      // Victoria
      setTimeout(() => {
        setCompleted(true)
        setTimeout(() => onComplete(1), 3000)
      }, 2500)
    } else {
      // Error: mostrar transformación incorrecta por 2.5 segundos
      setTimeout(() => {
        setShowTransformation(false)
        setSelectedWings(null)
      }, 2500)
    }
  }

  const handleCloseTransformation = () => {
    if (!completed) {
      setShowTransformation(false)
      setSelectedWings(null)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-4 flex flex-col items-center">
      
      {/* Fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/phase2-bg.jpg')" }}
      />
      
      {/* Capa oscura suave */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Thomas flotando arriba */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 mt-4 mb-2"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <img 
            src="/thomas-presentacion.jpeg"
            alt="Thomas el gusanito"
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl rounded-full border-4 border-white/50"
          />
        </motion.div>
      </motion.div>

      {/* Frase motivadora */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-2">
          🦋 Elige las alas correctas
        </h2>
        <p className="text-white/90 text-sm md:text-base drop-shadow">
          para que Thomas se transforme
        </p>
      </motion.div>

           {/* Modal de Transformación -  FONDO COLORIDO DINÁMICO */}
      <AnimatePresence>
        {showTransformation && selectedWings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseTransformation}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              onClick={(e) => e.stopPropagation()}
              // 🎨 CAMBIO: Fondo verde si es correcto, morado/rosa si es incorrecto
              className={`rounded-3xl p-6 text-center shadow-2xl max-w-md w-full border-4 border-white/50 ${
                selectedWings.isCorrect
                  ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500'
              }`}
            >
              {/* Imagen de Thomas transformado */}
              <motion.img
                src={selectedWings.transformation}
                alt={`Thomas con alas de ${selectedWings.label}`}
                className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto mb-4 rounded-full border-4 border-white/70 bg-white/20 backdrop-blur-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              />

              {/* Mensaje */}
              {selectedWings.isCorrect ? (
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    ¡Thomas se transformó! 🎉
                  </h3>
                  <p className="text-white/95 text-lg drop-shadow">
                    ¡Las alas de mariposa son perfectas para él!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-white text-lg font-bold mb-2 drop-shadow-lg">
                    {selectedWings.feedback}
                  </p>
                  <p className="text-white/80 text-sm drop-shadow">
                    Toca para intentar de nuevo
                  </p>
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
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">⭐⭐</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¡Muy bien!
              </h3>
              <p className="text-white text-lg mb-4">
                Thomas descubrió sus alas de mariposa
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tarjetas de Alas */}
      <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4 w-full max-w-lg flex-grow items-center px-2">
        {WINGS_OPTIONS.map((option, index) => (
          <motion.button
            key={option.id}
            onClick={() => handleWingsSelect(option)}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/30 hover:ring-white/60 transition-all"
            style={{ aspectRatio: '1/1', maxHeight: '180px' }}
          >
            <img 
              src={option.img}
              alt={option.label}
              className="w-full h-full object-cover"
            />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-white font-bold text-xs md:text-sm text-center drop-shadow-lg">
                {option.label}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Moraleja */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 mt-4 text-center"
      >
        <p className="text-white font-semibold italic text-xs md:text-sm drop-shadow-lg bg-black/30 px-3 py-1 rounded-full inline-block">
          "Cada cambio bien vivido, despierta un nuevo latido" 🦋
        </p>
      </motion.div>
    </div>
  )
}