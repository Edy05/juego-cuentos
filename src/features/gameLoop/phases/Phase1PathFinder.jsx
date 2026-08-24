import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Configuración de los animales y sus hogares
const ANIMALS = [
  {
    id: 'bee',
    emoji: '🐝',
    label: 'Abeja',
    homeEmoji: '🍯',
    homeLabel: 'Panal',
    image: '/abeja-home.jpeg', // ✅ Imagen al llegar al hogar
    startX: 20,
    startY: 60,
    homeX: 20,
    homeY: 20,
    message: '¡La abeja voló hacia su panal!'
  },
  {
    id: 'squirrel',
    emoji: '🐿️',
    label: 'Ardilla',
    homeEmoji: '🏡',
    homeLabel: 'Madriguera',
    image: '/ardilla-home.jpeg', // ✅ Imagen al llegar al hogar
    startX: 50,
    startY: 65,
    homeX: 50,
    homeY: 15,
    message: '¡La ardilla corrió a su madriguera!'
  },
  {
    id: 'ladybug',
    emoji: '🐞', // ✅ CORREGIDO: emoji de mariquita visible
    label: 'Mariquita',
    homeEmoji: '🌸',
    homeLabel: 'Flor',
    image: '/mariquita-home.jpeg', // ✅ Imagen al llegar al hogar
    startX: 80,
    startY: 60,
    homeX: 80,
    homeY: 20,
    message: '¡La mariquita voló hacia su flor!'
  }
]

export default function Phase1PathFinder({ onComplete }) {
  const [movedAnimals, setMovedAnimals] = useState({})
  const [currentImage, setCurrentImage] = useState(null) // ✅ Nuevo estado para el modal de imagen
  const [completed, setCompleted] = useState(false)

  const handleAnimalClick = (animal) => {
    if (movedAnimals[animal.id]) return

    // Marcar como movido
    setMovedAnimals(prev => ({ ...prev, [animal.id]: true }))

    // Después de 4 segundos (cuando termine la animación), mostrar la imagen
    setTimeout(() => {
      setCurrentImage(animal)
      
      // Cerrar el modal de imagen después de 2.5 segundos
      setTimeout(() => {
        setCurrentImage(null)
        
        // Verificar si todos se movieron para mostrar victoria
        const newMoved = { ...movedAnimals, [animal.id]: true }
        if (Object.keys(newMoved).length === ANIMALS.length) {
          setTimeout(() => {
            setCompleted(true)
            setTimeout(() => onComplete(1), 3000)
          }, 500)
        }
      }, 2500)
    }, 4000) // Esperar los 4 segundos de la animación
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      
      {/* Fondo del nivel */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom md:bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/level3-phase1-bg.jpeg')" }}
      />

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 pt-4 px-4"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2 inline-block shadow-md">
          <p className="text-amber-800 font-bold text-sm md:text-base">
            🐜 Ayuda a cada animal a encontrar su hogar
          </p>
        </div>
        <div className="mt-2 bg-white/70 rounded-full px-4 py-1 inline-block ml-2">
          <p className="text-amber-700 font-semibold text-xs">
            Animales en casa: {Object.keys(movedAnimals).length} / {ANIMALS.length}
          </p>
        </div>
      </motion.div>

      {/* Hogares (siempre visibles arriba) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {ANIMALS.map((animal) => (
          <motion.div
            key={`home-${animal.id}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute flex flex-col items-center"
            style={{
              left: `${animal.homeX}%`,
              top: `${animal.homeY}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <span className="text-5xl md:text-6xl drop-shadow-lg">
              {animal.homeEmoji}
            </span>
            <span className="text-xs md:text-sm font-bold text-white bg-black/40 px-2 py-0.5 rounded-full mt-1">
              {animal.homeLabel}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Animales (se mueven al tocarlos) */}
      <div className="absolute inset-0 z-10">
        {ANIMALS.map((animal, index) => {
          const isMoved = movedAnimals[animal.id]
          
          return (
            <motion.button
              key={animal.id}
              onClick={() => handleAnimalClick(animal)}
              initial={{ 
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                scale: 1,
                x: isMoved ? (animal.homeX - animal.startX) * 10 : 0,
                y: isMoved ? (animal.homeY - animal.startY) * 10 : 0
              }}
              transition={{ 
                delay: 0.3 + index * 0.1,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={!isMoved ? { scale: 1.2 } : {}}
              whileTap={!isMoved ? { scale: 0.9 } : {}}
              className={`absolute flex flex-col items-center cursor-pointer ${
                isMoved ? 'pointer-events-none opacity-0' : ''
              }`}
              style={{
                left: `${animal.startX}%`,
                top: `${animal.startY}%`,
                transform: 'translate(-50%, -50%)',
                transition: isMoved ? 'all 4s ease-in-out' : 'none'
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
              <span className="text-xs md:text-sm font-bold text-white bg-black/40 px-2 py-0.5 rounded-full mt-1">
                {animal.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* ✅ MODAL DE IMAGEN LIMPIA - Aparece cuando el animal llega a su hogar */}
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
              className="relative"
            >
              {/* Imagen limpia sin fondo de tarjeta */}
              <motion.img
                src={currentImage.image}
                alt={currentImage.message}
                className="max-w-[80vw] max-h-[70vh] object-contain drop-shadow-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              />
              
              {/* Mensaje flotante debajo de la imagen */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white text-xl md:text-2xl font-bold text-center mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
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

      {/* Instrucciones */}
      <div className="relative z-10 mt-auto mb-6 text-center px-4">
        <p className="text-white text-xs md:text-sm font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full inline-block shadow-lg">
          Toca cada animal para llevarlo a su hogar
        </p>
      </div>
    </div>
  )
}