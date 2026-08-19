import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Componente reutilizable para el juego de memoria
export default function MemoryGame({ pairs, onComplete }) {
  // ✅ CORRECCIÓN 1 y 3: Inicialización perezosa (lazy) para evitar setState en useEffect
  const [cards] = useState(() => {
    const duplicated = [...pairs, ...pairs]
    return duplicated
      .map((card) => ({ card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => item.card)
  })
  
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [disabled, setDisabled] = useState(false)
  const [showChest, setShowChest] = useState(false)

  // ✅ CORRECCIÓN 4: Posiciones fijas precalculadas para evitar Math.random en el render
  const sparklePositions = useMemo(() => [
    { top: '25%', left: '15%' },
    { top: '30%', left: '80%' },
    { top: '60%', left: '20%' },
    { top: '70%', left: '75%' },
    { top: '40%', left: '50%' },
    { top: '80%', left: '40%' }
  ], [])

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || matched.includes(index)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setDisabled(true)
      const [first, second] = newFlipped
      
      if (cards[first] === cards[second]) {
        const newMatched = [...matched, first, second]
        setMatched(newMatched)
        setFlipped([])
        setDisabled(false)

        // Verificar victoria
        if (newMatched.length === cards.length) {
          setTimeout(() => {
            setShowChest(true)
            setTimeout(() => onComplete(1), 4000)
          }, 800)
        }
      } else {
        setTimeout(() => {
          setFlipped([])
          setDisabled(false)
        }, 1000)
      }
    }
  }

  const isFlipped = (index) => flipped.includes(index) || matched.includes(index)
  const isMatched = (index) => matched.includes(index)

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/level4-phases-bg.jpeg')" }}
      />

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 pt-4 px-4"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 inline-block shadow-md">
          <p className="text-amber-800 font-bold text-sm md:text-base">
            🐿️ Encuentra los momentos tesoros de Rojita
          </p>
        </div>
        <div className="mt-2 bg-white/70 rounded-full px-4 py-1 inline-block ml-2">
          <p className="text-amber-700 font-semibold text-xs">
            Pares encontrados: {matched.length / 2} / {pairs.length}
          </p>
        </div>
      </motion.div>

      {/* Panel de cartas a la derecha */}
      <div className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10">
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {cards.map((card, index) => (
            <motion.button
              key={index}
              onClick={() => handleCardClick(index)}
              disabled={disabled}
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ delay: index * 0.05, type: 'spring' }}
              whileHover={!isMatched(index) ? { scale: 1.05 } : {}}
              whileTap={!isMatched(index) ? { scale: 0.95 } : {}}
              className="relative cursor-pointer"
              style={{ 
                width: '70px', 
                height: '70px',
                perspective: '1000px'
              }}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isFlipped(index) ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Cara trasera (dorso de la carta) */}
                <div
                  // ✅ CORRECCIÓN 5: bg-linear-to-br en lugar de bg-gradient-to-br
                  className="absolute inset-0 rounded-xl bg-linear-to-br from-amber-600 to-orange-700 border-2 border-amber-400 shadow-lg flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-2xl">🍂</span>
                </div>

                {/* Cara frontal (imagen) */}
                <div
                  className={`absolute inset-0 rounded-xl overflow-hidden border-2 shadow-lg ${
                    isMatched(index) ? 'border-green-500 ring-2 ring-green-300' : 'border-amber-300'
                  }`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <img 
                    src={`/${card}.jpeg`}
                    alt="Momento tesoro"
                    className="w-full h-full object-cover"
                  />
                  {isMatched(index) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modal del cofre animado */}
      <AnimatePresence>
        {showChest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              // ✅ CORRECCIÓN 5: bg-linear-to-br
              className="bg-linear-to-br from-amber-400 via-yellow-500 to-orange-600 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full border-4 border-yellow-300 relative"
            >
              {/* Animación del cofre */}
              <motion.div
                className="text-8xl mb-4"
                initial={{ rotate: -20, scale: 0.5 }}
                animate={{ 
                  rotate: [0, -10, 10, -5, 5, 0],
                  scale: [1, 1.2, 1.1, 1.15, 1]
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                🎁
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  ¡Rojita guardó sus tesoros!
                </h3>
                <p className="text-white/95 text-lg drop-shadow">
                  Los momentos compartidos son los más queridos
                </p>
              </motion.div>

              {/* Destellos con posiciones precalculadas (puro) */}
              {sparklePositions.map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{ top: pos.top, left: pos.left }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 0.5 + i * 0.2,
                    repeat: 2
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}