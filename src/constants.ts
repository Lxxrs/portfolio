// Animation and timing constants for consistent UX
export const ANIMATION = {
  // Text animations
  SCRAMBLE_SPEED: 40, // ms per character iteration
  TYPEWRITER_SPEED: 70, // ms per character
  TYPEWRITER_SPEED_FAST: 50, // ms per character (faster variant)
  
  // Delays
  DECRYPT_DELAY: 1000, // ms before decryption starts
  TYPEWRITER_DELAY: 2500, // ms before typing starts
  
  // Transitions
  TRANSITION_FAST: 150, // ms
  TRANSITION_NORMAL: 300, // ms
  TRANSITION_SLOW: 500, // ms
} as const;

// Breakpoints matching Tailwind defaults
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-index layers for consistent stacking
export const Z_INDEX = {
  NEGATIVE: -1,
  BASE: 0,
  NAVBAR: 50,
  MODAL_BACKDROP: 99,
  MODAL: 100,
  TOOLTIP: 200,
  NOTIFICATION: 300,
} as const;

// Accessible focus outline
export const FOCUS_STYLES = {
  OUTLINE: '2px solid var(--accent-color)',
  OUTLINE_OFFSET: '2px',
  BORDER_RADIUS: '2px',
} as const;
