import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../../context/AudioContext' // Ajusta la ruta si es necesario

const PUZZLE_SIZE = 3
const TOTAL_PIECES = PUZZLE_SIZE * PUZZLE_SIZE

const generatePieces = () => {
  const pieces = []
  for (let row = 0; row < PUZZLE_SIZE; row++) {
    for (let col = 0; col < PUZZLE_SIZE; col++) {
      pieces.push({
        id: `${row}-${col}`,
        correctRow: row,
        correctCol: col,
        backgroundPosition: `${(col / (PUZZLE_SIZE - 1)) * 100}% ${(row / (PUZZLE_SIZE - 1)) * 100}%`
      })
    }
  }
  return pieces
}

const INITIAL_PIECES = generatePieces()

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Phase2Level7Puzzle({ onComplete }) {
  const { playSFX, playInstruction } = useAudio()
  
  const [pieces] = useState(() => shuffleArray(INITIAL_PIECES))
  const [placedPieces, setPlacedPieces] = useState({})
  const [completed, setCompleted] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)
  const [draggedPiece, setDraggedPiece] = useState(null)

  // ✅ Reproducir instrucción de voz a los 3 segundos de abrir la fase
  useEffect(() => {
    const timer = setTimeout(() => {
      playInstruction('level7-fase2-audio.mp3')
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [playInstruction])

  const handleDragEnd = useCallback((piece, info) => {
    if (placedPieces[piece.id]) return

    const dropX = info.point.x
    const dropY = info.point.y
    
    const gridWidth = Math.min(window.innerWidth * 0.8, 500)
    const gridHeight = gridWidth
    const gridStartX = (window.innerWidth - gridWidth) / 2
    const gridStartY = (window.innerHeight - gridHeight) / 2 + 50

    if (
      dropX >= gridStartX &&
      dropX <= gridStartX + gridWidth &&
      dropY >= gridStartY &&
      dropY <= gridStartY + gridHeight
    ) {
      const col = Math.floor(((dropX - gridStartX) / gridWidth) * PUZZLE_SIZE)
      const row = Math.floor(((dropY - gridStartY) / gridHeight) * PUZZLE_SIZE)

      if (row === piece.correctRow && col === piece.correctCol) {
        // ✅ Sonido de acierto al colocar la pieza correctamente
        playSFX('correct')
        
        const newPlaced = { 
          ...placedPieces, 
          [piece.id]: { row, col, backgroundPosition: piece.backgroundPosition } 
        }
        setPlacedPieces(newPlaced)

        if (Object.keys(newPlaced).length === TOTAL_PIECES) {
          setTimeout(() => {
            // ✅ Sonido de victoria al completar el rompecabezas
            playSFX('victory')
            setShowFullImage(true)
            setTimeout(() => {
              setCompleted(true)
              setTimeout(() => onComplete(1), 4000)
            }, 3500)
          }, 800)
        }
      } else {
        // ✅ Sonido de error si cae en la cuadrícula pero en el lugar equivocado
        playSFX('wrong')
      }
    } else {
      // ✅ Sonido de error si cae fuera de la cuadrícula
      playSFX('wrong')
    }
  }, [placedPieces, onComplete, playSFX])

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      
      {/* FONDO COMPLETO SIN DIFUMINAR */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/libro-cuentos.jpg')" }}
      />
      
      {/* Capa oscura suave para que las piezas resalten */}
      <div className="absolute inset-0 bg-black/30" />

      {/* ✅ IMAGEN GUÍA: Más a la izquierda (left-1) y más pequeña */}
      <div className="absolute top-20 left-1 md:left-2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border-2 border-purple-300">
          <p className="text-purple-700 font-bold text-[9px] text-center mb-0.5">Guía</p>
          <img 
            src="/libro-cuentos.jpg" 
            alt="Imagen guía"
            className="w-14 h-20 md:w-20 md:h-28 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* HEADER */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 pt-4 px-4 text-center"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2 inline-block shadow-md">
          <p className="text-purple-800 font-bold text-sm md:text-base">
             Arma el rompecabezas del libro
          </p>
        </div>
      </motion.div>

      {/* Cuadrícula del rompecabezas */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-10">
        <div className="grid grid-cols-3 gap-1 md:gap-2 p-2 bg-white/30 backdrop-blur-sm rounded-xl shadow-2xl border-4 border-purple-300">
          {[...Array(TOTAL_PIECES).keys()].map((index) => {
            const row = Math.floor(index / PUZZLE_SIZE)
            const col = index % PUZZLE_SIZE
            
            const placedPiece = Object.values(placedPieces).find(
              (pos) => pos.row === row && pos.col === col
            )

            return (
              <div
                key={index}
                className={`w-24 h-24 md:w-32 md:h-32 rounded-lg border-2 border-dashed transition-all duration-300 ${
                  placedPiece 
                    ? 'border-transparent bg-transparent'
                    : 'border-purple-300 bg-white/20'
                }`}
              >
                {placedPiece && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full h-full rounded-lg overflow-hidden shadow-lg"
                    style={{
                      backgroundImage: "url('/libro-cuentos.jpg')",
                      backgroundSize: `${PUZZLE_SIZE * 100}% ${PUZZLE_SIZE * 100}%`,
                      backgroundPosition: placedPiece.backgroundPosition
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ✅ Cuadro de piezas: Piezas más pequeñas para que quepan todas */}
      <div className="relative z-20 pb-6 px-4">
        <div className="bg-purple-100/80 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-2 border-purple-300">
          <p className="text-purple-700 font-bold text-xs mb-2 text-center">
            Arrastra las piezas a su lugar correcto
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
            {pieces.map((piece) => {
              const isPlaced = placedPieces[piece.id]
              
              return (
                <motion.div
                  key={piece.id}
                  drag={!isPlaced}
                  dragMomentum={false}
                  onDragStart={() => {
                    setDraggedPiece(piece.id)
                    playSFX('click') // ✅ Sonido al comenzar a arrastrar
                  }}
                  onDragEnd={(event, info) => handleDragEnd(piece, info)}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: isPlaced ? 0 : 1,
                    opacity: isPlaced ? 0 : 1
                  }}
                  className={`w-11 h-11 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 border-purple-400 shadow-lg cursor-grab active:cursor-grabbing ${
                    draggedPiece === piece.id ? 'z-50' : ''
                  }`}
                  style={{
                    backgroundImage: "url('/libro-cuentos.jpg')",
                    backgroundSize: `${PUZZLE_SIZE * 100}% ${PUZZLE_SIZE * 100}%`,
                    backgroundPosition: piece.backgroundPosition
                  }}
                  whileHover={!isPlaced ? { scale: 1.1 } : {}}
                  whileTap={!isPlaced ? { scale: 0.95 } : {}}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* IMAGEN COMPLETA ANTES DEL MODAL DE VICTORIA */}
      <AnimatePresence>
        {showFullImage && !completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="relative"
            >
              <img 
                src="/libro-cuentos.jpg" 
                alt="Libro completo"
                className="max-w-[80vw] max-h-[70vh] object-contain rounded-2xl shadow-2xl border-4 border-yellow-400"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full px-6 py-3 shadow-xl"
              >
                <p className="text-white font-bold text-lg md:text-xl drop-shadow-lg text-center whitespace-nowrap">
                  ✨ ¡Lo armaste perfecto! ✨
                </p>
              </motion.div>
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full border-4 border-yellow-300"
            >
              <motion.div 
                className="text-8xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🏆
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                ¡Felicidades!
              </h3>
              <p className="text-white text-lg mb-4 drop-shadow">
                Completaste todos los niveles del juego
              </p>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-white text-sm font-semibold">
                  "Cuentos para crecer despacito"
                </p>
                <p className="text-white/80 text-xs mt-1">
                  Historias para soñar y aprender
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}