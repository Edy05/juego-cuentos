import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../../context/AudioContext' // Ajusta la ruta si es necesario

// HÁBITATS (zonas donde el niño debe soltar los animales)
const HABITATS = [
  { id: 'arbol', label: 'Árbol', emoji: '🌳', x: 25, y: 35, color: 'bg-green-500/30' },
  { id: 'madriguera', label: 'Madriguera', emoji: '🕳️', x: 75, y: 40, color: 'bg-amber-700/30' },
  { id: 'lago', label: 'Lago', emoji: '💧', x: 25, y: 75, color: 'bg-blue-400/30' },
  { id: 'casa', label: 'Casa', emoji: '🏠', x: 75, y: 70, color: 'bg-red-400/30' }
]

// 10 ANIMALES con sus destinos correctos
const ANIMALS = [
  { id: 'ardilla', name: 'Ardilla', image: '/animal-ardilla.jpeg', target: 'arbol', startX: 50, startY: 50 },
  { id: 'lechuza', name: 'Lechuza', image: '/animal-lechuza.jpeg', target: 'arbol', startX: 45, startY: 55 },
  { id: 'cuervo', name: 'Cuervo', image: '/animal-cuervo.jpeg', target: 'arbol', startX: 55, startY: 45 },
  { id: 'pajaritos', name: 'Pajaritos', image: '/animal-pajaritos.jpeg', target: 'arbol', startX: 50, startY: 60 },
  { id: 'sapo', name: 'Sapo', image: '/animal-sapo.jpeg', target: 'lago', startX: 60, startY: 40 },
  { id: 'mariquita', name: 'Mariquita', image: '/animal-mariquita.jpeg', target: 'madriguera', startX: 40, startY: 60 },
  { id: 'oruga', name: 'Oruga', image: '/animal-oruga.jpeg', target: 'madriguera', startX: 60, startY: 60 },
  { id: 'caracol', name: 'Caracol', image: '/animal-caracol.jpeg', target: 'casa', startX: 40, startY: 40 },
  { id: 'grillo', name: 'Grillo', image: '/animal-grillo.jpeg', target: 'casa', startX: 55, startY: 55 },
  { id: 'girasol', name: 'Girasol', image: '/animal-girasol.jpeg', target: 'casa', startX: 45, startY: 45 }
]

