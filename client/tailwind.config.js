// tailwind.config.js
// Tells Tailwind which files to scan for class names
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // scan all React files
  ],
  theme: {
    extend: {
      // Custom colors for our portal
      colors: {
        primary: "##FFFF00",    // indigo - main brand color
        secondary: "#10B981",  // emerald - success/found items
        danger: "#EF4444",     // red - lost items
      },
    },
  },
  plugins: [],
};