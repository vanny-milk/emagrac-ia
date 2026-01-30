export default {
    plugins: {
        "@tailwindcss/postcss": {
            config: "./tailwind.config.js",
        },
        autoprefixer: {}, // Autoprefixer is standard with PostCSS
    },
}
