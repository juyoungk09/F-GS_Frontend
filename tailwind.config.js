export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/routes/index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        primary_color_1: '#FFF2F2',
        primary_color_2: '#A9B5DF',
        primary_color_3: '#7886C7',
        primary_color_4: '#2D336B',
        good_gray: "#FCFBFC"
      },
      fontSize: {
        'xs-custom': '0.65rem',
        'huge': '4rem',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
};