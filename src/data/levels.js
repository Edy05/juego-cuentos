// src/data/levels.js
// (Ya no necesitamos importar characters porque ahora definimos los niveles manualmente)

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
      {
        id: 1,
        emoji: '🤝🌸',
        label: 'Ayudar a mis amigos a limpiar',
        isCorrect: true
      },
      {
        id: 2,
        emoji: '🙅‍♀️🍕',
        label: 'Tirar basura al suelo',
        isCorrect: false,
        feedback: '¡Ups! Lina nunca ensuciaría el jardín. ¡Intenta de nuevo!'
      },
      {
        id: 3,
        emoji: '💃🌪️',
        label: 'Bailar y no hacer caso',
        isCorrect: false,
        feedback: '¡Oh no! El jardín necesita nuestra ayuda, no es momento de bailar.'
      }
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
      {
        id: 1,
        emoji: '🌱✨',
        label: 'Intentarlo con esperanza',
        isCorrect: true
      },
      {
        id: 2,
        emoji: '😢🚫',
        label: 'Rendirme y no intentar',
        isCorrect: false,
        feedback: '¡Oh no! Thomas no se rindió, ¡él lo intentó!'
      },
      {
        id: 3,
        emoji: '😤',
        label: 'Enojarme y esconderme',
        isCorrect: false,
        feedback: '¡Ups! Esconderse no ayuda. Thomas fue valiente.'
      }
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
    {
      id: 1,
      emoji: '🔍✨',
      label: 'Explorar y descubrir',
      isCorrect: true
    },
    {
      id: 2,
      emoji: '😤',
      label: 'Enojarme y no ayudar',
      isCorrect: false,
      feedback: '¡Oh no! Clarita siempre quiso ayudar a sus amigas.'
    },
    {
      id: 3,
      emoji: '‍♀️',
      label: 'Huir y esconderme',
      isCorrect: false,
      feedback: '¡Ups! Clarita se quedó para ayudar, no huyó.'
    }
  ],
  phase2CorrectAnswer: 0,
  phase3HiddenObject: '🌸',
  phase3Hint: 'Busca la flor escondida en el jardín'
}



]