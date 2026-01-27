import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: (theme: any) => ({
        sakura: {
          css: {
            '--tw-prose-body': theme('colors.gray[700]'),
            '--tw-prose-headings': theme('colors.gray[900]'),
            '--tw-prose-links': theme('colors.sakura.dark'),
            '--tw-prose-bold': theme('colors.gray[900]'),
            '--tw-prose-counters': theme('colors.sakura.DEFAULT'),
            '--tw-prose-bullets': theme('colors.sakura.DEFAULT'),
            '--tw-prose-hr': theme('colors.sakura.light'),
            '--tw-prose-quotes': theme('colors.sakura.dark'),
            '--tw-prose-quote-borders': theme('colors.sakura.light'),
            '--tw-prose-captions': theme('colors.gray[500]'),
            '--tw-prose-code': theme('colors.sakura.dark'),
            '--tw-prose-pre-code': theme('colors.gray[200]'),
            '--tw-prose-pre-bg': theme('colors.gray[800]'),
            '--tw-prose-th-borders': theme('colors.sakura.light'),
            '--tw-prose-td-borders': theme('colors.sakura.light'),
            'table': {
              'border-collapse': 'collapse',
              'border-width': '1px',
              'border-color': theme('colors.sakura.light'),
              'border-radius': '0.75rem',
              'overflow': 'hidden',
            },
            'thead': {
              'background-color': 'rgba(255, 219, 233, 0.3)',
              'border-bottom-width': '2px',
              'border-bottom-color': theme('colors.sakura.DEFAULT'),
            },
            'th': {
              'border-width': '1px',
              'border-color': theme('colors.sakura.light'),
              'padding': '0.75rem 1rem',
            },
            'td': {
              'border-width': '1px',
              'border-color': theme('colors.sakura.light'),
              'padding': '0.75rem 1rem',
            },
          },
        },
      }),
      colors: {
        sakura: {
          light: "#FFDBE9",
          DEFAULT: "#FFB7C5",
          dark: "#FF9EAF",
        },
        sky: {
          light: "#B0E2FF",
          DEFAULT: "#87CEEB",
          dark: "#00BFFF",
        },
        lavender: {
          light: "#E6E6FA",
          DEFAULT: "#D8BFD8",
          dark: "#DDA0DD",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
