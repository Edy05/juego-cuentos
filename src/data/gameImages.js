// src/data/gameImages.js

// 1. Imágenes que se cargan al iniciar la app (Pantalla de inicio + Todos los avatares)
export const globalImages = [
  '/inicio.jpeg', // Fondo de la pantalla de bienvenida
  
  // Los 15 avatares de los personajes del libro
  '/lina-avatar.jpeg',
  '/belina-avatar.jpeg',
  '/clarita-avatar.jpeg',
  '/rolo-avatar.jpeg',
  '/oscar-avatar.jpeg',
  '/thomas-avatar.jpeg',
  '/solea-avatar.jpeg',
  '/la-semilla-avatar.jpeg',
  '/cornelio-avatar.jpeg',
  '/paquita-avatar.jpeg',
  '/rojita-avatar.jpeg',
  '/rojolet-avatar.jpeg',
  '/ramon-avatar.jpeg',
  '/simon-avatar.jpeg',
  '/crispin-avatar.jpeg',
]

// 2. Mapa de imágenes que necesita cada nivel (Fase 1 + Fase 2)
export const levelImages = {
  1: [
    // Nivel 1: Lina (Detective)
    '/level1-phase1-bg.jpeg',
    '/lina-detective.jpeg',
    '/lina-success.jpeg',
  ],
  2: [
    // Nivel 2: Belina (Arma el cuerpo)
    '/level2-phase1-bg.jpeg',
    '/belina-body.jpeg',
  ],
  3: [
    // Nivel 3: Clarita (Fase 1: 3 caminos + Fase 2: Animales)
    '/level3-phase1-new-bg.jpeg',
    '/clarita-panal.jpeg',
    '/clarita-lago.jpeg',
    '/clarita-avatar.jpeg', // Usada también como destino en Fase 1
    '/level3-phase1-bg.jpeg',
    '/abeja-home.jpeg',
    '/ardilla-home.jpeg',
    '/mariquita-home.jpeg',
  ],
  4: [
    // Nivel 4: Rojita (Juego de Memoria)
    '/level4-phases-bg.jpeg',
    '/memory1.jpeg',
    '/memory2.jpeg',
    '/memory3.jpeg',
    '/memory4.jpeg',
    '/memory5.jpeg',
    '/memory6.jpeg',
    '/memory7.jpeg',
  ],
  5: [
    // Nivel 5: Simón (Fase 1: Diferencias + Fase 2: Lago)
    '/simon-differences.jpeg',
    '/simon-lake-bg.jpeg',
    '/simon-sinking.jpeg',
    '/simon-crossing.jpeg',
    '/simon-happy.jpeg',
  ],
}

// Imágenes por defecto (si por alguna razón se pide un nivel no mapeado)
export const defaultImages = []