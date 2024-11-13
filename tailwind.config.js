module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#21DBAF',   // Color claro del botón verde "Talk to us"
          DEFAULT: '#06203f', // Color principal oscuro para el texto general
          dark: '#111827',    // Color oscuro usado en los bordes o fondos secundarios
        },
        secondary: {
          light: '#FF9275',   // Color claro del botón "Book a Demo" (rojo claro)
          DEFAULT: '#F95738', // Color secundario, posiblemente un acento naranja/rojo
          dark: '#C62B1A',    // Color oscuro usado en hover del botón "Book a Demo"
        },
        accent: {
          light: '#43D0B9',   // Color del botón "Price Calculator" (verde/menta claro)
          DEFAULT: '#1FC5A8', // Color de acento general (verde agua claro en botones)
          dark: '#0FA097',    // Color más oscuro del verde/acento en botones
        },
        neutral: {
          light: '#F3F4F6',   // Fondo claro, como el fondo general de la página o la caja de cookies
          DEFAULT: '#334155', // Color neutro de fondo oscuro o fondo del sidebar
          dark: '#1E293B',    // Fondo más oscuro usado en sidebar o tarjetas
        },
        highlight: {
          DEFAULT: '#0AB6FF', // Color azul claro (acento en logotipos, elementos destacados)
          dark: '#007BBB',    // Azul oscuro para hover o iconografía
        },
      },
      // Extensiones para tipografías personalizadas (opcional)
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Tipografía personalizada, comúnmente usada en interfaces modernas
        serif: ['Merriweather', 'serif'],
      },
      // Extensiones para bordes redondeados (opcional)
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