export default function Phase1Level7Habitats({ onComplete }) {
  const { playSFX, playInstruction } = useAudio()
  
  const [placedIds, setPlacedIds] = useState([])
  const [resetKey, setResetKey] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  // ✅ Reproducir instrucción de voz a los 3 segundos de abrir la fase
  useEffect(() => {
    const timer = setTimeout(() => {
      playInstruction('level7-fase1-audio.mp3')
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [playInstruction])

  const handleDragEnd = useCallback((animal, _event, info) => {
    if (placedIds.includes(animal.id)) return

    const target = HABITATS.find((h) => h.id === animal.target)
    
    const dropX = (info.point.x / window.innerWidth) * 100
    const dropY = (info.point.y / window.innerHeight) * 100

    const distance = Math.sqrt(Math.pow(dropX - target.x, 2) + Math.pow(dropY - target.y, 2))

    // Si está a menos del 20% de distancia, ¡es un acierto!
    if (distance < 20) {
      // ✅ Sonido de acierto al colocar el animal correctamente
      playSFX('correct')

      // Marcar como colocado
      const newPlaced = [...placedIds, animal.id]
      setPlacedIds(newPlaced)

      // Mostrar mensaje de éxito
      setSuccessMessage(`¡${animal.name} en su hogar!`)
      setTimeout(() => setSuccessMessage(null), 2000)

      // Verificar si todos están colocados
      if (newPlaced.length === ANIMALS.length) {
        setTimeout(() => {
          // ✅ Sonido de victoria al completar el nivel
          playSFX('victory')
          setCompleted(true)
          setTimeout(() => onComplete(1), 3000)
        }, 1500)
      }
    } else {
      // ✅ Sonido de error al soltar el animal en un lugar incorrecto
      playSFX('wrong')
      
      // Si falló, regresa a su lugar
      setResetKey((prev) => prev + 1)
    }
  }, [placedIds, onComplete, playSFX])

  return (
    <div className="h-screen relative overflow-hidden flex flex-col bg-sky-50">
      
      {/* Fondo del nivel */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/level7-habitats-bg.jpeg')" }}
      />

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 pt-4 px-4 text-center"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2 inline-block shadow-md">
          <p className="text-indigo-800 font-bold text-sm md:text-base">
             Devuelve a cada animalito a su hábitat
          </p>
        </div>
      </motion.div>

      {/* Zonas de hábitats (guías visuales) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {HABITATS.map((habitat) => {
          const animalsForThisHabitat = ANIMALS.filter(a => a.target === habitat.id)
          const placedForThisHabitat = animalsForThisHabitat.filter(a => placedIds.includes(a.id)).length
          const isFull = placedForThisHabitat === animalsForThisHabitat.length

          return (
            <div
              key={habitat.id}
              className={`absolute w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-dashed border-white/60 flex flex-col items-center justify-center transition-all duration-500 ${habitat.color} ${isFull ? 'bg-green-400/40 border-green-400 scale-110' : ''}`}
              style={{ left: `${habitat.x}%`, top: `${habitat.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span className="text-2xl md:text-3xl mb-1 drop-shadow-md">{habitat.emoji}</span>
              <span className="text-white font-bold text-[10px] md:text-xs drop-shadow-md text-center px-1 leading-tight">
                {habitat.label}
              </span>
              <span className="text-white/80 text-[10px] mt-1">
                {placedForThisHabitat}/{animalsForThisHabitat.length}
              </span>
            </div>
          )
        })}
      </div>

      {/* Animales arrastrables */}
      <div className="absolute inset-0 z-20">
        {ANIMALS.map((animal) => {
          const isPlaced = placedIds.includes(animal.id)

          return (
            <motion.div
              key={`${resetKey}-${animal.id}`}
              drag={!isPlaced}
              dragMomentum={false}
              onDragStart={() => !isPlaced && playSFX('click')} // ✅ Sonido al comenzar a arrastrar
              onDragEnd={(_event, info) => handleDragEnd(animal, _event, info)}
              initial={false}
              animate={{
                left: `${animal.startX}%`,
                top: `${animal.startY}%`,
                scale: isPlaced ? 0 : 1,
                opacity: isPlaced ? 0 : 0.95
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`absolute flex items-center justify-center cursor-grab active:cursor-grabbing ${
                isPlaced ? 'pointer-events-none' : ''
              }`}
              style={{ transform: 'translate(-50%, -50%)' }}
              whileHover={!isPlaced ? { scale: 1.15 } : {}}
              whileTap={!isPlaced ? { scale: 0.95 } : {}}
            >
              {/* Imagen pequeña y redondeada */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-3 border-white shadow-xl overflow-hidden bg-white">
                <img 
                  src={animal.image} 
                  alt={animal.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                  onError={(e) => {
                    if (animal.id === 'girasol') {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = '<span class="text-2xl">🌻</span>'
                    }
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Mensaje de éxito con efecto de brillo */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
          >
            <motion.div
              animate={{ 
                boxShadow: ['0 0 20px rgba(250, 204, 21, 0.8)', '0 0 40px rgba(250, 204, 21, 1)', '0 0 20px rgba(250, 204, 21, 0.8)']
              }}
              transition={{ duration: 1, repeat: 2 }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full px-8 py-4 shadow-2xl border-4 border-yellow-300"
            >
              <p className="text-white font-bold text-xl md:text-2xl drop-shadow-lg text-center">
                ✨ {successMessage} 
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contador de progreso */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-indigo-200">
          <p className="text-indigo-900 font-bold text-sm">
             Animales en casa: {placedIds.length} / {ANIMALS.length}
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
              className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full border-4 border-white/50"
            >
              <div className="text-7xl mb-3">🏆</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                ¡Nivel Especial Completado!
              </h3>
              <p className="text-white text-lg mb-4 drop-shadow">
                Todos los animalitos están felices en sus hogares
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}