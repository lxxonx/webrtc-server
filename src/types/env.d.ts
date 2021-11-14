declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    DATABASE_URL: string;
    PORT: number;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}
