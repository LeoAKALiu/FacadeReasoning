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
        // Base surfaces
        canvas: '#0A0D14',
        surface: {
          DEFAULT: '#111827',
          raised: '#1F2937',
          overlay: '#263244',
        },
        border: {
          DEFAULT: '#374151',
          subtle: '#1F2937',
          strong: '#4B5563',
        },
        // Text
        ink: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
          tertiary: '#6B7280',
          inverted: '#0A0D14',
        },
        // Accent
        accent: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          muted: '#312E81',
          subtle: '#1E1B4B',
        },
        // Status: evidence source types
        observe: {
          DEFAULT: '#22C55E',
          muted: '#14532D',
          subtle: '#052E16',
        },
        infer: {
          DEFAULT: '#3B82F6',
          muted: '#1E3A8A',
          subtle: '#0C1A4D',
        },
        ai: {
          DEFAULT: '#A855F7',
          muted: '#581C87',
          subtle: '#2D0F4D',
        },
        review: {
          DEFAULT: '#F59E0B',
          muted: '#78350F',
          subtle: '#3D1A00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
      },
    },
  },
  plugins: [],
}

export default config
