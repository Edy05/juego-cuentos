// src/hooks/useGameProgress.js
import { useState, useEffect, useCallback } from 'react'
import localforage from 'localforage'

const INITIAL_PROGRESS = {
  levelsCompleted: 0,
  totalStars: 0,
  starsPerLevel: {}, // { 1: 3, 2: 2, ... }
  unlockedStickers: [],
  unlockedMedals: [],
  currentLevel: 1
}

export function useGameProgress() {
  const [progress, setProgress] = useState(INITIAL_PROGRESS)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar progreso al montar
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const saved = await localforage.getItem('gameProgress')
        if (saved) {
          setProgress({ ...INITIAL_PROGRESS, ...saved })
        }
      } catch (error) {
        console.error('Error cargando progreso:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProgress()
  }, [])

  // Guardar progreso en IndexedDB
  const saveProgress = useCallback(async (newProgress) => {
    try {
      await localforage.setItem('gameProgress', newProgress)
      setProgress(newProgress)
    } catch (error) {
      console.error('Error guardando progreso:', error)
    }
  }, [])

  // Completar un nivel con X estrellas
  const completeLevel = useCallback(async (levelId, starsEarned) => {
    const updated = { ...progress }
    
    // Actualizar estrellas del nivel (solo si son más que las anteriores)
    const previousStars = updated.starsPerLevel[levelId] || 0
    if (starsEarned > previousStars) {
      updated.starsPerLevel[levelId] = starsEarned
      updated.totalStars += (starsEarned - previousStars)
    }

    // Marcar nivel como completado
    if (!updated.levelsCompleted) updated.levelsCompleted = 0
    if (!updated.starsPerLevel[levelId] || previousStars === 0) {
      updated.levelsCompleted += 1
    }

    // Avanzar al siguiente nivel
    if (levelId >= updated.currentLevel) {
      updated.currentLevel = levelId + 1
    }

    await saveProgress(updated)
    return updated
  }, [progress, saveProgress])

  return {
    progress,
    isLoading,
    completeLevel,
    saveProgress
  }
}