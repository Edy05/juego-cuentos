import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Definición de los animales y sus partes
const ANIMALS = ['thomas', 'ardilla', 'lechuza', 'hormiga']

const BODY_PARTS = [
  { id: 'head', label: 'Cabeza', y: 0 },
  { id: 'body', label: 'Cuerpo', y: 120 },
  { id: 'legs', label: 'Patas', y: 240 }
]

// Estado inicial: cada parte muestra un animal aleatorio (pero no Thomas completo al inicio)
const getRandomAnimal = (exclude = null) => {
  const filtered = ANIMALS.filter(a => a !== exclude)
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export default function Phase1BodyPuzzle({ onComplete }) {
  const [parts, setParts] = useState({
    head: getRandomAnimal('thomas'),
    body: getRandomAnimal('thomas'),
    legs: getRandomAnimal('thomas')
  })
  const [completed, setCompleted] = useState(false)

  const handlePartClick = (partId) => {
    if (completed) return

    // Ciclo entre los 4 animales
    const currentIndex = ANIMALS.indexOf(parts[partId])
    const nextIndex = (currentIndex + 1) % ANIMALS.length
    const nextAnimal = ANIMALS[nextIndex]

    setParts(prev => ({ ...prev, [partId]: nextAnimal }))

    // Verificar si completó
    const newParts = { ...parts, [partId]: nextAnimal }
    if (newParts.head === 'thomas' && newParts.body === 'thomas' && newParts.legs === 'thomas') {
      setCompleted(true)
      setTimeout(() => onComplete(1), 3000)
    }
  }

  return (
   <div className="min-h-screen relative overflow-hidden p-4 flex flex-col items-center" style={{ backgroundImage: "url('/phase2-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
           ¡Arma a Thomas!
        </h2>
        <p className="text-sm md:text-base text-green-700">
          Toca cada parte para encontrar las piezas correctas
        </p>
      </motion.div>

      {/* Contador de progreso */}
      <div className="mb-4 bg-white/80 rounded-full px-6 py-2 shadow-md">
        <p className="text-green-800 font-bold">
          Partes correctas: {Object.values(parts).filter(p => p === 'thomas').length} / 3
        </p>
      </div>

      {/* Animal combinado */}
      <div className="relative flex-grow flex items-center justify-center">
        <div className="relative w-64 h-96">
          {BODY_PARTS.map((part) => {
            const currentAnimal = parts[part.id]
            const isCorrectPart = currentAnimal === 'thomas'

            return (
              <motion.button
                key={part.id}
                onClick={() => handlePartClick(part.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute left-1/2 -translate-x-1/2 w-48 h-32 rounded-2xl overflow-hidden shadow-lg border-4 transition-all duration-300 ${
                  isCorrectPart 
                    ? 'border-green-500 ring-4 ring-green-300' 
                    : 'border-gray-300 hover:border-purple-400'
                }`}
                style={{ top: `${part.y}px` }}
              >
                <img 
                  src={`/${currentAnimal}-${part.id}.jpeg`}
                  alt={`${currentAnimal} ${part.label}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden w-full h-full bg-gray-200 items-center justify-center text-4xl">
                  {currentAnimal === 'thomas' ? '🐛' : currentAnimal === 'ardilla' ? '🐿️' : currentAnimal === 'lechuza' ? '' : '🐜'}
                </div>

                {/* Indicador de parte correcta */}
                {isCorrectPart && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold shadow-lg"
                  >
                    ✓
                  </motion.div>
                )}

                {/* Etiqueta de la parte */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs font-bold py-1 text-center">
                  {part.label}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Modal de Victoria - Thomas Completo */}
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
              className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full"
            >
              <img 
                src="/thomas.jpeg"
                alt="Thomas completo"
                className="w-48 h-48 object-contain mx-auto mb-4 rounded-full border-4 border-green-400"
              />
              <h3 className="text-3xl font-bold text-green-700 mb-2">
                ¡Thomas está completo!
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                Has encontrado todas las partes correctas
              </p>
              <div className="text-6xl animate-bounce">⭐</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instrucciones */}
      <div className="mt-4 text-center">
        <div className="bg-white/90 rounded-full px-6 py-3 shadow-lg inline-block">
          <p className="text-green-800 font-bold text-sm md:text-base">
             Toca cada parte para cambiar el animal
          </p>
        </div>
      </div>
    </div>
  )
}