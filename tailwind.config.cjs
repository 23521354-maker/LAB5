module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f8ff',
          100: '#e6f0ff',
          500: '#1e6fff'
        }
      },
      boxShadow: {
        card: '0 6px 18px rgba(15, 23, 42, 0.06)'
      }
    }
  },
  plugins: []
}
