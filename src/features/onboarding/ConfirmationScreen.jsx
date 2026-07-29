import { useState } from 'react'
import { motion } from 'framer-motion'
import localforage from 'localforage'

export default function ConfirmationScreen({ userData, onStartGame }) {
  const [isSaving, setIsSaving] = useState(false)

  const handleStartGame = async () => {
    setIsSaving(true)
    
    try {
      // 1. Guardamos el perfil del usuario en IndexedDB
      await localforage.setItem('userProfile', {
        alias: userData.alias,
        characterId: userData.character.id,
        characterName: userData.character.name,
        createdAt: new Date().toISOString()
      })

      // 2. Inicializamos el progreso del juego (0 niveles, 0 estrellas)
      await localforage.setItem('gameProgress', {
        levelsCompleted: 0,
        totalStars: 0,
        unlockedStickers: [],
        unlockedMedals: []
      })

      console.log('✅ Datos guardados exitosamente en IndexedDB')
      
      // 3. Pequeña pausa para que la animación de carga se aprecie
      setTimeout(() => {
        onStartGame()
      }, 800)

    } catch (error) {
      console.error('❌ Error al guardar los datos:', error)
      alert('Hubo un problema al guardar tu progreso. Intenta de nuevo.')
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-500 via-emerald-600 to-teal-700 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Círculos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-300/10 rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full text-center relative z-10"
      >
        {/* Icono de celebración */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-7xl mb-6"
        >
          🎉
        </motion.div>

        {/* Mensaje de confirmación */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          ¡Hola, <span className="text-purple-600">{userData.alias}</span>!
        </h2>
        
        <p className="text-xl text-gray-600 mb-8">
          Tu compañero de aventuras será:
        </p>

        {/* Tarjeta del personaje elegido */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`bg-linear-to-br ${userData.character.color} rounded-2xl p-6 mb-8 shadow-lg text-white`}
        >
          <div className="text-6xl mb-3">{userData.character.emoji}</div>
          <h3 className="text-2xl font-bold">{userData.character.name}</h3>
          <p className="text-white/90 italic mt-1">"{userData.character.story}"</p>
        </motion.div>

        {/* Botón de inicio */}
        <motion.button
          onClick={handleStartGame}
          disabled={isSaving}
          whileHover={!isSaving ? { scale: 1.05 } : {}}
          whileTap={!isSaving ? { scale: 0.95 } : {}}
          className={`
            w-full py-4 rounded-2xl text-2xl font-bold shadow-xl transition-all duration-300
            ${isSaving 
              ? 'bg-gray-400 text-gray-200 cursor-wait' 
              : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl cursor-pointer'}
          `}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⚙️
              </motion.span>
              Preparando tu aventura...
            </span>
          ) : (
            '¡A jugar! 🚀'
          )}
        </motion.button>
      </motion.div>
    </div>
  )
}