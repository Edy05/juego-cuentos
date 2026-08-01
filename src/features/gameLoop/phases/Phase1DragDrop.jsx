import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Objetos que NO pertenecen al jardín (basura a recoger)
const TRASH_ITEMS = [
  { id: 'paper1', emoji: '', label: 'Papel' },
  { id: 'pizza', emoji: '🍕', label: 'Pizza' },
  { id: 'can', emoji: '🥫', label: 'Lata' },
  { id: 'bottle', emoji: '🥤', label: 'Vaso' },
  { id: 'wrench', emoji: '🔧', label: 'Herramienta' },
]

export default function Phase1DragDrop({ onComplete }) {
  const [collectedTrash, setCollectedTrash] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [draggingItem, setDraggingItem] = useState(null)

  const checkCompletion = (newCollected) => {
    if (newCollected.length === TRASH_ITEMS.length) {
      setCompleted(true)
      setTimeout(() => onComplete(1), 2500)
    }
  }

  const handleDragEnd = (event, info, item) => {
    const basketElement = document.querySelector('[data-basket="true"]')
    if (!basketElement) return

    const basketRect = basketElement.getBoundingClientRect()
    const itemElement = event.target.getBoundingClientRect()
    
    // Verificar si el objeto cayó dentro del cesto
    const itemCenterX = itemElement.left + itemElement.width / 2
    const itemCenterY = itemElement.top + itemElement.height / 2
    
    const isInsideBasket = 
      itemCenterX >= basketRect.left &&
      itemCenterX <= basketRect.right &&
      itemCenterY >= basketRect.top &&
      itemCenterY <= basketRect.bottom

    if (isInsideBasket) {
      setFeedback({ type: 'success', emoji: item.emoji })
      const newCollected = [...collectedTrash, item]
      setCollectedTrash(newCollected)
      checkCompletion(newCollected)
      setTimeout(() => setFeedback(null), 800)
    }
    
    setDraggingItem(null)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* IMAGEN DE FONDO DEL JARDÍN */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/garden-game-bg.png')" }}
      />
      
      {/* Capa oscura muy suave para que los objetos resalten */}
      <div className="absolute inset-0 bg-white/10" />

      {/* Header con instrucciones */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 text-center mb-2 p-2"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-1">
           ¡Ayuda a Lina!
        </h2>
        <p className="text-sm text-white drop-shadow-md bg-black/30 inline-block px-3 py-1 rounded-full">
          Arrastra la basura al cesto 🗑️
        </p>
      </motion.div>

      {/* Mariquita preocupada */}
      <motion.div 
        initial={{ scale: 0, x: -100 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="absolute top-16 left-2 z-10"
      >
        <div className="bg-white/95 rounded-2xl p-3 shadow-xl border-4 border-red-400 max-w-[120px]">
          <div className="text-5xl mb-1 text-center">🐞</div>
          <div className="text-xs text-center font-bold text-gray-700">
            ¡Mi jardín está sucio! 😟
          </div>
        </div>
      </motion.div>

      {/* Cesto de basura (zona de drop) */}
      <motion.div
        initial={{ scale: 0, x: 100 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
        data-basket="true"
        className="absolute top-16 right-2 z-10"
      >
        <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-2xl p-4 shadow-xl border-4 border-amber-900 min-w-[100px]">
          <div className="text-4xl text-center mb-1">🗑️</div>
          <div className="text-xs text-center font-bold text-white">
            Cesto
          </div>
          <div className="text-xs text-center text-amber-200 mt-1">
            {collectedTrash.length}/{TRASH_ITEMS.length}
          </div>
        </div>
      </motion.div>

      {/* Feedback visual */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold shadow-2xl"
          >
            ¡Bien! {feedback.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de victoria */}
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
              className="bg-linear-to-br from-green-400 to-emerald-600 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">✨</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¡Misión Completada!
              </h3>
              <p className="text-white text-lg mb-4">
                Has ayudado a Lina con su jardín
              </p>
              <div className="text-5xl animate-bounce">⭐</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* JARDÍN - Área principal con objetos */}
      <div className="relative z-0 mt-32 mb-24 min-h-[300px]">
        
        {TRASH_ITEMS.map((item, index) => {
          const isCollected = collectedTrash.find(i => i.id === item.id)
          if (isCollected) return null

          const positions = [
            { left: '15%', top: '35%' },
            { left: '65%', top: '40%' },
            { left: '40%', top: '55%' },
            { left: '80%', top: '60%' },
            { left: '25%', top: '65%' },
          ]
          const pos = positions[index]

          return (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              onDragStart={() => setDraggingItem(item.id)}
              onDragEnd={(e, info) => handleDragEnd(e, info, item)}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                opacity: draggingItem === item.id ? 0.5 : 1
              }}
              transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute cursor-grab active:cursor-grabbing z-20 touch-none"
              style={{ 
                left: pos.left, 
                top: pos.top,
                position: 'absolute'
              }}
            >
              <div className="bg-white/95 rounded-xl p-3 shadow-lg border-2 border-gray-300">
                <div className="text-4xl text-center">{item.emoji}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}