/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'md3-surface': '#0f131a',
        'md3-surface-low': '#151922',
        'md3-surface-container': '#1b202a',
        'md3-surface-high': '#222733',
        'md3-surface-highest': '#292f3d',
        'md3-primary-container': '#004d36',
        'md3-outline-variant': '#28303d',
      }
    },
  },
  plugins: [],
}
