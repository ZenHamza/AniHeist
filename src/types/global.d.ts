export {};

declare global {
  interface Window {
    __NEXT_AUTH_SESSION_COOKIE?: string;
  }
}
