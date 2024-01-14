/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'sharp': '-0.3rem 0.3rem black',
        'none': 'none',
      }
    },
    fontFamily: {
      'Benz': ['Benz Grotesk', "monospace"],
      'Monaco': ['Monaco', "monospace"],
      'Neue': ['PPNeueMachina', "monospace"],
    }
  },
  plugins: [],
}

