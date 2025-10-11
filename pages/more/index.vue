<template>
  <NuxtLayout name="app">
    <!-- Fixed App Bar -->
    <div
      class="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden bg-white shadow-sm"
    >
      <h1 class="text-2xl font-bold text-center py-2">ተጨማሪ</h1>
    </div>

    <div class="h-12"></div>

    <div class="m-3 bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- ------------------- User Info ------------------- -->
      <div class="flex items-center px-5 py-5 border-b border-gray-100">
        <!-- Avatar -->
        <div
          class="relative w-14 h-14 rounded-full flex items-center justify-center bg-blue-50"
        >
          <BaseAvatar
            :name="user?.name"
            :avatar_color="user?.avatar_color || 'blue'"
            :avatar_image="user?.profile_image"
            :size="56"
          />
        </div>

        <!-- Info -->
        <div class="flex flex-col ml-4 min-w-0">
          <p class="text-lg font-semibold text-gray-900 truncate">
            {{ user?.name || "Guest User" }}
          </p>
          <p class="text-sm text-gray-500 truncate">
            {{ user?.phone || "No phone number" }}
          </p>
        </div>

        <!-- Update Profile -->
        <button
          @click="openUpdateNameDialog = true"
          class="ml-auto flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md border-primary-light border text-primary-light"
        >
          <Icon
            name="mdi:pencil-outline"
            class="text-primary-light"
            size="18"
          />
          <span class="text-sm text-primary-light">Edit</span>
        </button>
      </div>

      <!-- ------------------- Menu Items ------------------- -->
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="cursor-pointer transition hover:bg-gray-50"
        @click="navigate(item.route)"
      >
        <div class="flex items-center p-4">
          <!-- Icon -->
          <div
            class="p-3 rounded-xl flex items-center justify-center"
            :class="item.bgColor"
          >
            <Icon :name="item.icon" class="text-blue-600 text-lg" />
          </div>

          <!-- Text -->
          <div class="flex-1 ml-4">
            <p class="text-base font-semibold text-gray-900">
              {{ item.title }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ item.subtitle }}
            </p>
          </div>

          <!-- Arrow -->
          <Icon
            name="mdi:chevron-right"
            class="text-gray-400 text-sm"
            size="26"
          />
        </div>

        <!-- Divider -->
        <div
          v-if="index < menuItems.length - 1"
          class="mx-5 border-t border-gray-100"
        ></div>
      </div>
    </div>

    <MoreUpdateName v-model="openUpdateNameDialog" />
  </NuxtLayout>
</template>

<script setup>
import { useRouter } from "vue-router";

const user = useCookie("userData");
const router = useRouter();

const openUpdateNameDialog = ref(false);

const menuItems = [
  {
    icon: "mdi:check-decagram",
    title: "እጣ አዎጣጥ",
    subtitle: "እጣ እንዴት እንደምዎጣ ለማወቅ",
    route: "/how-winner-known",
    bgColor: "bg-blue-100",
  },
  {
    icon: "mdi:ticket-percent-outline",
    title: "የእጣ ትኬት መግዛት",
    subtitle: "የእጣ ትኬት እንዴት ምገዛ ለማወቅ",
    route: "/how-buy-ticket",
    bgColor: "bg-blue-100",
  },
  {
    icon: "mdi:phone",
    title: "እኛን ለማግኘት",
    subtitle: "እኛን ለመከታተል እና ለማግኘት",
    route: "/contact-us",
    bgColor: "bg-blue-100",
  },
];

const navigate = (path) => {
  router.push(path);
};
</script>

<style scoped>
.shadow-sm {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
}
</style>
