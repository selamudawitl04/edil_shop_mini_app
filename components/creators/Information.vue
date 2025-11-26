<template>
  <div class="py-4 px-3">
    <!-- ======= Cover Image Section (Like Facebook) ======= -->
    <div class="relative w-full rounded-xl mb-16">
      <!-- Inner wrapper with rounded corners -->
      <div class="h-40 w-full rounded-xl overflow-hidden">
        <!-- If cover image exists -->
        <img
          v-if="user.cover_image"
          :src="user.cover_image"
          alt="Cover Image"
          class="w-full h-full object-cover"
        />

        <!-- If no cover image, show background color -->
        <div
          v-else
          class="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600"
        ></div>
      </div>

      <!-- Avatar positioned like Facebook -->
      <div class="absolute -bottom-10 left-1/2 -translate-x-1/2">
        <div class="relative">
          <BaseAvatar
            :name="user.name"
            :avatar_color="user.avatar_color"
            :avatar_image="user.profile_image"
            :size="90"
          />
          <!-- online status dot -->
          <!-- <span
            class="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
          ></span> -->
        </div>
      </div>
    </div>

    <!-- ======= Profile Name + Stats ======= -->
    <div class="flex flex-col items-center gap-4 mb-6">
      <!-- Name -->
      <p class="text-xl font-bold text-gray-900">{{ user.name }}</p>

      <!-- Stats -->
      <div class="flex items-center gap-10">
        <!-- lotteries -->
        <div class="flex flex-col items-center">
          <p class="text-2xl font-bold text-gray-900">
            {{ user.number_of_lotteries }}
          </p>
          <p class="text-sm text-gray-500">እጣዎች</p>
        </div>

        <!-- likes -->
        <div class="flex flex-col items-center">
          <p class="text-2xl font-bold text-gray-900">
            {{ user.total_likes }}
          </p>
          <p class="text-sm text-gray-500">Likes</p>
        </div>
      </div>

      <!-- Social Buttons -->
      <div class="flex items-center gap-3 mt-2">
        <!-- TikTok -->
        <button
          v-if="user.tiktok_url"
          @click.stop="openUrl(user.tiktok_url)"
          class="flex items-center gap-1 px-4 py-2 rounded-full bg-black text-white text-xs font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <Icon name="ic:baseline-tiktok" class="text-sm" />
          <span>Follow</span>
        </button>

        <!-- Telegram -->
        <button
          v-if="user.telegram_url"
          @click.stop="openUrl(user.telegram_url)"
          class="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <Icon name="mdi:telegram" class="text-sm" />
          <span>Join</span>
        </button>
      </div>
    </div>

    <!-- ======= Phone Section ======= -->
    <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <h2 class="text-lg font-bold text-gray-900 mb-4">የአዘጋጅ መረጃ</h2>

      <div class="flex flex-col gap-4">
        <!-- Main Phone -->
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-xl bg-blue-100 flex items-center justify-center"
          >
            <Icon name="mdi:phone" class="text-blue-600 text-base" />
          </div>

          <div class="flex flex-col">
            <span class="text-xs text-gray-500">ዋና ስልክ</span>
            <span class="text-sm font-semibold text-gray-900">{{
              user.phone
            }}</span>
          </div>
        </div>

        <!-- Alternate phone -->
        <div v-if="user.alternate_phone" class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-xl bg-blue-100 flex items-center justify-center"
          >
            <Icon name="mdi:cellphone" class="text-blue-600 text-base" />
          </div>

          <div class="flex flex-col">
            <span class="text-xs text-gray-500">ሌላ ስልክ</span>
            <span class="text-sm font-semibold text-gray-900">
              {{ user.alternate_phone }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <CreatorsTiktokVideos :user="user" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      phone: "",
      alternate_phone: null,
      cover_image: null,
    }),
  },
});

function openUrl(url) {
  window.open(url, "_blank");
}
</script>
