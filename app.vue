<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import "vue-toast-notification/dist/theme-sugar.css";
const { onLogin, getToken, onLogout } = useApollo();
const router = useRouter();
const route = useRoute();
import getUserQuery from "@/graphql/auth/user_item.gql";

// onLogin(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5lZGlsc2hvcC5jb20iLCJlbnRpdHlfaWQiOiIiLCJleHAiOjE3NjIyMzc0OTYsImlhdCI6MTc2MTYzMjY5NiwiaXNzIjoiaHR0cHM6Ly9hcGkuZWRpbHNob3AuY29tIiwibWV0YWRhdGEiOnsibmFtZSI6IlNhbXVlbCBOZXciLCJyb2xlcyI6WyJ1c2VyIl19LCJyb2xlIjpbInVzZXIiXSwic3ViIjoiOWIxMmMyZDctYTRkOC00MDY3LTgwNzgtZjgxOWFhYzE0MmRjIn0.7JdcuCROBwz7EneBuAZXGsaug77j3k3F4AFmpC4JnII",
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

const checkTelegramAuth = async () => {
  const userData = useCookie("userData");
  const tg = window?.Telegram?.WebApp;
  if (!tg?.initDataUnsafe?.user) return; // Not in Telegram or no user

  const telegramUserId = tg.initDataUnsafe?.user?.id;
  let storedUserId = userData.value?.telegram_user_id;

  alert(telegramUserId + " Telegram User ID", userData.value.id + " User ID");

  if (userData.value) {
    const { onResult, onError } = queryItem(getUserQuery, {
      id: userData.value.id,
      clientId: "auth",
    });

    onResult(({ data }) => {
      if (data.users_by_pk) {
        storedUserId = data.users_by_pk.telegram_user_id;
        // If user navigates elsewhere but IDs mismatch → redirect to /
        if (storedUserId && storedUserId != telegramUserId) {
          console.warn("🚫 Telegram ID mismatch — redirecting to bot");
          userData.value = null;
          onLogout("auth");
          router.push("/");
          return;
        } else {
          console.log("user is found");
        }
      } else {
        userData.value = null;
        onLogout("auth");
        router.push("/");
      }
    });

    onError((error) => {
      userData.value = null;
      onLogout("auth");
      router.push("/");
    });
  }
};
onMounted(() => {
  // Run immediately
  checkTelegramAuth();
});
</script>
