<template>
  <div
    @click="navigateToCreator"
    class="cursor-pointer rounded-2xl border border-gray-100 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-5 flex items-center gap-4"
  >
    <!-- Avatar with online dot -->
    <div class="relative shrink-0">
      <BaseAvatar
        :name="user.name"
        :avatar_color="user.avatar_color"
        :avatar_image="user.profile_image"
        :size="56"
      />
      <span
        class="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
      ></span>
    </div>

    <!-- Main content -->
    <div class="flex-1 min-w-0">
      <!-- Name + verified -->
      <div class="flex items-center gap-1 mb-1">
        <p
          class="font-semibold text-lg text-gray-900 dark:text-gray-50 truncate"
        >
          {{ user.name }}
        </p>
        <Icon name="mdi:check-decagram" class="text-blue-500 text-base" />
      </div>

      <!-- 📞 Phone numbers -->
      <div
        v-if="user.phone"
        class="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1"
      >
        <!-- Main phone -->
        <div class="flex items-center">
          <Icon name="mdi:phone" class="text-gray-400 text-xs mr-1.5" />
          <span>{{ user.phone }}</span>
        </div>

        <!-- Alternate phone -->
        <div v-if="user.alternate_phone" class="flex items-center">
          <Icon name="mdi:cellphone" class="text-gray-400 text-xs mr-1.5" />
          <span>{{ user.alternate_phone }}</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-3 mt-3">
        <!-- Lottery count -->
        <div
          class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold"
        >
          <Icon name="mdi:ticket-confirmation" class="text-blue-600 text-sm" />
          {{ user.number_of_lotteries }} ዕጣዎች
        </div>

        <!-- Rating -->
        <div
          class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 text-xs font-semibold"
        >
          <Icon name="mdi:star" class="text-orange-500 text-sm" />
          {{ user.rating }}
        </div>
      </div>
    </div>

    <!-- Like button slot (optional) -->
    <CreatorsLike
      :creator="user"
      button-type="button"
      @updated="handleLikeUpdate"
    />
  </div>
</template>

<script setup>
import { useCreatorStore } from "@/stores/creator";

const creatorStore = useCreatorStore();

const props = defineProps({
  user: { type: Object, required: true },
});

function navigateToCreator() {
  creatorStore.openCreator(props.user.id);
}

const handleLikeUpdate = () => {
  console.log("Like updated");
};
</script>

<style scoped>
/* Smooth hover lift effect */
div:hover {
  transform: translateY(-2px);
}
</style>
