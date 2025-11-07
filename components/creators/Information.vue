<template>
  <div class="py-4 px-3">
    <!-- ------------Name and Stastistics section -->

    <div class="space-y-3 flex flex-col items-center mb-6 shadow-md pb-5">
      <!-- Avatar with online dot -->
      <div class="relative shrink-0">
        <BaseAvatar
          :name="user.name"
          :avatar_color="user.avatar_color"
          :avatar_image="user.profile_image"
          :size="80"
        />
        <span
          class="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
        ></span>
      </div>
      <div class="flex flex-col items-center">
        <p class="text-lg font-bold text-black">{{ user.name }}</p>
      </div>

      <!-- ------------Statistics section -->
      <div class="flex items-center justify-between w-full max-w-[200px]">
        <!-- total lotteries -->
        <div class="flex flex-col items-center">
          <p class="text-lg font-bold text-black">
            {{ user.number_of_lotteries }}
          </p>
          <p class="text-sm text-gray-500">እጣዎች</p>
        </div>

        <!-- Rating -->
        <!-- <div class="flex flex-col items-center">
          <p class="text-lg font-bold text-black">
            {{ user.rating }}
          </p>
          <p class="text-sm text-gray-500">ደረጃ</p>
        </div> -->

        <!-- likes -->
        <div class="flex flex-col items-center">
          <p class="text-lg font-bold text-black">
            {{ user.total_likes }}
          </p>
          <p class="text-sm text-gray-500">መዉደድ</p>
        </div>

        <!-- total tickets -->
      </div>

      <div class="flex items-center gap-2 w-full justify-center">
        <!-- Follow TikTok -->
        <button
          v-if="user.tiktok_url"
          @click.stop="openUrl(user.tiktok_url)"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <Icon name="ic:baseline-tiktok" class="text-sm" />
          <span>Follow TikTok</span>
        </button>

        <!-- Join Telegram -->
        <button
          v-if="user.telegram_url"
          @click.stop="openUrl(user.telegram_url)"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 text-white text-xs font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <Icon name="mdi:telegram" class="text-sm" />
          <span>Join Telegram</span>
        </button>
      </div>
    </div>
    <!-- --------------Phone number section -->
    <div class="p-5 bg-white rounded-xl border border-gray-200">
      <!-- Title -->
      <h2 class="text-lg font-bold text-black mb-2">የአዘጋጅ መረጃ</h2>

      <div v-if="user.phone" class="flex flex-col gap-2">
        <!-- Main phone -->
        <div class="flex items-center gap-3">
          <!-- Icon with blue background -->
          <div
            class="p-2 rounded-lg bg-blue-100 flex items-center justify-center"
          >
            <Icon name="mdi:phone" class="text-blue-600 text-sm" />
          </div>
          <!-- Label + phone -->
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 font-medium">ዋና ስልክ</span>
            <span class="text-sm font-semibold text-gray-900">{{
              user.phone
            }}</span>
          </div>
        </div>

        <!-- Alternate phone -->
        <div v-if="user.alternate_phone" class="flex items-center gap-3">
          <div
            class="p-2 rounded-lg bg-blue-100 flex items-center justify-center"
          >
            <Icon name="mdi:cellphone" class="text-blue-600 text-sm" />
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 font-medium">ሌላ ስልክ</span>
            <span class="text-sm font-semibold text-gray-900">{{
              user.alternate_phone
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props for user data
const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      phone: "",
      alternatePhone: null,
    }),
  },
});

function openUrl(url) {
  window.open(url, "_blank");
}
</script>
