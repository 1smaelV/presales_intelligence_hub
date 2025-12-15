/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BRIEF_MODEL?: string;
  readonly OPENAI_MODEL?: string;
  readonly AI_ANALYZER_MODEL?: string;
  readonly OPENAI_API_KEY?: string;
  readonly GEMINI_MODEL?: string;
  readonly GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
