/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#ffeae6",
                    100: "#ffd5cc",
                    200: "#ffaa99",
                    300: "#fe8067",
                    400: "#fe5634",
                    500: "#fd2d01",
                    600: "#cb2301",
                    700: "#981a01",
                    800: "#661100",
                    900: "#330900",
                },
                secondary: {
                    50: "#fffafa",
                    100: "#fff5f5",
                    200: "#fff0f0",
                    300: "#ffe5e5",
                    400: "#ffe0e0",
                    500: "#ffd7d7",
                    600: "#ff7a7a",
                    700: "#ff1a1a",
                    800: "#bd0000",
                    900: "#5c0000",
                },
                tertiary: {
                    50: "#eeeef2",
                    100: "#d9dae2",
                    200: "#b4b6c6",
                    300: "#8e91a9",
                    400: "#6a6e8b",
                    500: "#4e5166",
                    600: "#3e4051",
                    700: "#2e303d",
                    800: "#1f2028",
                    900: "#0f1014",
                },
            },
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
            },
            animation: {
                wiggle: "wiggle 0.3s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
