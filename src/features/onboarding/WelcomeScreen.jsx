import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AliasInput from './AliasInput'

// Partículas generadas fuera del componente para mantener pureza (evita error de ESLint)
const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
  size: Math.random() * 2 + 1,
}))

export default function WelcomeScreen({ onComplete }) {
  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInput(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const handleAliasSubmit = (validAlias) => {
    onComplete({ alias: validAlias })
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      
      {/* IMAGEN DE FONDO - inicio.jpeg */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/inicio.jpeg')" }}
      />
      
      {/* Capa oscura suave para que el texto sea legible sobre la imagen */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Partículas mágicas (destellos dorados flotando) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-yellow-300"
            style={{
              width: `${particle.size * 4}px`,
              height: `${particle.size * 4}px`,
            }}
            initial={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: 0,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Título principal con sombra para resaltar sobre la imagen */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-2"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
            style={{
              textShadow: '3px 3px 0 #16a34a, -1px -1px 0 #16a34a, 1px -1px 0 #16a34a, -1px 1px 0 #16a34a, 1px 1px 0 #16a34a'
            }}
          >
            ¡Bienvenido a mi
          </motion.h1>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
            style={{
              color: '#fde047',
              textShadow: '3px 3px 0 #15803d, -1px -1px 0 #15803d, 1px -1px 0 #15803d, -1px 1px 0 #15803d, 1px 1px 0 #15803d'
            }}
          >
            jardín mágico!
          </motion.h1>
        </motion.div>

        {/* Icono decorativo del jardín */}
        <motion.div
          className="text-8xl mb-8"
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 2, duration: 1, type: 'spring' }}
        >
          ✨🦋
        </motion.div>

        {/* Campo de texto con animación */}
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