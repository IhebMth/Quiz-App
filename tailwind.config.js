export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',  // Scan all component folders
    './public/**/*.html',                  // Public folder HTML
    './wp-content/themes/react-tailwind-theme/**/*.php'  // Scan WordPress PHP files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
