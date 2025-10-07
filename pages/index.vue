<template>
  <div>
    <button class="bg-blue-500 text-white p-2 rounded" @click="login">
      Login
    </button>
  </div>
</template>

<script setup>
import "vue-toast-notification/dist/theme-sugar.css";

const { onLogin, getToken } = useApollo();
const router = useRouter();

async function login() {
  onLogin(
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5lZGlsc2hvZi5jb20iLCJlbnRpdHlfaWQiOiIiLCJleHAiOjE3NjAzOTQyMjMsImlhdCI6MTc1OTc4OTQyMywiaXNzIjoiaHR0cHM6Ly9hcGkuZWRpbHNob2YuY29tIiwibWV0YWRhdGEiOnsibmFtZSI6IlNhbXVlbCBOZXciLCJyb2xlcyI6WyJ1c2VyIl19LCJyb2xlIjpbInVzZXIiXSwic3ViIjoiOWIxMmMyZDctYTRkOC00MDY3LTgwNzgtZjgxOWFhYzE0MmRjIn0.MXtmAcZem3KqeNdjylXS46j5eOr5WCl5u6-JJTPtjEyBeVyWVthLz22fY-iPX0eZ51250VWH6yFCwV4-h7pyCA",
    "auth"
  );

  useCookie("userData").value = {
    id: "9b12c2d7-a4d8-4067-8078-f819aac142dc",
    name: "Samuel New",
    phone: "0945003939",
    alternate_phone: null,
    role: "user",
    is_phone_verified: true,
    profile_image: "",
    avatar_color: "#4A90E2",
  };

  const token = await getToken("auth");

  console.log(token, "this is the token");

  router.push("/lotteries");
}
</script>
