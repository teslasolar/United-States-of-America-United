/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,njk,md,js}',
    './src/_includes/**/*.njk',
    './src/assets/js/**/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        americana: {
          navy: '#002868',      // Deep blue from US flag
          crimson: '#BF0A30',   // Red from US flag
          white: '#FFFFFF',
          steel: '#4A5568',     // Modern gray for UI elements
          gold: '#FFD700',      // Achievement/accent gold
          bg: '#0F1419',        // Dark background (default)
          surface: '#1A1F2E',   // Card/panel background
          border: '#2D3748',    // Border color
          text: '#E5E7EB',      // Light text
          textMuted: '#9CA3AF', // Muted text
          success: '#10B981',   // Green for positive outcomes
          warning: '#F59E0B',   // Orange for caution
          danger: '#EF4444'     // Red for negative outcomes
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],      // Story text
        sans: ['Inter', 'system-ui', 'sans-serif'],       // UI elements
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'], // Technical details
        display: ['Oswald', 'Impact', 'sans-serif']       // Headers
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.americana.text'),
            a: {
              color: theme('colors.americana.crimson'),
              '&:hover': {
                color: theme('colors.americana.gold'),
              },
            },
            h1: {
              color: theme('colors.americana.text'),
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h2: {
              color: theme('colors.americana.text'),
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h3: {
              color: theme('colors.americana.text'),
            },
            strong: {
              color: theme('colors.americana.text'),
            },
            code: {
              color: theme('colors.americana.gold'),
              backgroundColor: theme('colors.americana.surface'),
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              borderLeftColor: theme('colors.americana.crimson'),
              color: theme('colors.americana.textMuted'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
