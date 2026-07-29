// src/features/gameLoop/phases/Phase1DragDrop.jsx
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Objetos a arrastrar y sus destinos correctos
const DRAG_ITEMS = [
  { id: 'star', emoji: '⭐', label: 'Estrella', target: 'sky' },
  { id: 'moon', emoji: '🌙', label: 'Luna', target: 'sky' },
  { id: 'flower', emoji: '🌸', label: 'Flor', target: 'garden' },
  { id: 'fish', emoji: '🐟', label: 'Pez', target: 'sea' }
]

const DROP_ZONES = [
  { id: 'sky', label: 'El Cielo', emoji: '☁️', color: 'from-blue-400 to-indigo-500' },
  { id: 'garden', label: 'El Jardín', emoji: '🌿', color: 'from-green-400 to-emerald-500' },
  { id: 'sea', label: 'El Mar', emoji: '🌊', color: 'from-cyan-400 to-blue-500' }
]

export default function Phase1DragDrop({ onComplete }) {
  const [placedItems, setPlacedItems] = useState({}) // { zoneId: [items] }
  const [draggingId, setDraggingId] = useState(null)
  const [feedback, setFeedback] = useState(null) // 'success' | 'error' | null
  const [completed, setCompleted] = useState(false)
  const dropZoneRefs = useRef({})

  // Verificar si todos los objetos están en su lugar correcto
  const checkCompletion = (newPlacedItems) => {
    const totalCorrect = DRAG_ITEMS.filter(item => {
      const zone = newPlacedItems[item.target]
      return zone && zone.find(placed => placed.id === item.id)
    }).length

    if (totalCorrect === DRAG_ITEMS.length) {
      setCompleted(true)
      setTimeout(() => onComplete(1), 1500) // 1 estrella ganada
    }
  }

  // Manejar el drop (cuando sueltas un objeto en una zona)
  const handleDrop = (zoneId, event) => {
    event.preventDefault()
    if (!draggingId) return

    const item = DRAG_ITEMS.find(i => i.id === draggingId)
    if (!item) return

    const isCorrect = item.target === zoneId

    if (isCorrect) {
      setFeedback('success')
      const newPlacedItems = {
        ...placedItems,
        [zoneId]: [...(placedItems[zoneId] || []), item]
      }
      setPlacedItems(newPlacedItems)
      checkCompletion(newPlacedItems)
    } else {
      setFeedback('error')
    }

    setDraggingId(null)
    setTimeout(() => setFeedback(null), 800)
  }

  // Items que aún no han sido colocados correctamente
  const availableItems = DRAG_ITEMS.filter(
    item => !Object.values(placedItems).flat().find(p => p.id === item.id)
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-100 via-orange-100 to-rose-100 p-4 md:p-8 flex flex-col">
      
      {/* Header con instrucciones */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-2">
          🎯 Fase 1: ¡Ordena el mundo!
        </h2>
        <p className="text-lg text-gray-700">
          Arrastra cada objeto a su lugar correcto
        </p>
      </motion.div>

      {/* Feedback visual */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`
              fixed top-20 left-1/2 -translate-x-1/2 z-50 
              px-8 py-4 rounded-full text-2xl font-bold shadow-2xl
              ${feedback === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
            `}
          >
            {feedback === 'success' ? '¡Correcto! ✨' : '¡Intenta de nuevo! 🤔'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de completado */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
          >
            <motion.div 
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl"
            >
              <div className="text-8xl mb-4">⭐</div>
              <h3 className="text-3xl font-bold text-purple-700">¡Fase 1 Completada!</h3>
              <p className="text-gray-600 mt-2">Ganaste tu primera estrella</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zonas de Drop (destinos) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 flex-grow">
        {DROP_ZONES.map(zone => (
          <motion.div
            key={zone.id}
            ref={el => dropZoneRefs.current[zone.id] = el}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(zone.id, e)}
            className={`
              bg-linear-to-br ${zone.color} rounded-2xl p-6 min-h-[180px]
              flex flex-col items-center justify-center
              border-4 border-dashed border-white/50
              transition-all duration-300
              ${draggingId ? 'scale-105 border-white' : ''}
            `}
          >
            <div className="text-5xl mb-2">{zone.emoji}</div>
            <h3 className="text-white font-bold text-xl mb-3">{zone.label}</h3>
            
            {/* Objetos colocados en esta zona */}
            <div className="flex flex-wrap gap-2 justify-center">
              {(placedItems[zone.id] || []).map(item => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white/90 rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg"
                >
                  {item.emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Objetos arrastrables */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-center text-gray-700 font-semibold mb-4">
          📦 Objetos para ordenar:
        </h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {availableItems.map(item => (
            <motion.div
              key={item.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', item.id)
                setDraggingId(item.id)
              }}
              onDragEnd={() => setDraggingId(null)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                bg-white rounded-2xl p-4 shadow-lg cursor-grab active:cursor-grabbing
                border-4 border-purple-300 flex flex-col items-center
                transition-all duration-200
                ${draggingId === item.id ? 'opacity-50 scale-90' : ''}
              `}
            >
              <div className="text-5xl mb-1">{item.emoji}</div>
              <span className="text-sm font-semibold text-purple-700">{item.label}</span>
            </motion.div>
          ))}
          
          {availableItems.length === 0 && !completed && (
            <p className="text-gray-500 italic">¡Todos los objetos han sido colocados!</p>
          )}
        </div>
      </div>

      {/* Progreso */}
      <div className="mt-4 text-center">
        <p className="text-gray-700 font-semibold">
          Progreso: {Object.values(placedItems).flat().length} / {DRAG_ITEMS.length}
        </p>
      </div>
    </div>
  )
}