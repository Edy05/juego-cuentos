import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Configuración de los animales y sus hogares
const ANIMALS = [
  {
    id: 'bee',
    emoji: '🐝',
    label: 'Abeja',
    homeEmoji: '🍯', // ✅ Cambiado a pote de miel (se ve en todos los dispositivos)
    homeLabel: 'Panal',
    image: '/abeja-home.jpeg',
    startX: 15,
    homeX: 70,
    y: 28,
    message: '¡La abeja voló hacia su panal!'
  },
  {
    id: 'squirrel',
    emoji: '🐿️',
    label: 'Ardilla',
    homeEmoji: '🏡',
    homeLabel: 'Madriguera',
    image: '/ardilla-home.jpeg',
    startX: 15,
    homeX: 70,
    y: 50,
    message: '¡La ardilla corrió a su madriguera!'
  },
  {
    id: 'ladybug',
    emoji: '🐞',
    label: 'Mariquita',
    homeEmoji: '🌸',
    homeLabel: 'Flor',
    image: '/mariquita-home.jpeg',
    startX: 15,
    homeX: 70,
    y: 72,
    message: '¡La mariquita voló hacia su flor!'
  }
]

export default function Phase1PathFinder({ onComplete }) {
  const [movedAnimals, setMovedAnimals] = useState({})
  const [currentImage, setCurrentImage] = useState(null)
  const [completed, setCompleted] = useState(false)

  const handleAnimalClick = (animal) => {
    if (movedAnimals[animal.id]) return

    setMovedAnimals(prev => ({ ...prev, [animal.id]: true }))

    setTimeout(() => {
      setCurrentImage(animal)
      
      setTimeout(() => {
        setCurrentImage(null)
        
        const newMoved = { ...movedAnimals, [animal.id]: true }
        if (Object.keys(newMoved).length === ANIMALS.length) {
          setTimeout(() => {
            setCompleted(true)
            setTimeout(() => onComplete(1), 3000)
          }, 500)
        }
      }, 2500)
    }, 4000)
  }

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      
      {/* Fondo completo sin capa blanca */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/level3-phase1-bg.jpeg')" }}
      />

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 pt-4 px-4 text-center"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2 inline-block shadow-md">
          <p className="text-amber-800 font-bold text-sm md:text-base">
             Une cada animal con su hogar
          </p>
        </div>
      </motion.div>

      {/* Contenedor principal del juego */}
      <div className="absolute inset-0 pt-20 pb-10 z-10">
        
        {/* Animales (columna izquierda) */}
        {ANIMALS.map((animal, index) => {
          const isMoved = movedAnimals[animal.id]
          
          return (
            <motion.button
              key={animal.id}
              onClick={() => handleAnimalClick(animal)}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                x: isMoved ? (animal.homeX - animal.startX) * 10 : 0,
              }}
              transition={{ 
                delay: 0.3 + index * 0.1,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={!isMoved ? { scale: 1.15, rotate: [-5, 5, -5, 0] } : {}}
              whileTap={!isMoved ? { scale: 0.9 } : {}}
              className={`absolute flex flex-col items-center cursor-pointer ${
                isMoved ? 'pointer-events-none opacity-0' : ''
              }`}
              style={{
                left: `${animal.startX}%`,
                top: `${animal.y}%`,
                transform: 'translate(-50%, -50%)',
                transition: isMoved ? 'all 4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
              }}
            >
              <motion.span 
                className="text-6xl md:text-7xl drop-shadow-2xl"
                animate={isMoved ? {
                  rotate: [0, -10, 10, -10, 0],
                  y: [0, -20, 0]
                } : {}}
                transition={{ duration: 1, repeat: isMoved ? 3 : 0 }}
              >
                {animal.emoji}
              </motion.span>
              <span className="text-xs md:text-sm font-bold text-white bg-black/40 px-3 py-1 rounded-full mt-2 drop-shadow-lg">
                {animal.label}
              </span>
            </motion.button>
          )
        })}

        {/* Hogares (columna derecha) */}
        {ANIMALS.map((animal, index) => (
          <motion.div
            key={`home-${animal.id}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
            className="absolute flex flex-col items-center"
            style={{
              left: `${animal.homeX}%`,
              top: `${animal.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* ✅ Aro amarillo eliminado. Ahora es un círculo sutil y limpio */}
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-4xl md:text-5xl drop-shadow-lg">
                {animal.homeEmoji}
              </span>
            </div>
            <span className="text-xs md:text-sm font-bold text-white bg-black/40 px-3 py-1 rounded-full mt-2 drop-shadow-lg">
              {animal.homeLabel}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Instrucciones */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <p className="text-white text-xs md:text-sm font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          Toca un animal para enviarlo a su hogar
        </p>
      </div>

      {/* Modal de imagen limpia */}
      <AnimatePresence>
        {currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="relative flex flex-col items-center"
            >
              <motion.img
                src={currentImage.image}
                alt={currentImage.message}
                className="max-w-[80vw] max-h-[65vh] object-contain drop-shadow-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              />
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white text-xl md:text-2xl font-bold text-center mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/30 px-4 py-2 rounded-full"
              >
                {currentImage.message} ✨
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Victoria */}
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
                ¡Todos en casa!
              </h3>
              <p className="text-white text-lg mb-4">
                Cada animal encontró su hogar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}