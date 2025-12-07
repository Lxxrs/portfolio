/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        terminal: {
          black: '#0d1117', 
          dark: '#161b22',
          gray: '#8b949e',
          // --- THEME CONFIGURATION ---
          // OPTION 1: Cyber Green (Default)
          accent: '#00ff41', 
          dim: '#2ea043',

          // OPTION 2: Retro Amber (Uncomment below to switch)
          // accent: '#ffb000',
          // dim: '#b36b00',
        },
        solar: {
          bg: '#fdf6e3',
          text: '#657b83',
        }
      },
    },
  },
  plugins: [],
}
