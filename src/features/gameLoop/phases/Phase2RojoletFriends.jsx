import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../../context/AudioContext' // Ajusta la ruta si es necesario

// ✅ AMIGOS ESCONDIDOS (Emojis verificados y coordenadas seguras)
const HIDDEN_FRIENDS = [
  { id: 'thomas', emoji: '🐛', x: 22, y: 75, label: 'Thomas el gusanito' },
  { id: 'rojita', emoji: '🐿️', x: 78, y: 35, label: 'Rojita la ardilla' }, // ✅ Ardilla restaurada
  { id: 'clarita', emoji: '🐜', x: 38, y: 70, label: 'Clarita la hormiga' }, // ✅ Hormiga restaurada y subida para que no la tape el contador
  { id: 'simon', emoji: '🐌', x: 65, y: 62, label: 'Simón el caracol' }
]

export default function Phase2RojoletFriends({ onComplete }) {
  const { playSFX, playInstruction, stopInstruction } = useAudio()
  
  const [found, setFound] = useState([])
  const [completed, setCompleted] = useState(false)

  // ✅ Reproducir instrucción de voz a los 3 segundos de abrir la fase
  const hasPlayedRef = useRef(false) // <-- Agrega esta línea antes del useEffect

  useEffect(() => {
    if (hasPlayedRef.current) return // ✅ Evita que se repita si el componente se re-renderiza

    const timer = setTimeout(() => {
      hasPlayedRef.current = true
      playInstruction('level6-fase2-audio.mp3') // Cambia el nombre del archivo según el nivel
    }, 3000)
    
    return () => {
      clearTimeout(timer)
      stopInstruction() // ✅ Detiene la voz si el niño cambia de nivel o completa la fase
    }
  }, [playInstruction, stopInstruction])

  const handleFriendClick = (friend) => {
    if (found.includes(friend.id)) return
    
    // ✅ Sonido de interacción y acierto al encontrar un amigo
    playSFX('click')
    stopInstruction()
    playSFX('correct')
    
    const newFound = [...found, friend.id]
    setFound(newFound)

    if (newFound.length === HIDDEN_FRIENDS.length) {
      setTimeout(() => {
        // ✅ Sonido de victoria al completar el nivel
        playSFX('victory')
        setCompleted(true)
        setTimeout(() => onComplete(1), 3000)
      }, 1000)
    }
  }

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      
      {/* Fondo del bosque */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/rojolet-bosque-bg.jpeg')" }}
      />

      {/* Header flotante */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-20 left-4 z-20"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
          <p className="text-red-800 font-bold text-sm">
             Encuentra a los amigos de Rojolet
          </p>
        </div>
      </motion.div>

      {/* Contenedor de los personajes escondidos */}
      <div className="absolute inset-0 z-10">
        {HIDDEN_FRIENDS.map((friend) => {
          const isFound = found.includes(friend.id)
          
          return (
            <motion.button
              key={friend.id}
              onClick={() => handleFriendClick(friend)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute flex items-center justify-center cursor-pointer ${
                isFound ? 'pointer-events-none' : ''
              }`}
              style={{
                left: `${friend.x}%`,
                top: `${friend.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              whileHover={!isFound ? { scale: 1.2 } : {}}
              whileTap={!isFound ? { scale: 0.9 } : {}}
            >
              {/* Efecto camuflaje */}
              <span className={`text-4xl md:text-5xl drop-shadow-lg transition-all duration-500 ${
                isFound ? 'opacity-100 scale-110' : 'opacity-75 scale-90 blur-[0.5px]'
              }`}>
                {friend.emoji}
              </span>

              {/* Círculo verde cuando se encuentra */}
              {isFound && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute w-14 h-14 md:w-16 md:h-16 border-4 border-green-500 rounded-full bg-green-500/10"
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Contador flotante abajo */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-red-200">
          <p className="text-red-900 font-bold text-sm">
            🐦 Amigos encontrados: {found.length} / {HIDDEN_FRIENDS.length}
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
              className="bg-linear-to-br from-red-400 via-orange-500 to-yellow-500 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full border-4 border-yellow-300"
            >
              <div className="text-7xl mb-3">🐦</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                ¡Encontraste a todos!
              </h3>
              <p className="text-white text-lg mb-4 drop-shadow">
                Rojolet ya no está solo, tiene grandes amigos
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}