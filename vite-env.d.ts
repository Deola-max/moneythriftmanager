/// <reference types="vite/client" />
/// <reference path="./global.d.ts" />

// Add type declarations for Vite's import.meta.env
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
