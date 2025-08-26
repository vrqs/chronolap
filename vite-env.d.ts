/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TIMEZONEDB_API_KEY: string;
  // add other VITE_ env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
