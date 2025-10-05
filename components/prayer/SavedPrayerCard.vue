<script setup>
import { formatDistanceToNow } from "date-fns";
import { usePrayerStore } from "@/stores/prayer";

const prayerStore = usePrayerStore();

const props = defineProps({
  prayerItem: {
    type: Object,
    required: true,
  },
});

const prayerRequest = computed(() => props.prayerItem?.prayer_request);

const prayerRequestCreatedAt = computed(() => {
  const _createdAt = new Date(prayerRequest.value?.created_at);
  if (_createdAt) {
    return formatDistanceToNow(_createdAt);
  } else {
    return "Unknown";
  }
});

// Get creator info
const avatarImage = computed(() => {
  if (props.prayerRequest?.feed?.group) {
    return prayerRequest.value?.feed?.group?.profile_image;
  } else if (prayerRequest.value?.feed?.page) {
    return prayerRequest.value?.feed?.page?.profile_image;
  } else if (prayerRequest.value?.feed?.user) {
    return prayerRequest.value?.feed?.user?.profile_image;
  } else {
    return null;
  }
});

const avatarColor = computed(() => {
  if (prayerRequest.value?.feed?.group) {
    return prayerRequest.value?.feed?.group?.avatar_color;
  } else if (prayerRequest.value?.feed?.page) {
    return prayerRequest.value?.feed?.page?.avatar_color;
  } else if (prayerRequest.value?.feed?.user) {
    return prayerRequest.value?.feed?.user?.avatar_color;
  } else {
    return null;
  }
});

const name = computed(() => {
  if (prayerRequest.value?.feed?.group) {
    return prayerRequest.value?.feed?.group?.name;
  } else if (prayerRequest.value?.feed?.page) {
    return prayerRequest.value?.feed?.page?.name;
  } else if (prayerRequest.value?.feed?.user) {
    return prayerRequest.value?.feed?.user?.full_name;
  } else {
    return "Anonymous";
  }
});

// Get status badge info
const statusInfo = computed(() => {
  const status = prayerRequest.value?.status;
  if (status === "answered") {
    return {
      text: "Answered",
      class:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    };
  }
  return {
    text: "Active",
    class: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  };
});

const showDetailDialog = () => {
  prayerStore.openPrayerRequest(prayerRequest.value?.id);
};

const openRemoveFromPrayerListDialog = ref(false);
</script>

<template>
  <PrayerRemoveFromPrayerListDialog
    v-if="openRemoveFromPrayerListDialog"
    v-model="openRemoveFromPrayerListDialog"
    :prayer-list-item="props.prayerItem"
  />

  <div
    @click="showDetailDialog"
    class="block p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm hover:scale-[1.01] border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-slate-800 hover:border-primary-light/30 dark:hover:border-primary-dark/30"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <!-- Creator Info -->
        <div v-if="prayerRequest" class="flex items-center gap-2 mb-1">
          <BaseAvatar
            :avatar_color="avatarColor"
            :name="name"
            :avatar_image="avatarImage"
          />

          <div class="flex flex-col">
            <span
              class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark capitalize"
            >
              {{ name }}
            </span>

            <span
              v-if="prayerRequest.feed?.group"
              class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
            >
              Posted by {{ prayerRequest.feed?.user?.full_name }}
            </span>

            <!-- Meta Info -->
            <div
              class="flex items-center gap-3 text-xs text-textSecondary-light dark:text-textSecondary-dark"
            >
              <span class="flex items-center gap-1">
                <Icon name="mdi:calendar" size="12" />
                {{ new Date(props.prayerItem.created_at).toLocaleDateString() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Title -->
        <h3
          class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark line-clamp-2 mb-1"
        >
          {{ prayerRequest?.title }}
        </h3>
      </div>

      <!-- Status Badges -->
      <div class="flex flex-col gap-1 items-end ml-2">
        <span
          class="text-xs px-2 py-0.5 rounded-full"
          :class="statusInfo.class"
        >
          {{ statusInfo.text }}
        </span>
      </div>
    </div>

    <!-- For Who Badge -->
    <!-- <div v-if="prayerRequest?.for_who" class="mt-2">
            <span
                class="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                🙏 For: {{ prayerRequest.for_who }}
            </span>
        </div> -->

    <!-- Footer Actions -->
    <div
      class="mt-2 pt-2 border-t border-borderColor-light dark:border-borderColor-dark"
    >
      <div class="flex items-center justify-between">
        <button
          @click.stop="showDetailDialog"
          class="text-xs text-primary-light dark:text-primary-dark hover:underline flex items-center gap-1"
        >
          <Icon name="mdi:eye" size="12" />
          View Details
        </button>

        <div class="flex items-center gap-2">
          <PrayerIPrayed :prayerRequest="prayerRequest" />

          <button
            @click.stop="openRemoveFromPrayerListDialog = true"
            class="text-xs text-red-500 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <Icon name="mdi:delete-outline" size="12" />
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
