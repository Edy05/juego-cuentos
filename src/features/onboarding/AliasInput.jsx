import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AliasInput({ onSubmit }) {
  const [alias, setAlias] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validateAlias = (value) => {
    // Eliminar espacios
    const cleanValue = value.replace(/\s/g, '')
    
    // Validar longitud
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

    // Validar que solo contenga letras y números
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
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md mx-auto"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-2">
        ¿Cómo te llamas?
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Elige tu nombre de aventurero (3-12 caracteres)
      </p>

      <div className="relative mb-4">
        <input
          type="text"
          value={alias}
          onChange={handleChange}
          placeholder="Ej: Juanito, María, SuperLeo"
          className={`w-full px-6 py-4 text-xl rounded-2xl border-4 transition-all duration-300 outline-none ${
            isValid
              ? 'border-green-400 bg-green-50'
              : alias.length > 0
              ? 'border-red-400 bg-red-50'
              : 'border-purple-300 bg-purple-50'
          }`}
          maxLength={12}
          autoFocus
        />
        
        {/* Icono de validación */}
        {alias.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl"
          >
            {isValid ? '✅' : '❌'}
          </motion.div>
        )}
      </div>

      {/* Mensaje de error */}
      {errorMessage && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mb-4 text-left"
        >
          ⚠️ {errorMessage}
        </motion.p>
      )}

      {/* Botón de continuar */}
      <motion.button
        type="submit"
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.05 } : {}}
        whileTap={isValid ? { scale: 0.95 } : {}}
        className={`w-full py-4 rounded-2xl text-xl font-bold transition-all duration-300 ${
          isValid
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isValid ? '¡Continuar! 🚀' : 'Completa tu nombre'}
      </motion.button>

      {/* Ejemplos */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-xs mb-2">Ejemplos:</p>
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
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.form>
  )
}