<template>
  <div
    class="p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-200 mb-3 cursor-pointer"
    @click="handleClick"
  >
    <!-- Top Row: Icon + Title + Delete -->
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center"
          :style="{ backgroundColor: notificationColor + '1A' }"
        >
          <Icon
            :name="notificationIcon"
            :style="{ color: notificationColor }"
            size="20"
          />
        </div>

        <!-- Title + Time -->
        <div class="flex flex-col flex-1">
          <div class="flex flex-col">
            <h3 class="text-base font-semibold text-gray-900">
              {{ notificationTitle }}
            </h3>
            <span class="text-xs text-gray-500">{{ formattedTime }}</span>
          </div>
        </div>
      </div>

      <!-- Delete button -->
      <button
        @click.stop="deleteNotification"
        class="p-2 rounded-md bg-red-50 hover:bg-red-100 transition-colors"
      >
        <Icon name="mdi:delete-outline" class="text-red-600 text-sm" />
      </button>
    </div>

    <!-- Notification Content -->
    <p class="text-sm text-gray-700 mt-3 leading-relaxed">
      {{ notification.content }}
    </p>

    <!-- Type badge -->
    <div
      class="inline-block mt-3 px-2 py-1 rounded-md text-[11px] font-semibold"
      :style="{
        backgroundColor: notificationColor + '1A',
        color: notificationColor,
      }"
    >
      {{ notificationTypeText }}
    </div>
  </div>

  <NotificationDeleteDialog
    v-model="openDeleteDialog"
    :notification="notification"
    @deleteDone="emit('deleteDone')"
  />
</template>

<script setup>
// Props
const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
  onDelete: Function,
});
const emit = defineEmits(["deleteDone"]);

const router = useRouter();

// --- Helpers ---
const notificationColor = computed(() => {
  switch (props.notification.type) {
    case "win":
      return "#16A34A"; // green-600
    case "ticket_verified":
      return "#2563EB"; // blue-600
    case "ticket_rejected":
      return "#EA580C"; // orange-600
    default:
      return "#6B7280"; // gray-500
  }
});

const notificationIcon = computed(() => {
  switch (props.notification.type) {
    case "win":
      return "material-symbols:emoji-events";
    case "ticket_verified":
      return "mdi:check-decagram";
    case "ticket_rejected":
      return "mdi:alert-circle-outline";
    default:
      return "mdi:bell-outline";
  }
});

const notificationTitle = computed(() => {
  switch (props.notification.type) {
    case "win":
      return "እንኳን ደስ አለዎት!";
    case "ticket_verified":
      return "ትኬት ተረጋግጧል";
    case "ticket_rejected":
      return "ትኬት አልተረጋገጠም";
    default:
      return "ማስታወቂያ";
  }
});

const notificationTypeText = computed(() => {
  switch (props.notification.type) {
    case "win":
      return "ድል";
    case "ticket_verified":
      return "ተረጋግጧል";
    case "ticket_rejected":
      return "አልተረጋገጠም";
    default:
      return "ማስታወቂያ";
  }
});

const formattedTime = computed(() => {
  const date = new Date(props.notification.createdAt);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} ቀን በፊት`;
  if (diffHours > 0) return `${diffHours} ሰዓት በፊት`;
  if (diffMins > 0) return `${diffMins} ደቂቃ በፊት`;
  return "አሁን";
});

// --- Actions ---
const handleClick = () => {
  const payload = props.notification.payload;
  const lotteryId = payload?.lotteryId?.toString();

  if (
    lotteryId &&
    ["ticket_rejected", "ticket_verified", "win"].includes(
      props.notification.type
    )
  ) {
    router.push(`/lotteries/${lotteryId}?tab=overview`);
  }
};

const openDeleteDialog = ref(false);
const deleteNotification = async () => {
  openDeleteDialog.value = true;
};
</script>
