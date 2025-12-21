/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          DEFAULT: "#6B4F3B",
          900: "#432F1D", // darker shade for hover
        },
        cream: {
          DEFAULT: "#FFF5E1",
          200: "#FFF8EB", // lighter shade for hover
        },
      },
    },
  },
  plugins: [],
};
