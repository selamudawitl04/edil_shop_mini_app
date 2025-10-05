<script setup>
import { ref, computed } from "vue";
import { useShareStore } from "@/stores/share";
const shareStore = useShareStore();

const showSidebar = ref(false);

const userData = useCookie("userData");

const userInitials = computed(() => {
  if (userData.value) {
    const fullName = userData.value.full_name || "";
    const [first = "", last = ""] = fullName.split(" ");
    const firstInitial = first.charAt(0).toUpperCase();
    const lastInitial = last.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
  return "";
});

const navLinks = [
  { name: "Home", path: "/", icon: "mdi:home-outline" },
  { name: "Prayer Requests", path: "/prayer-requests", icon: "mdi:hands-pray" },


  {
    name: "Testmonies",
    path: "/testmonies",
    icon: "mdi:comment-quote-outline",
  },
  {
    name: "Devotions",
    path: "/devotions",
    icon: "mdi:book-open-variant",
  },

  {
    name: "Summit Prayer Requests",
    path: "/summit-prayer-requests",
    icon: "mdi:account-group-outline",
  },

  { name: "Today", path: "/", icon: "mdi:account-plus-outline" },
  { name: "About", path: "/about", icon: "mdi:information-outline" },
];

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
    name: "My Communities",
    icon: "mdi:bookmark-outline",
    href: "/user/communities",
  },
  {
    name: "Prayed Requests",
    icon: "mdi:hand-heart-outline",
    href: "/user/prayed-requests",
  },
  { name: "Logout", icon: "mdi:logout", href: "/auth/logout" },
]);

const openCheckPrayerDialog = ref(false);
</script>

<template>
  <header
    class="fixed top-0 z-[100] w-full max-w-[3000px] mx-auto bg-card-light dark:bg-card-dark lg:border-b lg:border-borderColor-light dark:border-borderColor-dark iphone5:px-4 samsg:px-5 md:px-8 xl:px-12 2xl:px-[100px] iphone5:h-[80px] lg:h-[90px] flex flex-col justify-center">
    <div class="flex items-center justify-between iphone5:py-2 lg:py-5">
      <!-- Logo -->
      <NuxtLink to="/" class="text-xl font-bold text-textPrimary-light dark:text-textPrimary-dark">
        <h1>Entsely</h1>
      </NuxtLink>

      <!-- Navigation Links (Desktop) -->
      <nav class="hidden lg:flex items-center space-x-6">
        <ul class="flex items-center space-x-6">
          <li v-for="(link, index) in navLinks" :key="index"
            class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark hover:text-primary-light dark:hover:text-primary-dark">
            <NuxtLink active-class="text-primary-light dark:text-primary-dark" :to="link.path">{{ link.name }}
            </NuxtLink>
          </li>

          <!-- ---------------Check Prayer Request-------- -->

          <button @click="openCheckPrayerDialog = true"
            class="hidden lg:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition">
            Check Prayer Request
          </button>

        </ul>
      </nav>

      <!-- Right section -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Theme Switcher -->
        <Base-ThemeSwitcher />

        <!-- Auth (Desktop) -->

        <template v-if="userData">
          <HeadlessPopover class="relative hidden lg:inline-block text-left">
            <HeadlessPopoverButton class="transition">
              <BaseAvatar :avatar_image="userData.profile_image" :name="userData.full_name"
                :avatar_color="userData.avatar_color" class="w-10 h-10 rounded-full" />
            </HeadlessPopoverButton>

            <HeadlessPopoverPanel
              class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50">
              <LayoutUser />
            </HeadlessPopoverPanel>
          </HeadlessPopover>
        </template>

        <template v-else>
          <NuxtLink to="/auth/login"
            class="hidden lg:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition">
            Login
          </NuxtLink>
        </template>

        <!-- Mobile menu button -->

        <button
          class="lg:hidden p-2 rounded-md text-textPrimary-light dark:text-textPrimary-dark hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition"
          @click="showSidebar = !showSidebar" aria-label="Toggle mobile menu" aria-expanded="false">
          <Icon name="heroicons:bars-3-solid" class="text-2xl" />
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Sidebar -->
  <BaseSidebar v-model="showSidebar">
    <template #Heading> Menu </template>

    <template #Content>
      <nav class="flex-1 px-4 py-6 overflow-y-auto">
        <ul class="space-y-4">
          <!-- Public links -->
          <li v-for="(link, index) in navLinks" :key="'public-' + index"
            class="flex items-center space-x-3 py-1 px-2 rounded-md transition hover:bg-primary-light/10 dark:hover:bg-primary-dark/10">
            <Icon :name="link.icon" class="w-5 h-5 text-primary-light dark:text-primary-dark" />
            <NuxtLink :to="link.path" active-class="text-primary-light dark:text-primary-dark font-semibold"
              class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark transition-colors"
              @click="showSidebar = false">
              {{ link.name }}
            </NuxtLink>
          </li>

          <!-- User-only links -->
          <template v-if="userData && userNavItems.length">
            <li
              class="mt-6 text-xs uppercase tracking-wide text-textSecondary-light dark:text-textSecondary-dark font-semibold px-1">
              Your Account
            </li>
            <li v-for="(item, index) in userNavItems" :key="'user-' + index"
              class="flex items-center space-x-3 py-1 px-2 rounded-md transition hover:bg-primary-light/10 dark:hover:bg-primary-dark/10">
              <Icon :name="item.icon" class="w-5 h-5 text-primary-light dark:text-primary-dark" />
              <NuxtLink :to="item.href" active-class="text-primary-light dark:text-primary-dark font-semibold"
                class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark transition-colors"
                @click="showSidebar = false">
                {{ item.name }}
              </NuxtLink>
            </li>
          </template>

          <li v-else
            class="flex items-center space-x-3 py-1 px-2 rounded-md transition hover:bg-primary-light/10 dark:hover:bg-primary-dark/10">
            <NuxtLink to="/auth/login" class="w-full" @click="showSidebar = false">
              <BaseButton> Login </BaseButton>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </template>
  </BaseSidebar>

  <!-- ---_Check Prayer Request Dialog -->

  <PrayerCheckPrayerDialog v-model="openCheckPrayerDialog" />
</template>

<style scoped></style>
