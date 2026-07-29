// src/data/levels.js
import { characters } from './characters'

// Cada nivel se basa en un personaje del libro
export const levels = characters.map((char, index) => ({
  id: index + 1,
  characterId: char.id,
  characterName: char.name,
  storyTitle: char.story,
  emoji: char.emoji,
  color: char.color,
  
  // FASE 2: Pregunta específica del cuento (placeholder por ahora)
  phase2Question: `¿Qué aprendiste en "${char.story}"?`,
  phase2Options: [
    `Una lección sobre ${char.story.split(' ').slice(-1)[0]}`,
    'Opción genérica 2',
    'Opción genérica 3',
    'Opción genérica 4'
  ],
  phase2CorrectAnswer: 0, // Índice de la respuesta correcta
  
  // FASE 3: Objeto escondido (placeholder)
  phase3HiddenObject: '⭐',
  phase3Hint: 'Busca la estrella escondida en la escena'
}))