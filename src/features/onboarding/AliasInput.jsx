import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AliasInput({ onSubmit }) {
  const [alias, setAlias] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validateAlias = (value) => {
    const cleanValue = value.replace(/\s/g, '')
    
    if (cleanValue.length < 3) {
      setErrorMessage('Mínimo 3 caracteres')
      setIsValid(false)
      return false
    }
    
    if (cleanValue.length > 12) {
      setErrorMessage('Máximo 12 caracteres')
      setIsValid(false)
      return false
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]+$/.test(cleanValue)) {
      setErrorMessage('Solo letras y números')
      setIsValid(false)
      return false
    }

    setErrorMessage('')
    setIsValid(true)
    return true
  }

  const handleChange = (e) => {
    const value = e.target.value
    setAlias(value)
    validateAlias(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValid) {
      onSubmit(alias)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      // 🌸 FONDO DE JARDÍN visible al 100%, solo con una capa muy sutil para dar estructura
      className="relative rounded-3xl p-8 shadow-2xl max-w-md mx-auto overflow-hidden border-4 border-white/50"
      style={{
        backgroundImage: "url('/form-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {/* Capa muy sutil solo para dar un poco de contraste, pero dejando ver el jardín */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />

      {/* Contenido del formulario */}
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          ¿Cómo te llamas?
        </h2>
        <p className="text-white mb-6 text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-semibold">
          Elige tu nombre de aventurero (3-12 caracteres)
        </p>

        <div className="relative mb-4">
          <input
            type="text"
            value={alias}
            onChange={handleChange}
            placeholder="Ej: Juanito, María, SuperLeo"
            // 🎨 Input con fondo blanco sólido para máxima claridad
            className={`w-full px-6 py-4 text-xl rounded-2xl border-4 transition-all duration-300 outline-none text-gray-800 placeholder-gray-400 font-semibold ${
              isValid
                ? 'border-green-500 bg-white'
                : alias.length > 0
                ? 'border-red-500 bg-white'
                : 'border-purple-400 bg-white'
            }`}
            maxLength={12}
            autoFocus
          />
          
          {alias.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl"
            >
              {isValid ? '✅' : ''}
            </motion.div>
          )}
        </div>

        {errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-700 text-sm mb-4 text-left font-bold bg-white/90 px-3 py-2 rounded-lg inline-block shadow-md"
          >
            ️ {errorMessage}
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={!isValid}
          whileHover={isValid ? { scale: 1.05 } : {}}
          whileTap={isValid ? { scale: 0.95 } : {}}
          className={`w-full py-4 rounded-2xl text-xl font-bold transition-all duration-300 shadow-lg ${
            isValid
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl cursor-pointer'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          {isValid ? '¡Continuar! 🚀' : 'Completa tu nombre'}
        </motion.button>

        <div className="mt-6 text-center">
          <p className="text-white text-xs mb-2 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Ejemplos:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Juanito', 'María', 'SuperLeo'].map((example) => (
              <motion.button
                key={example}
                type="button"
                onClick={() => {
                  setAlias(example)
                  validateAlias(example)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 bg-white text-purple-700 rounded-full text-sm font-bold hover:bg-purple-50 transition-colors border-2 border-purple-300 shadow-md"
              >
                {example}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.form>
  )
}