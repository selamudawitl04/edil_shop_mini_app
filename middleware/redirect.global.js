// middleware/redirectFrom.global.ts
// import { useBackStore } from "@/stores/back-route";

// const backStore = useBackStore();

export default defineNuxtRouteMiddleware((to, from) => {
  // UUID pattern (alphanumeric + hyphens)
  const uuidPattern = "[0-9a-fA-F-]+";

  const creatorMatch = new RegExp(`^/creators/${uuidPattern}$`).test(to.path);
  const lotteryMatch = new RegExp(`^/lotteries/${uuidPattern}$`).test(to.path);

  if (creatorMatch || lotteryMatch) {
    // backStore.setRoute(from.fullPath);
  }
});
