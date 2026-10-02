import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import WelcomeScreen from './features/onboarding/WelcomeScreen'
import AvatarSelection from './features/onboarding/AvatarSelection'
import ConfirmationScreen from './features/onboarding/ConfirmationScreen'
import LevelSelector from './features/gameLoop/LevelSelector'
import GameLoop from './features/gameLoop/GameLoop'
import { useGameProgress } from './hooks/useGameProgress'
import localforage from 'localforage'

import { AudioProvider, useAudio } from './context/AudioContext'
import MuteButton from './components/MuteButton'
import GlobalAppLoader from './components/GlobalAppLoader'

// ✅ 1. COMPONENTE INTERNO: Aquí SÍ podemos usar useAudio porque estará DENTRO del proveedor
function AppContent() {
  const [step, setStep] = useState('welcome')
  const [userData, setUserData] = useState({ alias: '', character: null })
  const [selectedLevel, setSelectedLevel] = useState(null)
  const { progress, isLoading, completeLevel } = useGameProgress()

  // ✅ Ahora useAudio() funciona perfectamente
  const { playBGM } = useAudio()
  const hasPlayed = useRef(false)

  // ✅ Efecto mágico: detecta el PRIMER clic o toque en toda la página
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasPlayed.current) {
        playBGM() // ¡Enciende la música!
        hasPlayed.current = true // Marca como reproducido para no repetirlo
        
        // Eliminamos los escuchas para no afectar el rendimiento
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('touchstart', handleFirstInteraction)
      }
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [playBGM])

  useEffect(() => {
    const checkExistingUser = async () => {
      const profile = await localforage.getItem('userProfile')
      if (profile) {
        setUserData({
          alias: profile.alias,
          character: { id: profile.characterId, name: profile.characterName, emoji: '🦁', color: 'from-yellow-400 to-orange-500' }
        })
        setStep('levelSelector')
      }
    }
    checkExistingUser()
  }, [])

  const handleAliasComplete = (data) => {
    setUserData(prev => ({ ...prev, alias: data.alias }))
    setStep('avatar')
  }

  const handleAvatarSelect = (character) => {
    setUserData(prev => ({ ...prev, character }))
    setStep('confirmation')
  }

  const handleStartGame = () => {
    setStep('levelSelector')
  }

  const handleSelectLevel = (level) => {
    setSelectedLevel(level)
    setStep('game')
  }

  const handleLevelComplete = async (starsEarned) => {
    await completeLevel(selectedLevel.id, starsEarned)
    setSelectedLevel(null)
    setStep('levelSelector')
  }

  const handleExitLevel = () => {
    setSelectedLevel(null)
    setStep('levelSelector')
  }

  const handleExitToWelcome = async () => {
    await localforage.clear()
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-900 flex items-center justify-center text-white text-2xl">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          ⚙️
        </motion.div>
        <span className="ml-4">Cargando tu aventura...</span>
      </div>
    )
  }

  return (
    <GlobalAppLoader>
      <div className="font-sans antialiased text-gray-900 relative min-h-screen">
        <MuteButton />

        {step === 'welcome' && <WelcomeScreen onComplete={handleAliasComplete} />}
        
        {step === 'avatar' && (
          <AvatarSelection alias={userData.alias} onSelect={handleAvatarSelect} />
        )}

        {step === 'confirmation' && (
          <ConfirmationScreen userData={userData} onStartGame={handleStartGame} />
        )}

        {step === 'levelSelector' && (
          <LevelSelector 
            progress={progress}
            onSelectLevel={handleSelectLevel}
            onExit={handleExitToWelcome}
          />
        )}

        {step === 'game' && selectedLevel && (
          <GameLoop 
            level={selectedLevel}
            onComplete={handleLevelComplete}
            onExit={handleExitLevel}
          />
        )}
      </div>
    </GlobalAppLoader>
  )
}

// ✅ 2. COMPONENTE PRINCIPAL: Solo se encarga de proveer el contexto a todo lo de abajo
function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  )
}

export default App