// src/data/levels.js

export const levels = [
  // Nivel 1: Lina la Mariquita
  {
    id: 1,
    characterId: 1,
    characterName: "Lina la Mariquita",
    storyTitle: "Lina, la mariquita que limpiaba las hojas",
    emoji: "🐞",
    color: "from-red-400 to-rose-600",
    phase2Question: "¿Qué harías tú si fueras Lina?",
    phase2Options: [
      { id: 1, emoji: '🤝🌸', label: 'Ayudar a mis amigos a limpiar', isCorrect: true },
      { id: 2, emoji: '🙅‍♀️🍕', label: 'Tirar basura al suelo', isCorrect: false, feedback: '¡Ups! Lina nunca ensuciaría el jardín. ¡Intenta de nuevo!' },
      { id: 3, emoji: '💃🌪️', label: 'Bailar y no hacer caso', isCorrect: false, feedback: '¡Oh no! El jardín necesita nuestra ayuda, no es momento de bailar.' }
    ],
    phase2CorrectAnswer: 0,
    phase3HiddenObject: '⭐',
    phase3Hint: 'Busca la estrella escondida en la escena'
  },

  // Nivel 2: Thomas el Gusanito
  {
    id: 2,
    characterId: 2,
    characterName: "Thomas el Gusanito",
    storyTitle: "El gusanito que no quería cambiar",
    emoji: "🐛",
    color: "from-green-400 to-emerald-600",
    phase2Question: "¿Qué harías tú si tuvieras miedo de cambiar como Thomas?",
    phase2Options: [
      { id: 1, emoji: '🌱✨', label: 'Intentarlo con esperanza', isCorrect: true },
      { id: 2, emoji: '😢🚫', label: 'Rendirme y no intentar', isCorrect: false, feedback: '¡Oh no! Thomas no se rindió, ¡él lo intentó!' },
      { id: 3, emoji: '😤', label: 'Enojarme y esconderme', isCorrect: false, feedback: '¡Ups! Esconderse no ayuda. Thomas fue valiente.' }
    ],
    phase2CorrectAnswer: 0,
    phase3HiddenObject: '🦋',
    phase3Hint: 'Busca la mariposa escondida en el jardín'
  },

  // Nivel 3: Clarita la Hormiga
  {
    id: 3,
    characterId: 3,
    characterName: "Clarita la Hormiga",
    storyTitle: "La hormiga que no seguía la fila",
    emoji: "🐜",
    color: "from-amber-400 to-orange-600",
    phase2Question: "¿Qué harías tú si fueras Clarita?",
    phase2Options: [
      { id: 1, emoji: '🔍✨', label: 'Explorar y descubrir', isCorrect: true },
      { id: 2, emoji: '😤', label: 'Enojarme y no ayudar', isCorrect: false, feedback: '¡Oh no! Clarita siempre quiso ayudar a sus amigas.' },
      { id: 3, emoji: '🏃‍♀️', label: 'Huir y esconderme', isCorrect: false, feedback: '¡Ups! Clarita se quedó para ayudar, no huyó.' }
    ],
    phase2CorrectAnswer: 0,
    phase3HiddenObject: '🌸',
    phase3Hint: 'Busca la flor escondida en el jardín'
  },

  // Nivel 4: Rojita la ardilla
  {
    id: 4,
    characterId: 4,
    characterName: "Rojita la Ardilla",
    storyTitle: "La ardilla que coleccionaba momentos",
    emoji: "🐿️", // ✅ Emoji corregido
    color: "from-amber-400 to-orange-600",
    phase2Question: "¿Qué harías tú si fueras Rojita?",
    phase2Options: [
      { id: 1, emoji: '✨', label: 'Guardar momentos felices', isCorrect: true },
      { id: 2, emoji: '😤', label: 'Enojarme y no ayudar', isCorrect: false, feedback: '¡Oh no! Rojita siempre quiso compartir alegría con sus amigos.' },
      { id: 3, emoji: '🏃‍♀️', label: 'Huir y esconderme', isCorrect: false, feedback: '¡Ups! Rojita se quedó para ayudar, no huyó.' }
    ],
    phase2CorrectAnswer: 0,
    phase3HiddenObject: '🌰',
    phase3Hint: 'Busca la bellota escondida en el jardín'
  },

  // Nivel 5: Simón el caracol
  {
    id: 5,
    characterId: 5, 
    characterName: "Simón",
    storyTitle: "El caracol que llegó primero",
    emoji: "🐌",
    color: "from-amber-300 to-orange-400",
    phase2Question: "¿Qué harías tú si fueras Simón?",
    phase2Options: [
      { id: 1, emoji: '⏳', label: 'Esperar con paciencia', isCorrect: true },
      { id: 2, emoji: '😤', label: 'Correr muy rápido', isCorrect: false, feedback: '¡Recuerda que Simón ganó por saber esperar!' },
      { id: 3, emoji: '🏳️', label: 'Rendirme y no buscar', isCorrect: false, feedback: '¡Simón nunca se rindió, él tuvo paciencia!' }
    ],
    phase2CorrectAnswer: 0,
    phase3HiddenObject: '🌸',
    phase3Hint: 'Busca la flor azul escondida'
  },

  // Nivel 6: Rojolet el cardenal
  {
    id: 6,
    characterId: 6, 
    characterName: "Rojolet",
    storyTitle: "El cardenal que perdía su color",
    emoji: "🐦", // ✅ Emoji corregido
    color: "from-red-400 to-orange-500",
    phase2Question: "¿Qué aprendió Rojolet sobre la amistad?",
    phase2Options: [
      { id: 1, emoji: '🤝', label: 'Que debe dar el primer paso', isCorrect: true },
      { id: 2, emoji: '⏳', label: 'Que debe esperar a que otros se acerquen', isCorrect: false, feedback: 'Rojolet aprendió que él mismo debe iniciar la amistad' },
      { id: 3, emoji: '🎨', label: 'Que solo necesita verse bonito', isCorrect: false, feedback: 'El color volvió cuando hizo amigos, no al revés' }
    ],
    phase2CorrectAnswer: 0,
    phase3HiddenObject: '',
    phase3Hint: 'Busca el objeto escondido'
  },
  // Nivel 7: Especial - Devuelve a cada animalito a su hábitat
  {
    id: 7,
    characterId: 7,
    characterName: "Nivel Especial",
    storyTitle: "Devuelve a cada animalito a su hábitat",
    emoji: "",
    color: "from-indigo-500 to-purple-600",
    phase2Question: "¿Por qué es importante que cada animal viva en su hábitat natural?",
    phase2Options: [
      {
        id: 1,
        emoji: '🌍',
        label: 'Porque ahí encuentran su comida y hogar',
        isCorrect: true
      },
      {
        id: 2,
        emoji: '',
        label: 'Porque se ven más bonitos ahí',
        isCorrect: false,
        feedback: 'No es solo por verse bonitos, ¡es por sobrevivir!'
      },
      {
        id: 3,
        emoji: '🎮',
        label: 'Porque es un juego',
        isCorrect: false,
        feedback: 'La naturaleza no es un juego, ¡es la casa de los animales!'
      }
    ],
    phase2CorrectAnswer: 0,
    phase3HiddenObject: '',
    phase3Hint: 'Busca el objeto escondido'
  }
]






