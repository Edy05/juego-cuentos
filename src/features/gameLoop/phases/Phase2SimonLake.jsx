import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Phase2SimonLake({ onComplete }) {
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showFinalImage, setShowFinalImage] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleChoice = (choice) => {
    setSelected(choice)
    setShowModal(true)

    if (choice === 'leaf') {
      // Respuesta correcta: mostrar modal con caracol cruzando
      setTimeout(() => {
        setShowModal(false)
        // Mostrar imagen grande del caracol feliz
        setShowFinalImage(true)
        setTimeout(() => {
          setShowFinalImage(false)
          setCompleted(true)
          setTimeout(() => onComplete(1), 3000)
        }, 3000)
      }, 2500)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelected(null)
  }

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      
      {/* Fondo del lago */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom md:bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/simon-lake-bg.jpeg')" }}
      />

      {/* Header flotante */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-20 left-4 z-20"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
          <p className="text-amber-800 font-bold text-sm">
             Ayuda a Simón a cruzar el lago
          </p>
        </div>
      </motion.div>

      {/* Objetos en la base (piedra y hoja) */}
      <div className="absolute bottom-20 left-0 right-0 z-10 flex justify-center gap-8 md:gap-16 px-4">
        
        {/* Piedra (incorrecta) */}
        <motion.button
          onClick={() => handleChoice('rock')}
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center cursor-pointer"
        >
          <span className="text-7xl md:text-8xl drop-shadow-2xl">🪨</span>
          <span className="text-white font-bold text-sm mt-2 bg-black/50 px-3 py-1 rounded-full">
            Piedra
          </span>
        </motion.button>

        {/* Hoja (correcta) */}
        <motion.button
          onClick={() => handleChoice('leaf')}
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center cursor-pointer"
        >
          <span className="text-7xl md:text-8xl drop-shadow-2xl">🍃</span>
          <span className="text-white font-bold text-sm mt-2 bg-black/50 px-3 py-1 rounded-full">
            Hoja
          </span>
        </motion.button>
      </div>

      {/* Instrucciones */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
          <p className="text-amber-900 font-bold text-sm">
            ¿Qué usará Simón para cruzar?
          </p>
        </div>
      </div>

      {/* Modal de respuesta */}
      <AnimatePresence>
        {showModal && selected && (
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
                selected === 'leaf'
                  ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500'
              }`}
            >
              {/* Imagen del resultado */}
              <motion.img
                src={selected === 'leaf' ? '/simon-crossing.jpeg' : '/simon-sinking.jpeg'}
                alt={selected === 'leaf' ? 'Simón cruzando' : 'Simón hundiéndose'}
                className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto mb-4 rounded-full border-4 border-white/70 bg-white/20 backdrop-blur-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              />

              {/* Mensaje */}
              {selected === 'leaf' ? (
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    ¡Excelente elección! 🎉
                  </h3>
                  <p className="text-white/95 text-lg drop-shadow">
                    La hoja flota y Simón puede cruzar el lago
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-white text-lg font-bold mb-4 drop-shadow-lg px-2">
                    ¡Oh no! La piedra se hunde. Simón necesita algo que flote. 🌊
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

      {/* Imagen final grande (caracol feliz después de cruzar) */}
      <AnimatePresence>
        {showFinalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4"
          >
            <motion.img
              src="/simon-happy.jpeg"
              alt="Simón feliz después de cruzar"
              className="max-w-[80vw] max-h-[70vh] object-contain drop-shadow-2xl"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">⭐</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¡Simón cruzó el lago!
              </h3>
              <p className="text-white text-lg mb-4">
                Con paciencia y sabiduría, Simón encontró la mejor forma de cruzar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}