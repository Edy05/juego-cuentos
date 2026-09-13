/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef, useEffect } from 'react'

const AudioContext = createContext()

export const useAudio = () => useContext(AudioContext)

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false)
  const bgmRef = useRef(null)

  useEffect(() => {
    bgmRef.current = new Audio('/audio/bg-magic.mp3')
    bgmRef.current.loop = true
    bgmRef.current.volume = 0.3
  }, [])

  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.muted = isMuted
    }
  }, [isMuted])

  const toggleMute = () => setIsMuted(prev => !prev)

  const playBGM = () => {
    if (bgmRef.current && !isMuted) {
      bgmRef.current.play().catch(() => {})
    }
  }

  const playSFX = (type) => {
    if (isMuted) return
    
    try {
      const sfx = new Audio(`/audio/sfx-${type}.mp3`)
      sfx.volume = 0.6
      sfx.play().catch(() => {})
    } catch {
      // Silencioso en desarrollo si no existe el archivo
    }
  }

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playBGM, playSFX }}>
      {children}
    </AudioContext.Provider>
  )
}