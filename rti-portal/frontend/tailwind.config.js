/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gazette: {
          paper: "#F7F4EC",
          ink: "#1C1B19",
          navy: "#122142",
          navyLight: "#1D3564",
          saffron: "#E07A2C",
          saffronDark: "#B95E17",
          teal: "#1B6E63",
          maroon: "#7A2E2E",
          line: "#D9D2C2",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        seal: "0 1px 0 rgba(18,33,66,0.08)",
      },
    },
  },
  plugins: [],
};
