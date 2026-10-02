/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef, useEffect } from 'react'

const AudioContext = createContext()

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false)
  const bgmRef = useRef(null)
  const sfxRefs = useRef({})

  useEffect(() => {
    // Música de fondo
    bgmRef.current = new Audio('/audio/magic-bg.mp3') 
    bgmRef.current.loop = true
    bgmRef.current.volume = 0.4 

    // Efectos de sonido con sus extensiones reales
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

  // Nueva función para las instrucciones de voz
  const playInstruction = (filename) => {
    if (isMuted) return
    
    const instructionAudio = new Audio(`/audio/${filename}`)
    instructionAudio.volume = 0.8 // Un poco más alto para que se escuche bien la voz
    instructionAudio.play().catch((err) => console.log('Instruction play blocked:', err))
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
    <AudioContext.Provider value={{ isMuted, toggleMute, playBGM, pauseBGM, playSFX, playInstruction }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return useContext(AudioContext)
}