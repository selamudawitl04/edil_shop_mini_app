<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import "vue-toast-notification/dist/theme-sugar.css";
const { onLogout, onLogin } = useApollo();
const router = useRouter();
const route = useRoute();
import getUserQuery from "@/graphql/auth/user_item.gql";

const config = useRuntimeConfig();
// onLogin(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5lZGlsc2hvcC5jb20iLCJlbnRpdHlfaWQiOiIiLCJleHAiOjE3NjI1MDQ1NTcsImlhdCI6MTc2MTg5OTc1NywiaXNzIjoiaHR0cHM6Ly9hcGkuZWRpbHNob3AuY29tIiwibWV0YWRhdGEiOnsibmFtZSI6IlNlbGFtdSBEYXdpdCIsInJvbGVzIjpbInVzZXIiXX0sInJvbGUiOlsidXNlciJdLCJzdWIiOiIwOTIzMGRkYS1mOWVmLTRkMmUtOWEyZi02YjM3OWE2MzEyN2EifQ.39o4qkRNsQCLmPElPljxHUQtniqkaJXKBcyR4nWfTyg",
//   "auth"
// );

// useCookie("userData").value = {
//   id: "09230dda-f9ef-4d2e-9a2f-6b379a63127a",
//   name: "Selamu Dawit",
//   phone: "251904823272",
//   alternate_phone: null,
//   role: "user",
//   is_phone_verified: true,
//   profile_image: "",
//   avatar_color: "#4DD0E1",
// };

const checkTelegramAuth = async () => {
  const userData = useCookie("userData");
  const tg = window?.Telegram?.WebApp;
  if (!tg?.initDataUnsafe?.user) return; // Not in Telegram or no user

  const telegramUserId = tg.initDataUnsafe?.user?.id;
  let storedUserId = userData.value?.telegram_user_id;
  const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
  alert(startParam, "startParambbbbbbbbbbbbbbbbbssss");

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
          if (data.users_by_pk.phone) {
            let newUser = { ...userData.value };
            newUser.phone = data.users_by_pk.phone;
            userData.value = newUser;
          } else {
            sharePhoneNumber(
              userData.value.id,
              config.public.edilShopBotUrl,
              false
            );
            return;
          }
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
      if (route.path !== "/") {
        router.push("/");
      } else {
        window.location.reload();
      }
    });
  }
};
onMounted(() => {
  // Run immediately
  checkTelegramAuth();
});
</script>
