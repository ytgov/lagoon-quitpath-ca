module.exports = {
    plugins: [
      require('@tailwindcss/postcss')({
        config: './tailwind.config.js' // Adjust path if needed
      }),
      require('autoprefixer'),
    ]
  };
  