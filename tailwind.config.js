/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--page-bg)',
        'bg-main': 'var(--page-bg)',
        'bg-section': 'var(--card-bg-deep)',
        'bg-card': 'var(--card-bg)',
        'bg-card-soft': 'var(--card-bg-soft)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        'text-dark': 'var(--text-dark)',
        accent: 'rgba(var(--accent-rgb), <alpha-value>)',
        'accent-hover': 'var(--accent-hover)',
        'accent-dark': 'var(--accent-dark)',
        'accent-soft': 'var(--accent-soft)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 48px rgba(31, 37, 43, 0.16)',
        card: '0 14px 30px rgba(31, 37, 43, 0.1)',
        glow: '0 0 0 1px rgba(var(--accent-rgb), 0.55), 0 16px 36px rgba(var(--accent-rgb), 0.2), 14px 18px 34px rgba(31, 37, 43, 0.08), -10px -10px 26px rgba(255, 255, 255, 0.8)',
        'neu-sm': '4px 6px 12px rgba(31, 37, 43, 0.07), -3px -3px 10px rgba(255, 255, 255, 0.75)',
        neu: '8px 12px 28px rgba(31, 37, 43, 0.07), -6px -6px 20px rgba(255, 255, 255, 0.7)',
        'neu-lg': '14px 18px 40px rgba(31, 37, 43, 0.08), -10px -10px 30px rgba(255, 255, 255, 0.75)',
        'neu-hover': '10px 14px 30px rgba(31, 37, 43, 0.09), -6px -6px 22px rgba(255, 255, 255, 0.78)',
        'neu-inset': 'inset 5px 5px 12px rgba(31, 37, 43, 0.1), inset -5px -5px 12px rgba(255, 255, 255, 0.85)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [],
}
