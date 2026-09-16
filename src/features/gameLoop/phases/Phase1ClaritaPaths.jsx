import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Configuración de los 3 caminos - POSICIONES AJUSTADAS
const PATHS = [
  {
    id: 'panal',
    color: '#dc2626', // Rojo oscuro (como en la imagen)
    label: 'Camino rojo',
    isCorrect: false,
    destination: '/clarita-panal.jpeg',
    feedback: '¡Oh no! Este camino lleva al panal de abejas. ¡No es el hogar de Clarita! 🐝',
    buttonX: 25, // Izquierda (inicio del camino rojo)
    buttonY: 78  // Abajo, cerca de Clarita
  },
  {
    id: 'lago',
    color: '#0ea5e9', // Azul celeste (como en la imagen)
    label: 'Camino azul',
    isCorrect: false,
    destination: '/clarita-lago.png',
    feedback: '¡Ups! Este camino lleva al lago. Clarita no sabe nadar. 💧',
    buttonX: 43, // Centro (inicio del camino azul)
    buttonY: 78
  },
  {
    id: 'madriguera',
    color: '#16a34a', // Verde (como en la imagen)
    label: 'Camino verde',
    isCorrect: true,
    destination: '/clarita-avatar.jpeg',
    feedback: '',
    buttonX: 60, // Derecha (inicio del camino verde)
    buttonY: 78
  }
]

export default function Phase1ClaritaPaths({ onComplete }) {
  const [selectedPath, setSelectedPath] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handlePathClick = (path) => {
    setSelectedPath(path)
    setShowModal(true)

    if (path.isCorrect) {
      setTimeout(() => {
        setCompleted(true)
        setTimeout(() => onComplete(1), 3000)
      }, 2500)
    }
  }

  const handleCloseModal = () => {
    if (!completed) {
      setShowModal(false)
      setSelectedPath(null)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      
      {/* ✅ FONDO AJUSTADO: Prioriza la parte superior para ver los destinos */}
      <div 
        className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat"
        style={{ backgroundImage: "url('/level3-phase1-new-bg.jpeg')" }}
      />

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 pt-4 px-4"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2 inline-block shadow-md">
          <p className="text-amber-800 font-bold text-sm md:text-base">
             Ayuda a Clarita a encontrar su madriguera
          </p>
        </div>
      </motion.div>

      {/* ✅ CÍRCULOS REPOSICIONADOS: Ahora están abajo, donde empieza cada camino */}
      <div className="absolute inset-0 z-10">
        {PATHS.map((path, index) => (
          <motion.button
            key={path.id}
            onClick={() => handlePathClick(path)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="absolute rounded-full border-4 border-white shadow-xl flex items-center justify-center cursor-pointer"
            style={{
              left: `${path.buttonX}%`,
              top: `${path.buttonY}%`,
              width: 'clamp(50px, 12vw, 70px)',
              height: 'clamp(50px, 12vw, 70px)',
              backgroundColor: path.color,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <span className="text-white font-bold text-xs drop-shadow-lg">
              Toca
            </span>
          </motion.button>
        ))}
      </div>

      {/* Modal de destino */}
      <AnimatePresence>
        {showModal && selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className={`rounded-3xl p-6 text-center shadow-2xl max-w-md w-full border-4 border-white/50 ${
                selectedPath.isCorrect
                  ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500'
              }`}
            >
              <motion.img
                src={selectedPath.destination}
                alt={`Destino: ${selectedPath.label}`}
                className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto mb-4 rounded-full border-4 border-white/70 bg-white/20 backdrop-blur-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              />

              {selectedPath.isCorrect ? (
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    ¡Clarita encontró su hogar! 🎉
                  </h3>
                  <p className="text-white/95 text-lg drop-shadow">
                    ¡El camino verde lleva a la madriguera!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-white text-lg font-bold mb-4 drop-shadow-lg px-2">
                    {selectedPath.feedback}
                  </p>
                  <motion.button
                    onClick={handleCloseModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2 px-8 py-3 bg-white text-purple-700 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-purple-200"
                  >
                    Intentar de nuevo 🔄
                  </motion.button>
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
              className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">⭐</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¡Muy bien!
              </h3>
              <p className="text-white text-lg mb-4">
                Clarita llegó sana y salva a casa
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instrucciones */}
      <div className="relative z-10 mt-auto mb-6 text-center px-4">
        <p className="text-white text-xs md:text-sm font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full inline-block shadow-lg">
          Toca un círculo de color para explorar el camino
        </p>
      </div>
    </div>
  )
}