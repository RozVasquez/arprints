/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        '2048/1717': '2048 / 1717',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}

