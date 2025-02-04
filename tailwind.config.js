// tailwind.config.js

module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}", // Mantém a busca pelos arquivos do projeto
    ],
    theme: {
      extend: {},
    },
    plugins: [require('daisyui')],
  };
  