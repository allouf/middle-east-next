// utils/lazyWithMinDelay.js
export const withMinDelay = (factory, ms = 5000) => () => {
  const start = Date.now();
  return factory().then((mod) => {
    const elapsed = Date.now() - start;
    const wait = ms - elapsed;
    if (wait <= 0) return mod;
    return new Promise((resolve) => setTimeout(() => resolve(mod), wait));
  });
};
