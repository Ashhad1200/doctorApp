/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#059669", // emerald-600
        secondary: "#3b82f6", // blue-500
        success: "#10b981",
        error: "#ef4444",
        background: "#ffffff",
        text: "#1f2937",
        muted: "#9ca3af",
      },
      fontFamily: {
        sans: ["OpenSays_400Regular"],
        bold: ["OpenSays_700Bold"],
        semibold: ["OpenSays_600SemiBold"],
      },
    },
  },
  plugins: [],
}
