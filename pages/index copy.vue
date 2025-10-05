<script setup>
const { initDataUnsafe, colorScheme, expand, close } = useTelegram();

const user = initDataUnsafe?.user || null;

const handleAuth = async () => {
  // Send initData to server API
  const res = await $fetch("/api/auth/telegram", {
    method: "POST",
    body: { initData: window?.Telegram?.WebApp?.initData },
  });
  console.log("Auth response:", res);
};
</script>

<template>
  <div
    :style="{
      background: colorScheme === 'dark' ? '#1c1c1c' : '#fff',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      minHeight: '100vh',
      padding: '20px',
    }"
  >
    <h1>🚀 Telegram Mini App</h1>

    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Name:</strong> {{ user.first_name }} {{ user.last_name }}</p>
      <p><strong>Username:</strong> @{{ user.username }}</p>
    </div>
    <div v-else>
      <p>No Telegram user found in initData.</p>
    </div>

    <button @click="expand">Expand</button>
    <button @click="close">Close</button>
    <button @click="handleAuth">Authenticate</button>
  </div>
</template>
