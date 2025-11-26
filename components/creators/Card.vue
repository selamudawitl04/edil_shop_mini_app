<template>
  <div
    @click="navigateToCreator"
    class="cursor-pointer rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-5 hover:-translate-y-0.5"
  >
    <div class="flex items-center gap-4">
      <!-- Avatar -->
      <div class="relative shrink-0">
        <BaseAvatar
          :name="user.name"
          :avatar_color="user.avatar_color"
          :avatar_image="user.profile_image"
          :size="56"
        />
        <!-- <span
          class="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"
        ></span> -->
      </div>

      <!-- Info Section -->
      <div class="flex-1 min-w-0">
        <!-- Name + Verified -->
        <div class="flex items-center gap-1 mb-1">
          <p
            class="font-semibold text-lg text-gray-900 dark:text-gray-50 truncate"
          >
            {{ user.name }}
          </p>
          <Icon
            v-if="user.verified"
            name="mdi:check-decagram"
            class="text-blue-500 text-base"
          />
        </div>

        <!-- Phone numbers -->
        <div
          v-if="user.phone"
          class="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1"
        >
          <div class="flex items-center">
            <Icon :name="icon" class="text-gray-400 text-xs mr-1.5" />
            <span>{{ formatPhoneNumber(user.phone) }}</span>
          </div>
          <div class="flex items-center">
            <Icon :name="icon" class="text-gray-400 text-xs mr-1.5" />
            <span>{{ formatPhoneNumber(user.alternate_phone) }}</span>
          </div>
        </div>

        <!-- 📊 Stats / Actions -->
        <div class="flex flex-wrap items-center gap-2 mt-3">
          <!-- Lottery count -->
          <!-- <div
          class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium text-xs hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-all"
        >
          <Icon
            name="mdi:ticket-confirmation"
            class="text-blue-600 dark:text-blue-400 text-sm"
          />
          <span>{{ user.number_of_lotteries }} እጣዎች</span>
        </div> -->
        </div>
      </div>

      <!-- Like Button -->
      <CreatorsLike :creator="user" button-type="button" />
    </div>

    <div class="flex items-center gap-2 w-full justify-end">
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

    <!-- ✅ Added View Detail Button -->
    <div class="mt-4">
      <BaseButton
        @click.stop="navigateToCreator"
        :full="true"
        size="md"
        class="bg-blue-600 hover:bg-blue-700 text-white"
      >
        🔍 ዝርዝር ይመልከቱ
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useCreatorStore } from "@/stores/creator";

// 🧩 Props
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

// 🧠 Store
const creatorStore = useCreatorStore();

// 🚀 Navigate to creator page
function navigateToCreator() {
  creatorStore.openCreator(props.user.id);
}

// 📞 Format phone numbers (e.g., 2519... → 09...)
function formatPhoneNumber(phone) {
  return phone?.length === 12 && phone.startsWith("251")
    ? phone.replace(/^251/, "0")
    : phone;
}

function openUrl(url) {
  window.open(url, "_blank");
}
</script>
