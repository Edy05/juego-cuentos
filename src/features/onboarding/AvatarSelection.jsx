import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { characters } from '../../data/characters'

export default function AvatarSelection({ alias, onSelect }) {
  const [selectedId, setSelectedId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleCharacterClick = (charId) => {
    setSelectedId(charId)
    setShowModal(true)
  }

  const handleConfirm = () => {
    const chosenCharacter = characters.find(c => c.id === selectedId)
    setShowModal(false)
    onSelect(chosenCharacter)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedId(null)
  }

  const selectedCharacter = characters.find(c => c.id === selectedId)

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8 flex flex-col items-center relative">
      
      {/* Encabezado */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
          ¡Hola, <span className="text-yellow-300">{alias}</span>!
        </h2>
        <p className="text-xl text-purple-200 drop-shadow">
          Toca un personaje para elegirlo
        </p>
      </motion.div>

      {/* Grid de Personajes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
        {characters.map((char, index) => {
          const isSelected = selectedId === char.id
          
          return (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCharacterClick(char.id)}
              className={`
                relative cursor-pointer rounded-2xl overflow-hidden aspect-square
                border-4 transition-all duration-300 shadow-xl
                ${isSelected 
                  ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8)] ring-4 ring-yellow-400/50' 
                  : 'border-white/20 hover:border-white/60'}
              `}
            >
              {/* ✅ IMAGEN DE FONDO COMPLETA */}
              <img 
                src={char.avatar} 
                alt={char.name} 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              
              {/* Fallback por si la imagen no carga */}
              <div 
                className="hidden absolute inset-0 items-center justify-center bg-linear-to-br"
                style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
              >
                <span className="text-6xl">{char.emoji}</span>
              </div>

              {/* Degradado oscuro en la parte inferior para que el texto se lea bien */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              {/* Nombre y Cuento superpuestos */}
              <div className="absolute inset-x-0 bottom-0 p-3 text-center z-10">
                <h3 className="text-white font-bold text-base md:text-lg leading-tight drop-shadow-lg">
                  {char.name}
                </h3>
                <p className="text-white/80 text-[10px] md:text-xs mt-1 italic drop-shadow line-clamp-2">
                  "{char.story}"
                </p>
              </div>

              {/* Indicador de selección */}
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl shadow-lg border-2 border-white z-20"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Modal de Confirmación */}
      <AnimatePresence>
        {showModal && selectedCharacter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-linear-to-br from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Botón de cerrar */}
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors z-20"
              >
                ✕
              </button>

              {/* Contenido del modal */}
              <div className="text-center relative z-10">
                {/* ✅ PERSONAJE GRANDE - Imagen completa */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.8 }}
                  className="w-full h-56 md:h-64 mb-4 rounded-2xl overflow-hidden border-4 border-white/50 shadow-2xl mx-auto relative"
                >
                  <img 
                    src={selectedCharacter.avatar} 
                    alt={selectedCharacter.name} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Pregunta */}
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg"
                >
                  ¿Este es tu personaje?
                </motion.h3>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-white/90 mb-6 drop-shadow"
                >
                  {selectedCharacter.name}
                </motion.p>

                {/* Botones de acción */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-3"
                >
                  {/* Botón Confirmar */}
                  <motion.button
                    onClick={handleConfirm}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-white text-purple-700 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all"
                  >
                    ¡Sí, es él! 🎉
                  </motion.button>

                  {/* Botón Cambiar */}
                  <motion.button
                    onClick={handleCloseModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-white/20 text-white rounded-2xl text-lg font-bold border-2 border-white/50 hover:bg-white/30 transition-all"
                  >
                    Quiero elegir otro 🔄
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}