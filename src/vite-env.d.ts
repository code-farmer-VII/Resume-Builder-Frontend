/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_Nova_2_Lite_v1: string;
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}