<template>
  <div
    @click="navigateToCreator"
    class="cursor-pointer rounded-xl border border-gray-200 bg-white dark:bg-slate-800 shadow-lg p-4 lg:p-6 hover:shadow-xl transition"
  >
    <!-- Header: Title + Like button -->
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-bold text-black dark:text-white">
        የዕጣው ባለቤት መረጃ
      </h2>
      <!-- <CreatorLikeWidget :creator="user" /> -->
      <Icon name="mdi:heart" class="w-6 h-6 text-red-500" />
    </div>

    <div class="flex items-center gap-4">
      <!-- Avatar Component -->
      <BaseAvatar
        :name="user.name"
        :avatar_color="user?.avatar_color"
        :avatar_image="user?.profile_image"
        :size="34"
      />

      <div class="flex-1">
        <!-- Name + verification -->
        <div class="flex items-center gap-1 mb-1">
          <span class="text-lg font-bold text-black dark:text-white truncate">
            {{ user.name }}
          </span>
          <svg
            v-if="true"
            class="w-4 h-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
            />
          </svg>
        </div>

        <!-- Phone numbers -->
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {{ user.phone
          }}{{ user.alternate_phone ? " / " + user.alternate_phone : "" }}
        </p>

        <!-- Lotteries count and rating -->
        <div class="flex items-center gap-3">
          <!-- Lotteries count -->
          <div
            class="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-600 text-xs font-semibold"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M20 2H4C2.897 2 2 2.897 2 4V20C2 21.103 2.897 22 4 22H20C21.103 22 22 21.103 22 20V4C22 2.897 21.103 2 20 2ZM20 20H4V4H20V20Z"
              />
            </svg>
            {{ user.number_of_lotteries }} ዕጣዎች
          </div>

          <!-- Rating -->
          <div
            class="flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 text-orange-600 text-xs font-semibold"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.416 8.262L12 18.897l-7.416 4.635L6 15.27 0 9.423l8.332-1.268z"
              />
            </svg>
            {{ user.rating }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: { type: Object, required: true },
});

const router = useRouter();

function navigateToCreator() {
  // remove the query params from the current route
  const currentRoute = router.currentRoute.value;
  const { tab, ...rest } = currentRoute.query;
  router.push(
    `/creators/${props.user.id}?from=${
      router.currentRoute.value.fullPath
    }&${Object.entries(rest)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`
  );
}
</script>

<style scoped>
/* optional: add hover effect if desired */
</style>
