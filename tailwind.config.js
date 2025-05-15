/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#1f618d', // Color primario
          600: '#23495d', // Color primario para hover
        },
        secondary: {
          500: '#168769', // Color de acento
          600: '#1f618d', // Color de acento más claro
        },
        background: {
          100: '#e5e7e9', // Fondo principal
          200: '#aeb6bf', // Fondo secundario
        },
        text: {
          primary: '#17202a', // Texto principal
          secondary: '#1c2638', // Texto secundario
          white: '#f4f6f7', // Texto blanco
        },
        accent: {
          400: '#9b222b', // Para hover o acentos más oscuros
          500: '#f14e52', // Color de acento (usado para botones secundarios o detalles)
        },
        success: {
          500: '#28a745', // Éxito
          600: '#1e7e34', // Éxito para hover
        },
        warning: {
          500: '#ffc107', // Advertencia
          600: '#e6a800', // Advertencia para hover
        },
        error: {
          500: '#dc3545', // Error
          600: '#c82333', // Error para hover
        },
        info: {
          500: '#17a2b8', // Información
          600: '#138496', // Información para hover
        },
        neutral: {
          500: '#6c757d', // Neutro
          600: '#5a6268', // Neutro para hover
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionProperty: {
        colors: 'background-color, border-color, color, fill, stroke',
      },
    },
  },
  plugins: [
    function({ addBase, theme }) {
      addBase({
        '::selection': {
          'background-color': theme('colors.primary.500'),
          'color': theme('colors.text.white'),
        },
      });
    }
  ],
}
