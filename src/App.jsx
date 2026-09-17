import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WelcomeScreen from './features/onboarding/WelcomeScreen'
import AvatarSelection from './features/onboarding/AvatarSelection'
import ConfirmationScreen from './features/onboarding/ConfirmationScreen'
import LevelSelector from './features/gameLoop/LevelSelector'
import GameLoop from './features/gameLoop/GameLoop'
import { useGameProgress } from './hooks/useGameProgress'
import localforage from 'localforage'

// ✅ IMPORTS PARA EL SISTEMA DE AUDIO
import { AudioProvider } from './context/AudioContext'
import MuteButton from './components/MuteButton'

// ✅ NUEVO IMPORT: Cargador Global de la App
import GlobalAppLoader from './components/GlobalAppLoader'

function App() {
  const [step, setStep] = useState('welcome')
  const [userData, setUserData] = useState({ alias: '', character: null })
  const [selectedLevel, setSelectedLevel] = useState(null)
  const { progress, isLoading, completeLevel } = useGameProgress()

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
    // ✅ 1. PROVEEDOR DE AUDIO (primero, para que todo tenga acceso al sonido)
    <AudioProvider>
      
      {/* ✅ 2. CARGADOR GLOBAL (precarga imágenes antes de mostrar la app) */}
      <GlobalAppLoader>
        
        <div className="font-sans antialiased text-gray-900 relative min-h-screen">
          
          {/* ✅ 3. BOTÓN DE MUTE (aparece solo cuando la app ya cargó) */}
          <MuteButton />

          {/* Renderizado condicional de las pantallas */}
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
    </AudioProvider>
  )
}

export default App