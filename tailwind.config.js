/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  // Add custom utility classes
  theme: {
    extend: {
      // Add any custom colors, fonts, etc. here
    },
  },
}

