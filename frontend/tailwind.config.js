/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // Activa el modo oscuro basado en las preferencias del sistema
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px', // Extra small devices
      },
    },
  },
  plugins: [],
}
