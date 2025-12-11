import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                cyan: {
                    400: '#00FFFF', // Cyberpunk Cyan
                    500: '#00D9D9',
                    900: '#003333',
                },
                'neon-green': '#39FF14',
                'cyber-black': '#050505',
                'cyber-gray': '#121212',
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #00FFFF10 1px, transparent 1px), linear-gradient(to bottom, #00FFFF10 1px, transparent 1px)",
            },
            fontFamily: {
                mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
            },
        },
    },
    plugins: [],
};
export default config;
