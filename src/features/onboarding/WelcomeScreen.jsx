import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AliasInput from './AliasInput'

// SOLUCIÓN: Generamos las partículas FUERA del componente.
// Math.random() se ejecuta una sola vez al cargar el módulo, 
// manteniendo el componente 100% puro para el linter de React.
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 2,
}))

export default function WelcomeScreen({ onComplete }) {
  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInput(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleAliasSubmit = (validAlias) => {
    onComplete({ alias: validAlias })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* Partículas decorativas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            initial={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
          >
            ¡Bienvenido al mundo
          </motion.h1>
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-yellow-300 mb-8 drop-shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
          >
            de los cuentos!
          </motion.h1>
        </motion.div>

        <motion.div
          className="text-8xl mb-8"
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 2, duration: 1, type: 'spring' }}
        >
          📚✨
        </motion.div>

        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <AliasInput onSubmit={handleAliasSubmit} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}