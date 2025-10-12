import { jwtDecode } from "jwt-decode";

function isExpired(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (err) {
    return true; // treat invalid token as expired
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // ✅ ensure only client
  if (process.server) return;

  console.log("🔍 Checking route:", to.path);

  const { getToken, onLogout } = useApollo();
  const token = await getToken("auth");
  const userData = useCookie("userData");

  const tg = window?.Telegram?.WebApp;
  const telegramUserId = tg?.initDataUnsafe?.user?.id;

  console.log("🔹 Token:", token);
  console.log("🔹 User Data:", userData.value);
  console.log("🔹 Telegram User ID:", telegramUserId);

  // "/" route: if user is logged in → redirect to /lotteries
  if (to.path === "/" && token && userData.value && !isExpired(token)) {
    // compare telegram user IDs
    if (telegramUserId && userData.value?.telegram_user_id) {
      if (userData.value.telegram_user_id !== telegramUserId) {
        console.warn("🚫 Telegram ID mismatch — redirecting to bot");

        userData.value = null;
        onLogout("auth");
        navigateTo("/");
        return;
      }
    }
    console.log("✅ User already logged in — redirecting to /lotteries");
    return navigateTo("/lotteries");
  }

  // Other routes: validate token + user
  if (to.path !== "/") {
    if (!token || !userData.value || isExpired(token)) {
      console.warn("🚫 Unauthorized — redirecting to /");
      return navigateTo("/");
    }

    // check Telegram ID on protected routes too
    if (telegramUserId && userData.value?.telegram_user_id) {
      if (userData.value.telegram_user_id !== telegramUserId) {
        console.warn("🚫 Telegram ID mismatch — redirecting to bot");
        userData.value = null;
        onLogout("auth");
        navigateTo("/");
        return;
      }
    }
  }
});
