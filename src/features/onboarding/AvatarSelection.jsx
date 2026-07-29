import { useState } from 'react'
import { motion } from 'framer-motion'
import { characters } from '../../data/characters'

export default function AvatarSelection({ alias, onSelect }) {
  const [selectedId, setSelectedId] = useState(null)

  const handleConfirm = () => {
    if (selectedId) {
      const chosenCharacter = characters.find(c => c.id === selectedId)
      onSelect(chosenCharacter)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8 flex flex-col items-center">
      
      {/* Encabezado */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
          ¡Hola, <span className="text-yellow-300">{alias}</span>!
        </h2>
        <p className="text-xl text-purple-200">
          Elige a tu compañero de aventuras
        </p>
      </motion.div>

      {/* Grid de Personajes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl mb-8">
        {characters.map((char, index) => {
          const isSelected = selectedId === char.id
          
          return (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }} // Efecto cascada al cargar
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedId(char.id)}
              className={`
                relative cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center text-center
                border-4 transition-all duration-300
                ${isSelected 
                  ? 'border-yellow-400 bg-white/20 shadow-[0_0_20px_rgba(250,204,21,0.5)]' 
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30'}
              `}
            >
              {/* Emoji/Imagen del personaje */}
              <div className={`text-6xl mb-3 drop-shadow-lg bg-linear-to-br ${char.color} w-20 h-20 rounded-full flex items-center justify-center`}>
                {char.emoji}
              </div>
              
              {/* Nombre y Cuento */}
              <h3 className="text-white font-bold text-lg leading-tight">{char.name}</h3>
              <p className="text-purple-200 text-xs mt-1 italic">"{char.story}"</p>

              {/* Indicador de selección */}
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl shadow-lg"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Botón de Confirmación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: selectedId ? 1 : 0.5, y: 0 }}
      >
        <button
          onClick={handleConfirm}
          disabled={!selectedId}
          className={`
            px-12 py-4 rounded-full text-2xl font-bold shadow-xl transition-all duration-300
            ${selectedId 
              ? 'bg-linear-to-r from-yellow-400 to-orange-500 text-white hover:scale-105 hover:shadow-2xl cursor-pointer' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
          `}
        >
          {selectedId ? '¡A jugar! 🚀' : 'Selecciona un personaje'}
        </button>
      </motion.div>
    </div>
  )
}