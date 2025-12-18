/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f3f4f5',
                    100: '#ebf1f3',
                    200: '#c5d9db',
                    300: '#a1bcc4',
                    400: '#7e9fab',
                    500: '#4b7088',
                    600: '#3f5f73',
                    700: '#354f60',
                    800: '#2b404f',
                    900: '#22323e',
                    950: '#18232c',
                },
                gray: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
        },
    },
    plugins: [],
}
