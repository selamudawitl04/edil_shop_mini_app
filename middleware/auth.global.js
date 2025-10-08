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
  const { getToken } = useApollo();
  const token = await getToken("auth");
  const userData = useCookie("userData");
  console.log("🔍 Checking route:", to.path);
  console.log("🔹 Token:", token);
  console.log("🔹 User Data:", userData.value);
  // "/" route: if user is logged in → redirect to /lotteries
  if (to.path === "/" && token && userData.value && !isExpired(token)) {
    console.log("✅ User already logged in — redirecting to /lotteries");
    return navigateTo("/lotteries");
  }
  // Other routes: validate token + user
  if (to.path !== "/") {
    if (!token || !userData.value || isExpired(token)) {
      console.warn("🚫 Unauthorized — redirecting to /");
      return navigateTo("/");
    }
  }
  console.log("✅ Authorized access:", to.path);
});
