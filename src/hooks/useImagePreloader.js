import { useState, useEffect } from 'react'

export default function useImagePreloader(imageUrls) {
  // ✅ Inicializamos el estado directamente para evitar el warning de setState en useEffect
  const isEmpty = !imageUrls || imageUrls.length === 0
  const [isLoaded, setIsLoaded] = useState(isEmpty)
  const [progress, setProgress] = useState(isEmpty ? 100 : 0)

  useEffect(() => {
    if (isEmpty) return

    let loadedCount = 0
    const total = imageUrls.length

    const preloadImage = (url) => {
      return new Promise((resolve) => { // ✅ Eliminamos 'reject' ya que no se usaba
        const img = new Image()
        img.onload = () => {
          loadedCount++
          setProgress(Math.round((loadedCount / total) * 100))
          resolve()
        }
        img.onerror = () => {
          loadedCount++
          setProgress(Math.round((loadedCount / total) * 100))
          resolve() // Resolvemos igual para no bloquear el juego si una imagen falla
        }
        img.src = url
      })
    }

    Promise.all(imageUrls.map(preloadImage)).then(() => {
      setIsLoaded(true)
    })
  }, [imageUrls, isEmpty])

  return { isLoaded, progress }
}