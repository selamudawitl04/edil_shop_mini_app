// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Only apply this middleware to /user routes
  return;
});
