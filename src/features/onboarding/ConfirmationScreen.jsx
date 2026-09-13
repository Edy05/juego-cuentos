import { motion } from 'framer-motion'

export default function ConfirmationScreen({ userData, onStartGame }) {
  return (
    // ✅ CAMBIO: Mismo degradado morado/rosa/naranja que el modal de confirmación de avatar
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 relative overflow-hidden">
      
      {/* Partículas de fondo sutiles (opcional, para darle más vida) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Tarjeta de confirmación con efecto cristal (Glassmorphism) */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 max-w-md w-full text-center border border-white/20 shadow-2xl"
      >
        {/* Emoji del personaje seleccionado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.8 }}
          className="text-7xl mb-4 drop-shadow-2xl"
        >
          {userData.character?.emoji || ''}
        </motion.div>

        {/* Saludo al niño */}
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
        >
          ¡Hola, <span className="text-yellow-300">{userData.alias}</span>!
        </motion.h2>
        
        {/* Mensaje de aventura */}
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 mb-8 drop-shadow"
        >
          Estás listo para comenzar tu aventura mágica con <br/>
          <span className="font-bold text-white text-2xl mt-2 inline-block">
            {userData.character?.name}
          </span>
        </motion.p>

        {/* Botón para iniciar el juego */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', bounce: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartGame}
          className="w-full py-4 bg-white text-purple-700 rounded-2xl text-2xl font-bold shadow-xl hover:shadow-2xl transition-all border-2 border-white/50"
        >
          ¡Comenzar aventura! 🚀
        </motion.button>
      </motion.div>
    </div>
  )
}