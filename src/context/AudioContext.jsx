/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef, useEffect } from 'react'

const AudioContext = createContext()

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false)
  const bgmRef = useRef(null)
  const sfxRefs = useRef({})
  const instructionRef = useRef(null) // ✅ NUEVO: Referencia para la voz instructiva

  useEffect(() => {
    // Música de fondo
    bgmRef.current = new Audio('/audio/magic-bg.mp3') 
    bgmRef.current.loop = true
    bgmRef.current.volume = 0.4 

    // Efectos de sonido
    const sfxFiles = {
      click: '/audio/sfx/click.wav',
      correct: '/audio/sfx/correct.wav',
      wrong: '/audio/sfx/wrong.wav',
      victory: '/audio/sfx/victory.m4a'
    }

    Object.entries(sfxFiles).forEach(([name, path]) => {
      const audio = new Audio(path)
      audio.volume = 0.6 
      sfxRefs.current[name] = audio
    })

    return () => {
      if (bgmRef.current) bgmRef.current.pause()
    }
  }, [])

  const playSFX = (name) => {
    if (isMuted) return 
    const sound = sfxRefs.current[name]
    if (sound) {
      sound.currentTime = 0 
      sound.play().catch((err) => console.log('SFX play blocked:', err))
    }
  }

  // ✅ MEJORADO: Reproducir instrucción, deteniendo la anterior si existe
  const playInstruction = (filename) => {
    if (isMuted) return
    
    // Detener cualquier instrucción que esté sonando actualmente
    if (instructionRef.current) {
      instructionRef.current.pause()
      instructionRef.current.currentTime = 0
    }

    instructionRef.current = new Audio(`/audio/${filename}`)
    instructionRef.current.volume = 0.8
    instructionRef.current.play().catch((err) => console.log('Instruction play blocked:', err))
  }

  // ✅ NUEVO: Función para detener la voz instructiva manualmente
  const stopInstruction = () => {
    if (instructionRef.current) {
      instructionRef.current.pause()
      instructionRef.current.currentTime = 0
    }
  }

  const playBGM = () => {
    if (!isMuted && bgmRef.current) {
      bgmRef.current.play().catch((err) => console.log('BGM play blocked:', err))
    }
  }

  const pauseBGM = () => {
    if (bgmRef.current) bgmRef.current.pause()
  }

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMute = !prev
      if (newMute) {
        pauseBGM()
      } else {
        playBGM()
      }
      return newMute
    })
  }

  return (
    <AudioContext.Provider value={{ 
      isMuted, 
      toggleMute, 
      playBGM, 
      pauseBGM, 
      playSFX, 
      playInstruction,
      stopInstruction // ✅ Exportamos la nueva función
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return useContext(AudioContext)
}