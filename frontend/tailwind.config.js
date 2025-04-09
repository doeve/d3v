/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class', // Enable dark mode with class-based activation
    theme: {
      extend: {
        colors: {
          // Custom colors for the app's theme
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
          // Extended gray scale for dark theme
          gray: {
            750: '#374151',
            850: '#1a202e',
          },
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
          mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        },
        spacing: {
          // Custom spacing if needed
          '18': '4.5rem',
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
        },
        boxShadow: {
          // Custom shadows
          'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)'
        },
        transitionProperty: {
          // Custom transitions
          'height': 'height',
          'width': 'width',
          'spacing': 'margin, padding',
        },
        animation: {
          // Custom animations
          'fade-in': 'fadeIn 0.5s ease-out',
          'slide-in-right': 'slideInRight 0.5s ease-out',
          'slide-in-left': 'slideInLeft 0.5s ease-out',
          'slide-in-up': 'slideInUp 0.5s ease-out',
          'slide-in-down': 'slideInDown 0.5s ease-out',
        },
        keyframes: {
          // Keyframes for custom animations
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideInRight: {
            '0%': { transform: 'translateX(100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          slideInLeft: {
            '0%': { transform: 'translateX(-100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          slideInUp: {
            '0%': { transform: 'translateY(100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          slideInDown: {
            '0%': { transform: 'translateY(-100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }