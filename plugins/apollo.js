export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("apollo:error", (error) => {
    // Handle different error cases
  });
});
