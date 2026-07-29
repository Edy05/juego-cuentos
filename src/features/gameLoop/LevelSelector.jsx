import { motion } from 'framer-motion'
import { levels } from '../../data/levels'

export default function LevelSelector({ progress, onSelectLevel, onExit }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-purple-900 to-pink-900 p-4 md:p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            ← Salir
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              🗺️ Mapa de Aventuras
            </h1>
            <p className="text-purple-200 mt-1">
              Estrellas totales: ⭐ {progress.totalStars} / 45
            </p>
          </div>
          
          <div className="w-20"></div> {/* Spacer para centrar */}
        </div>
      </div>

      {/* Grid de Niveles */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {levels.map((level, index) => {
          const isUnlocked = level.id <= progress.currentLevel
          const isCompleted = progress.starsPerLevel[level.id] > 0
          const starsEarned = progress.starsPerLevel[level.id] || 0
          
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={isUnlocked ? { scale: 1.05 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => isUnlocked && onSelectLevel(level)}
              className={`
                relative rounded-2xl p-4 flex flex-col items-center justify-center text-center
                border-4 transition-all duration-300 min-h-[180px]
                ${isUnlocked 
                  ? isCompleted
                    ? 'border-yellow-400 bg-white/20 cursor-pointer hover:bg-white/30'
                    : 'border-green-400 bg-white/10 cursor-pointer hover:bg-white/20'
                  : 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-50'}
              `}
            >
              {/* Emoji del personaje */}
              <div className={`text-5xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>
                {level.emoji}
              </div>
              
              {/* Nombre del nivel */}
              <h3 className={`font-bold text-sm mb-2 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                Nivel {level.id}
              </h3>
              
              {/* Título del cuento */}
              <p className={`text-xs italic ${isUnlocked ? 'text-purple-200' : 'text-gray-600'}`}>
                {level.storyTitle}
              </p>
              
              {/* Estrellas ganadas */}
              {isCompleted && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map(star => (
                    <span
                      key={star}
                      className={`text-lg ${star <= starsEarned ? '' : 'grayscale opacity-30'}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              )}
              
              {/* Candado si está bloqueado */}
              {!isUnlocked && (
                <div className="absolute top-2 right-2 text-2xl">
                  🔒
                </div>
              )}
              
              {/* Check si está completado */}
              {isCompleted && (
                <div className="absolute top-2 right-2 text-2xl">
                  ✅
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Info de progreso */}
      <div className="max-w-6xl mx-auto mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
        <h3 className="text-white text-xl font-bold mb-2">Tu Progreso</h3>
        <div className="grid grid-cols-3 gap-4 text-white">
          <div>
            <div className="text-3xl font-bold text-yellow-400">{progress.levelsCompleted}</div>
            <div className="text-sm">Niveles Completados</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">{progress.totalStars}</div>
            <div className="text-sm">Estrellas Totales</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">{progress.unlockedStickers.length}</div>
            <div className="text-sm">Stickers</div>
          </div>
        </div>
      </div>
    </div>
  )
}