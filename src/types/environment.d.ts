declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ASTICA_TOKEN: string;
      FACEBOOK_COOKIES: string;
      GIPHY_TOKEN: string;
      DEV: string;
      FACEBOOK_USERNAME: string;
      PORT: string;
    }
  }
}

export {};
