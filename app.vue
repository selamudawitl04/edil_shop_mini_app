<template>
  <div>
    <NuxtPage />

    <pre>
      
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus, nobis aut alias officiis incidunt possimus ipsam! Esse impedit sequi, ipsam quibusdam excepturi eos at dolore nobis. Laboriosam neque repudiandae mollitia?
    </pre>
    Count:{{ checkCount }}
  </div>
</template>

<script setup>
import "vue-toast-notification/dist/theme-sugar.css";

const { onLogin, getToken, onLogout } = useApollo();
// onLogin(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5lZGlsc2hvZi5jb20iLCJlbnRpdHlfaWQiOiIiLCJleHAiOjE3NjA4MTEwNzIsImlhdCI6MTc2MDIwNjI3MiwiaXNzIjoiaHR0cHM6Ly9hcGkuZWRpbHNob2YuY29tIiwibWV0YWRhdGEiOnsibmFtZSI6IlNhbXVlbCBOb2FoMSIsInJvbGVzIjpbInVzZXIiXX0sInJvbGUiOlsidXNlciJdLCJzdWIiOiI5YjEyYzJkNy1hNGQ4LTQwNjctODA3OC1mODE5YWFjMTQyZGMifQ.nCCgIDTfppcogfuPak-EhtqkrJ40R--uMFGkBYPXZpQ",
//   "auth"
// );

// useCookie("userData").value = {
//   id: "9b12c2d7-a4d8-4067-8078-f819aac142dc",
//   name: "Samuel New",
//   phone: "251945003939",
//   alternate_phone: null,
//   role: "user",
//   is_phone_verified: true,
//   profile_image: "",
//   avatar_color: "#4A90E2",
// };

// onLogin(
//   "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5lZGlsc2hvZi5jb20iLCJlbnRpdHlfaWQiOiIiLCJleHAiOjE3NjA3MTAzODIsImlhdCI6MTc2MDEwNTU4MiwiaXNzIjoiaHR0cHM6Ly9hcGkuZWRpbHNob2YuY29tIiwibWV0YWRhdGEiOnsibmFtZSI6IlNhbXVlbCBOb2FoIiwicm9sZXMiOlsidXNlciJdfSwicm9sZSI6WyJ1c2VyIl0sInN1YiI6IjIxMmI1OTBjLTRlOTYtNGUxZi04Y2MwLWJmODIzMTE5NDQ1ZiJ9.M_mmodFqIrwQjeToeQklOZC_PLy2DYugxm37r6Oxp00cjNvYuwkXkXZkUEH7SLBFMoOOJZxyEhdZlSMijtf-CA",
//   "auth"
// );

// useCookie("userData").value = {
//   id: "212b590c-4e96-4e1f-8cc0-bf823119445f",
//   name: "Test User",
//   phone: "0945003939",
//   alternate_phone: null,
//   role: "user",
//   is_phone_verified: true,
//   profile_image: "",
//   avatar_color: "#4DD0E1",
// };

const checkCount = ref(0);

onMounted(() => {
  const route = useRoute();
  const router = useRouter();
  const userData = useCookie("userData");

  const checkTelegramAuth = () => {
    checkCount.value++;
    console.log("🔍 Checking Telegram Auth", checkCount.value);

    const tg = window?.Telegram?.WebApp;
    if (!tg?.initDataUnsafe?.user) return; // Not in Telegram or no user

    const telegramUserId = tg.initDataUnsafe.user.id;
    const storedUserId = userData.value?.telegram_user_id;

    // If user navigates elsewhere but IDs mismatch → redirect to /
    if (
      route.path !== "/" &&
      (!storedUserId || storedUserId !== telegramUserId)
    ) {
      console.warn("🚫 Telegram ID mismatch — redirecting to bot");

      userData.value = null;
      onLogout("auth");

      router.push("/");

      return;
    }
  };

  // Run immediately
  checkTelegramAuth();

  // Then repeat every 5 seconds
  const interval = setInterval(checkTelegramAuth, 5000);

  // Clean up when component unmounts
  onBeforeUnmount(() => clearInterval(interval));
});
</script>
