<template>
  <aside
    class="hidden lg:block w-[17rem] sticky top-24 self-start space-y-6"
    role="complementary"
  >
    <!-- Navigation card with avatar inside -->
    <div
      class="rounded-xl shadow bg-card-light dark:bg-card-dark border border-borderColor-light dark:border-borderColor-dark p-4 space-y-6"
    >
      <!-- Avatar upload (moved inside the card) -->
      <div class="flex justify-center">
        <MediaUploadAvatar v-model="profileImage" />
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <NuxtLink
          v-for="item in userNavItems"
          :key="item.name"
          :to="item.href"
          class="flex items-center gap-3 px-3 py-2 rounded-md transition font-medium text-sm text-textPrimary-light dark:text-textPrimary-dark hover:bg-primary-light/10"
          active-class="bg-primary-light/10 font-semibold text-primary-light dark:text-primary-dark"
          :aria-current="$route.path === item.href ? 'page' : null"
        >
          <Icon
            :name="item.icon"
            class="w-5 h-5 text-primary-light dark:text-primary-dark"
          />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>
    </div>
  </aside>
</template>

<script setup>
const user = useCookie("userData");
const profileImage = ref(user.value.profile_image);

const userNavItems = ref([
  {
    name: "Profile",
    icon: "mdi:account-circle-outline",
    href: "/user/profile",
  },

  {
    name: "Dashboard",
    icon: "mdi:view-dashboard-outline",
    href: "/user/dashboard",
  },
  {
    name: "My Prayer Requests",
    icon: "mdi:book-open-variant",
    href: "/user/my-requests",
  },

  {
    name: "Saved Requests",
    icon: "mdi:bookmark-outline",
    href: "/user/saved-requests",
  },
  {
    name: "Prayed Requests",
    icon: "mdi:hand-heart-outline",
    href: "/user/prayed-requests",
  },

  {
    name: "My Communities",
    icon: "mdi:bookmark-outline",
    href: "/user/communities",
  },
  {
    name: "Logout",
    icon: "mdi:logout",
    href: "/auth/logout",
  },
]);
</script>
