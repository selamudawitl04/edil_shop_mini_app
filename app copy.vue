<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import "vue-toast-notification/dist/theme-sugar.css";

const { onLogin, getToken } = useApollo();
onLogin(
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5lZGlsc2hvZi5jb20iLCJlbnRpdHlfaWQiOiIiLCJleHAiOjE3NTk5OTM1NTYsImlhdCI6MTc1OTM4ODc1NiwiaXNzIjoiaHR0cHM6Ly9hcGkuZWRpbHNob2YuY29tIiwibWV0YWRhdGEiOnsibmFtZSI6IlNhbXVlbCBOZXciLCJyb2xlcyI6WyJ1c2VyIl19LCJyb2xlIjpbInVzZXIiXSwic3ViIjoiOWIxMmMyZDctYTRkOC00MDY3LTgwNzgtZjgxOWFhYzE0MmRjIn0.zgN5dqup8jADQKpV7dMfhvzJSHerdMnDU3XOdrv7GPPHXAMWKVy9k3yfJpcnMKkt09LsgYlkEd8vVNvLkmBhDg",
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
</script>
