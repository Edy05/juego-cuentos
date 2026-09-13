import { motion } from 'framer-motion'
import { useAudio } from '../context/AudioContext'

export default function MuteButton() {
  const { isMuted, toggleMute } = useAudio()

  return (
    <motion.button
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 right-4 z-[100] w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 text-2xl cursor-pointer"
      aria-label={isMuted ? "Activar sonido" : "Silenciar"}
    >
      {isMuted ? '🔇' : '🔊'}
    </motion.button>
  )
}