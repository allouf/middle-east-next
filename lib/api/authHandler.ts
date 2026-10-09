// authHandler.ts

type LogoutHandler = () => void;

let logoutFn: LogoutHandler | null = null;

export const setLogoutHandler = (fn: LogoutHandler): void => {
  logoutFn = fn;
};

export const runLogoutHandler = (): void => {
  if (typeof logoutFn === "function") {
    logoutFn();
  }
};
