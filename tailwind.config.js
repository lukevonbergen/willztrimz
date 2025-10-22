/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tactical-bg-primary': 'var(--tactical-bg-primary)',
        'tactical-bg-secondary': 'var(--tactical-bg-secondary)',
        'tactical-bg-tertiary': 'var(--tactical-bg-tertiary)',
        'tactical-accent-primary': 'var(--tactical-accent-primary)',
        'tactical-accent-secondary': 'var(--tactical-accent-secondary)',
        'tactical-success': 'var(--tactical-success)',
        'tactical-warning': 'var(--tactical-warning)',
        'tactical-danger': 'var(--tactical-danger)',
        'tactical-text-primary': 'var(--tactical-text-primary)',
        'tactical-text-secondary': 'var(--tactical-text-secondary)',
        'tactical-border': 'var(--tactical-border)',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
