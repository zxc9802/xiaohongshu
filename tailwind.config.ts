import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 小红书 Premium Red Theme
        primary: {
          DEFAULT: '#FF2442',
          50: '#FFF0F2',
          100: '#FFE4E8',
          200: '#FFCDD5',
          300: '#FDA4B0',
          400: '#FD6D84',
          500: '#FF2442', // Brand Red
          600: '#E61E3B',
          700: '#BF152E',
          800: '#991125',
          900: '#7F0E1F',
          950: '#45040E',
        },
        surface: {
          light: '#FFFFFF',
          float: 'rgba(255, 255, 255, 0.85)',
          glass: 'rgba(255, 255, 255, 0.7)',
        },
        background: {
          light: '#F8F9FC', // Cool light gray for contrast
          subtle: '#FFF5F6', // Very subtle red tint
        },
        text: {
          primary: '#1F1F1F',    // Soft black
          secondary: '#666666',  // Medium gray
          muted: '#999999',     // Light gray
          accent: '#FF2442',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 40px -10px rgba(255, 36, 66, 0.08)',
        '3d': '0 20px 40px -4px rgba(255, 36, 66, 0.12), 0 8px 16px -4px rgba(255, 36, 66, 0.08)',
        '3d-hover': '0 25px 50px -12px rgba(255, 36, 66, 0.25)',
        'float': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(255, 36, 66, 0.3)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(255, 36, 66, 0.3)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 10px rgba(255, 36, 66, 0.2)' },
        },
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(255,200,200,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(255,36,66,0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255,255,255,1) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
export default config
