import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Configuración de los caminos (SVG paths)
const PATHS = [
  {
    id: 'correct',
    d: 'M 80 120 Q 150 120 200 180 T 320 250 T 450 300 T 580 350',
    color: '#16a34a', // Verde (correcto)
    isCorrect: true,
    label: 'Camino a casa'
  },
  {
    id: 'wrong1',
    d: 'M 80 150 Q 120 200 180 220 T 300 200 T 420 250 T 550 200',
    color: '#dc2626', // Rojo (incorrecto)
    isCorrect: false,
    label: 'Camino sin salida'
  },
  {
    id: 'wrong2',
    d: 'M 80 180 Q 140 250 220 280 T 350 320 T 480 380 T 600 420',
    color: '#2563eb', // Azul (incorrecto)
    isCorrect: false,
    label: 'Camino largo'
  },
  {
    id: 'wrong3',
    d: 'M 80 210 Q 100 280 150 320 T 280 380 T 400 420 T 520 480',
    color: '#9333ea', // Morado (incorrecto)
    isCorrect: false,
    label: 'Camino perdido'
  }
]

export default function Phase1PathFinder({ onComplete }) {
  const [feedback, setFeedback] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [currentPath, setCurrentPath] = useState(null)
  const [pathProgress, setPathProgress] = useState(0)
  const svgRef = useRef(null)
  const pathRefs = useRef({})
  const isDragging = useRef(false)

  // Prevenir scroll del navegador cuando se toca el SVG
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const preventScroll = (e) => {
      if (isDragging.current) {
        e.preventDefault()
      }
    }

    svg.addEventListener('touchmove', preventScroll, { passive: false })
    return () => svg.removeEventListener('touchmove', preventScroll)
  }, [])

  const findClosestPath = (x, y) => {
    let closestPath = null
    let minDistance = 50 // Tolerancia de 50px para niños

    for (const path of PATHS) {
      const pathElement = pathRefs.current[path.id]
      if (!pathElement) continue

      const length = pathElement.getTotalLength()
      
      for (let i = 0; i < length; i += 10) {
        const point = pathElement.getPointAtLength(i)
        const distance = Math.sqrt(
          Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
        )
        
        if (distance < minDistance) {
          minDistance = distance
          closestPath = path
        }
      }
    }

    return closestPath
  }

  const getSVGPoint = (e) => {
    const svg = svgRef.current
    if (!svg) return null

    const rect = svg.getBoundingClientRect()
    const point = svg.createSVGPoint()
    
    // Usar clientX/clientY directamente (funciona con mouse y touch)
    point.x = e.clientX - rect.left
    point.y = e.clientY - rect.top

    return point
  }

  const handlePointerDown = (e) => {
    if (completed) return
    
    const point = getSVGPoint(e)
    if (!point) return

    const closestPath = findClosestPath(point.x, point.y)
    
    if (closestPath) {
      isDragging.current = true
      setCurrentPath(closestPath)
      setPathProgress(0)
      
      // Capturar el puntero para seguir recibiendo eventos
      e.target.setPointerCapture?.(e.pointerId)
    }
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current || !currentPath || completed) return

    const point = getSVGPoint(e)
    if (!point) return

    const pathElement = pathRefs.current[currentPath.id]
    if (!pathElement) return

    const length = pathElement.getTotalLength()
    let closestPoint = null
    let minDistance = 60 // Tolerancia más grande mientras arrastra

    for (let i = 0; i < length; i += 5) {
      const pathPoint = pathElement.getPointAtLength(i)
      const distance = Math.sqrt(
        Math.pow(point.x - pathPoint.x, 2) + Math.pow(point.y - pathPoint.y, 2)
      )
      
      if (distance < minDistance) {
        minDistance = distance
        closestPoint = i
      }
    }

    if (closestPoint !== null) {
      const progress = (closestPoint / length) * 100
      setPathProgress(progress)

      // Si llegó al final (85% o más)
      if (progress >= 85) {
        isDragging.current = false
        
        if (currentPath.isCorrect) {
          setFeedback({ type: 'success', message: '¡Excelente! Encontraste el camino a casa. ' })
          setCompleted(true)
          setTimeout(() => onComplete(1), 2000)
        } else {
          setFeedback({ type: 'error', message: '¡Ese no es el camino! Intenta con otro. 🤔' })
          setCurrentPath(null)
          setPathProgress(0)
          setTimeout(() => setFeedback(null), 2000)
        }
      }
    }
  }

  const handlePointerUp = () => {
    if (!completed && isDragging.current && currentPath && pathProgress < 85) {
      isDragging.current = false
      setCurrentPath(null)
      setPathProgress(0)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-amber-100 via-orange-100 to-yellow-100 p-4 flex flex-col">
      
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-4 flex-shrink-0"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-amber-800 mb-2">
          🐜 ¡Ayuda a Clarita!
        </h2>
        <p className="text-sm md:text-base text-amber-700">
          Toca un camino y arrastra el dedo hasta la colmena
        </p>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`
              fixed top-24 left-1/2 -translate-x-1/2 z-50 
              px-6 py-4 rounded-3xl text-lg font-bold shadow-2xl text-center
              ${feedback.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-orange-500 text-white'}
            `}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Victoria */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="bg-linear-to-br from-green-400 to-emerald-600 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-7xl mb-3">🏡✨</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¡Clarita llegó a casa!
              </h3>
              <p className="text-white text-lg mb-4">
                Has ganado tu primera estrella
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ÁREA DEL JUEGO - SVG con los caminos */}
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="bg-white/90 rounded-3xl p-4 shadow-2xl border-4 border-amber-300 w-full max-w-2xl">
          <svg
            ref={svgRef}
            viewBox="0 0 660 520"
            className="w-full h-auto"
            style={{ 
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Fondo decorativo */}
            <rect width="660" height="520" fill="#fef3c7" rx="20" />
            
            {/* Clarita (inicio) */}
            <g transform="translate(50, 100)">
              <circle cx="30" cy="20" r="25" fill="#dc2626" />
              <circle cx="22" cy="15" r="5" fill="white" />
              <circle cx="38" cy="15" r="5" fill="white" />
              <circle cx="22" cy="15" r="2" fill="black" />
              <circle cx="38" cy="15" r="2" fill="black" />
              <path d="M 25 25 Q 30 28 35 25" stroke="black" strokeWidth="2" fill="none" />
              <line x1="20" y1="5" x2="15" y2="-10" stroke="#dc2626" strokeWidth="3" />
              <line x1="40" y1="5" x2="45" y2="-10" stroke="#dc2626" strokeWidth="3" />
              <circle cx="15" cy="-10" r="3" fill="#dc2626" />
              <circle cx="45" cy="-10" r="3" fill="#dc2626" />
              <text x="30" y="55" textAnchor="middle" fontSize="12" fill="#92400e" fontWeight="bold">Clarita</text>
            </g>

            {/* Colmena/Hogar (destino) */}
            <g transform="translate(580, 330)">
              <polygon points="0,0 30,-40 60,0" fill="#92400e" />
              <rect x="0" y="0" width="60" height="40" fill="#92400e" />
              <circle cx="30" cy="20" r="10" fill="#fbbf24" />
              <text x="30" y="55" textAnchor="middle" fontSize="12" fill="#92400e" fontWeight="bold">Colmena</text>
            </g>

            {/* Caminos */}
            {PATHS.map((path) => {
              const isBeingTraced = currentPath?.id === path.id

              return (
                <g key={path.id}>
                  {/* Camino de fondo (gris) */}
                  <path
                    ref={(el) => (pathRefs.current[path.id] = el)}
                    id={`path-${path.id}`}
                    d={path.d}
                    stroke="#d1d5db"
                    strokeWidth="28"
                    fill="none"
                    strokeLinecap="round"
                  />
                  
                  {/* Camino coloreado (progreso) */}
                  {isBeingTraced && (
                    <path
                      d={path.d}
                      stroke={path.color}
                      strokeWidth="28"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="2000"
                      strokeDashoffset={2000 - (pathProgress / 100) * 2000}
                      className="transition-all duration-75"
                    />
                  )}
                  
                  {/* Camino normal (coloreado pero delgado) */}
                  <path
                    d={path.d}
                    stroke={path.color}
                    strokeWidth={isBeingTraced ? "0" : "12"}
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="flex-shrink-0 mt-4 text-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block shadow-xl">
          <p className="text-amber-800 font-bold text-sm md:text-base">
            🐜 Desde Clarita hasta la colmena → Toca y arrastra
          </p>
        </div>
      </div>
    </div>
  )
}