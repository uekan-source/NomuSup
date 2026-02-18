/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // アクティブな印象のオレンジを設定
        primary: "#FF8C00", 
      },
    },
  },
  plugins: [],
}