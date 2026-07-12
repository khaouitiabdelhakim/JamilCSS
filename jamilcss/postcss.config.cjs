module.exports = {
  plugins: {
    jamilcss: {
      cwd: __dirname,
      content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./content/**/*.{md,mdx}",
      ],
      cssEntry: "app/globals.css",
    },
  },
};
