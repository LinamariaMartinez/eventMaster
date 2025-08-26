const { Config } = require("tailwindcss");

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class", // Modo oscuro controlado por clase 'dark'
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: "hsl(var(--primary))",
        "burgundy-light": "hsl(336 29% 52%)", // ejemplo para hover, ajusta si quieres
        "burgundy-dark": "hsl(var(--secondary-foreground))",
        crema: "hsl(var(--secondary))",
        "crema-light": "hsl(var(--primary-foreground))",
        beige: "hsl(var(--border))",
        "gray-warm": "hsl(var(--muted-foreground))",
        "black-soft": "hsl(var(--foreground))",
        white: "hsl(0 0% 100%)",
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #8B4B6B 0%, #F5F1E8 100%)",
        "gradient-button": "linear-gradient(45deg, #6B3B5B 0%, #8B4B6B 100%)",
        "gradient-card": "linear-gradient(to bottom, #FDFCFA 0%, #F5F1E8 100%)"
      },
      borderRadius: {
        lg: "0.75rem",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)"],
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports = config;
