// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './lib/**/*.{js,ts,jsx,tsx,mdx}',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554',
          },
          secondary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
            950: '#3b0764',
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
            950: '#030712',
          },
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'fade-out': 'fadeOut 0.5s ease-in-out',
          'slide-in-right': 'slideInRight 0.3s ease-out',
          'slide-out-right': 'slideOutRight 0.3s ease-in',
          'bounce-slow': 'bounce 2s infinite',
          'pulse-slow': 'pulse 3s infinite',
          'float': 'float 3s ease-in-out infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          fadeOut: {
            '0%': { opacity: '1' },
            '100%': { opacity: '0' },
          },
          slideInRight: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideOutRight: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(100%)' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          glow: {
            '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
            '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
          },
        },
        boxShadow: {
          'neumorphic': '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
          'neumorphic-inset': 'inset 20px 20px 60px #bebebe, inset -20px -20px 60px #ffffff',
          'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
          'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
        },
        backdropBlur: {
          xs: '2px',
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
        },
        borderRadius: {
          '4xl': '2rem',
          '5xl': '2.5rem',
        },
        aspectRatio: {
          '4/3': '4 / 3',
          '3/2': '3 / 2',
          '2/3': '2 / 3',
          '9/16': '9 / 16',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }