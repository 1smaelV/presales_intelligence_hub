/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Allow Gemini env vars through Vite so Gemini provider gets model/key from .env.
    envPrefix: ['VITE_', 'OPENAI_', 'AI_', 'BRIEF_', 'GEMINI_'],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/vitest.setup.ts',
    },
})
