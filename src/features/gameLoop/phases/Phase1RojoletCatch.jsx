import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../../context/AudioContext' // Ajusta la ruta si es necesario

// ✅ CORREGIDO: Se restauró el emoji de la baya roja
const FALLING_ITEMS = [
  { id: 'berry', emoji: '🍒', points: 10, type: 'good', label: 'Baya roja' },
  { id: 'dew', emoji: '💧', points: 10, type: 'good', label: 'Rocío' },
  { id: 'leaf', emoji: '🍂', points: 0, type: 'neutral', label: 'Hoja seca' }
]

export default function Phase1RojoletCatch({ onComplete }) {
  const { playSFX, playInstruction, stopInstruction } = useAudio()
  
  const [items, setItems] = useState([])
  const [score, setScore] = useState(0)
  const [caughtItems, setCaughtItems] = useState(0)
  const [showColorChange, setShowColorChange] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [colorIntensity, setColorIntensity] = useState(0)

  const TARGET_ITEMS = 15

  // ✅ Reproducir instrucción de voz a los 3 segundos de abrir la fase
   const hasPlayedRef = useRef(false) // <-- Agrega esta línea antes del useEffect

  useEffect(() => {
    if (hasPlayedRef.current) return // ✅ Evita que se repita si el componente se re-renderiza

    const timer = setTimeout(() => {
      hasPlayedRef.current = true
      playInstruction('level6-fase1-audio.mp3') // Cambia el nombre del archivo según el nivel
    }, 3000)
    
    return () => {
      clearTimeout(timer)
      stopInstruction() // ✅ Detiene la voz si el niño cambia de nivel o completa la fase
    }
  }, [playInstruction, stopInstruction])

  const spawnItem = useCallback(() => {
    if (completed || showColorChange) return
    
    const random = Math.random()
    let itemType
    
    if (random < 0.7) {
      itemType = FALLING_ITEMS[0] // Bayas (70%)
    } else if (random < 0.9) {
      itemType = FALLING_ITEMS[1] // Rocío (20%)
    } else {
      itemType = FALLING_ITEMS[2] // Hojas (10%)
    }

    const newItem = {
      ...itemType,
      uniqueId: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: -10,
      // ✅ TU VELOCIDAD PERSONALIZADA
      speed: Math.random() * 1 + 1
    }

    setItems(prev => [...prev, newItem])
  }, [completed, showColorChange])

  useEffect(() => {
    const interval = setInterval(spawnItem, 500)
    return () => clearInterval(interval)
  }, [spawnItem])

  useEffect(() => {
    if (completed) return

    const moveInterval = setInterval(() => {
      setItems(prevItems => {
        return prevItems
          .map(item => ({
            ...item,
            y: item.y + item.speed
          }))
          .filter(item => item.y < 130)
      })
    }, 50)

    return () => clearInterval(moveInterval)
  }, [completed])

  const handleItemClick = (item) => {
    // ✅ Sonido de interacción al tocar cualquier elemento
    playSFX('click')

    if (item.type === 'good') {
      // ✅ Sonido de acierto al atrapar bayas o rocío
      playSFX('correct')
      
      setScore(prev => prev + item.points)
      setCaughtItems(prev => {
        const newCount = prev + 1
        setColorIntensity(Math.min((newCount / TARGET_ITEMS) * 100, 100))
        
        if (newCount >= TARGET_ITEMS && !completed) {
          // ✅ Sonido de victoria al completar el objetivo
          playSFX('victory')
          setShowColorChange(true)
          setTimeout(() => {
            setCompleted(true)
            setTimeout(() => onComplete(1), 3000)
          }, 3500)
        }
        return newCount
      })
    } else {
      // ✅ Sonido de error/neutral al tocar una hoja seca (no suma puntos)
      playSFX('wrong')
    }

    setItems(prev => prev.filter(i => i.uniqueId !== item.uniqueId))
  }

  return (
    <div className="h-screen relative overflow-hidden">
      
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          showColorChange ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/rojolet-con-color.jpeg')" }}
      />
      
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          showColorChange ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: "url('/rojolet-sin-color.jpeg')" }}
      />

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
          <p className="text-red-800 font-bold text-sm md:text-base">
             Ayuda a Rojolet
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md flex gap-3">
          <p className="text-red-700 font-bold text-sm">
            Puntos: {score}
          </p>
          <div className="w-px h-5 bg-red-300" />
          <p className="text-red-700 font-bold text-sm">
            {caughtItems} / {TARGET_ITEMS}
          </p>
        </div>
      </motion.div>

      <div className="absolute top-20 left-4 right-4 z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-full h-4 overflow-hidden shadow-lg border-2 border-red-300">
          <motion.div
            className="h-full bg-linear-to-r from-red-400 via-red-500 to-red-600"
            initial={{ width: 0 }}
            animate={{ width: `${colorIntensity}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-white text-xs font-bold text-center mt-1 drop-shadow-lg">
          Color recuperado
        </p>
      </div>

      <AnimatePresence>
        {items.map((item) => (
          <motion.button
            key={item.uniqueId}
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              top: `${item.y}%`,
              left: `${item.x}%`,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleItemClick(item)}
            className={`absolute text-5xl md:text-6xl cursor-pointer drop-shadow-2xl ${
              item.type === 'good' ? 'hover:scale-125' : ''
            }`}
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            whileHover={item.type === 'good' ? { scale: 1.3, rotate: [0, -10, 10, 0] } : {}}
            whileTap={item.type === 'good' ? { scale: 0.9 } : {}}
          >
            {item.emoji}
          </motion.button>
        ))}
      </AnimatePresence>

      {!showColorChange && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <p className="text-white text-xs md:text-sm font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            Toca las bayas 🍒 y el rocío 💧 antes de que caigan
          </p>
        </div>
      )}

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
              className="bg-linear-to-br from-red-400 via-orange-500 to-yellow-500 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full border-4 border-yellow-300"
            >
              <div className="text-7xl mb-3">✨</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                ¡Rojolet recuperó su color!
              </h3>
              <p className="text-white text-lg mb-4 drop-shadow">
                Su plumaje brilla más que nunca gracias a ti
              </p>
              <div className="text-6xl animate-pulse">🐦</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}