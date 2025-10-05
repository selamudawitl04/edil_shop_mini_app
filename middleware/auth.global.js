// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Only apply this middleware to /user routes
  return;
});

// http://localhost:3000/user/groups/0ce5ad6a-e958-465f-b04d-1feee39b691f?name=Teens+prayer+group
