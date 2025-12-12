/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    envPrefix: ['VITE_', 'OPENAI_', 'AI_', 'BRIEF_'],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/vitest.setup.ts',
    },
})
