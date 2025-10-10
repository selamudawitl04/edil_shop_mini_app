<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import "vue-toast-notification/dist/theme-sugar.css";

const { onLogin, getToken } = useApollo();
// onLogin(
//   "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5lZGlsc2hvZi5jb20iLCJlbnRpdHlfaWQiOiIiLCJleHAiOjE3NjA2MTgzMDUsImlhdCI6MTc2MDAxMzUwNSwiaXNzIjoiaHR0cHM6Ly9hcGkuZWRpbHNob2YuY29tIiwibWV0YWRhdGEiOnsibmFtZSI6IlNhbXVlbCBOb2FoMSIsInJvbGVzIjpbInVzZXIiXX0sInJvbGUiOlsidXNlciJdLCJzdWIiOiI5YjEyYzJkNy1hNGQ4LTQwNjctODA3OC1mODE5YWFjMTQyZGMifQ.ud29OCHGPgzdlKF-I3vVL9GHLhzC0OpoLqbV7sQVs-JtZIe_-0u_IyNLEKRly_eRU6rOZ8cmS0IYiJR1PvDCDw",
//   "auth"
// );

// useCookie("userData").value = {
//   id: "9b12c2d7-a4d8-4067-8078-f819aac142dc",
//   name: "Samuel New",
//   phone: "0945003939",
//   alternate_phone: null,
//   role: "user",
//   is_phone_verified: true,
//   profile_image: "",
//   avatar_color: "#4A90E2",
// };

onLogin(
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5lZGlsc2hvZi5jb20iLCJlbnRpdHlfaWQiOiIiLCJleHAiOjE3NjA3MTAzODIsImlhdCI6MTc2MDEwNTU4MiwiaXNzIjoiaHR0cHM6Ly9hcGkuZWRpbHNob2YuY29tIiwibWV0YWRhdGEiOnsibmFtZSI6IlNhbXVlbCBOb2FoIiwicm9sZXMiOlsidXNlciJdfSwicm9sZSI6WyJ1c2VyIl0sInN1YiI6IjIxMmI1OTBjLTRlOTYtNGUxZi04Y2MwLWJmODIzMTE5NDQ1ZiJ9.M_mmodFqIrwQjeToeQklOZC_PLy2DYugxm37r6Oxp00cjNvYuwkXkXZkUEH7SLBFMoOOJZxyEhdZlSMijtf-CA",
  "auth"
);

useCookie("userData").value = {
  id: "212b590c-4e96-4e1f-8cc0-bf823119445f",
  name: "Samuel Noah",
  phone: "0945003939",
  alternate_phone: null,
  role: "user",
  is_phone_verified: true,
  profile_image: "",
  avatar_color: "#4DD0E1",
};
</script>
