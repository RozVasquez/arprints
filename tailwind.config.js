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
      fontFamily: {
        'dynapuff': ['DynaPuff', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
        'tiktok': ['TikTok Sans', 'sans-serif'],
        'montserrat': ['Montserrat Alternates', 'sans-serif'],
        'exo2': ['Exo 2', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}

