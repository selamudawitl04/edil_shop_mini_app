// composables/useTelegram.js
export const useTelegram = () => {
  const tg = window?.Telegram?.WebApp;

  const initData = tg?.initData || "";
  const initDataUnsafe = tg?.initDataUnsafe || {};

  const themeParams = tg?.themeParams || {};
  const colorScheme = tg?.colorScheme || "light";

  const expand = () => tg?.expand();
  const close = () => tg?.close();

  return {
    tg,
    initData,
    initDataUnsafe,
    themeParams,
    colorScheme,
    expand,
    close,
  };
};
