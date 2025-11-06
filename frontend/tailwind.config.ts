import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc143c', // Crimson accent
          600: '#b22222', // Firebrick
          700: '#8b0000', // Dark red (main)
          800: '#5c0000',
          900: '#3d0000',
        },
        background: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
