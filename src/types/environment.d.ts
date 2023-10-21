declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ASTICA_TOKEN: string;
      FACEBOOK_COOKIES: string;
      GIPHY_TOKEN: string
    }
  }
}

export {};
