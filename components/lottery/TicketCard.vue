<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-borderColor-light dark:border-borderColor-dark overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
    @click="openDetail"
  >
    <!-- Lottery Cover / Featured Image -->
    <div class="relative h-40 w-full overflow-hidden">
      <img
        v-if="ticket.lottery.medias?.length"
        :src="featuredMedia.url"
        :alt="ticket.lottery.lottery_id"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-light/20 to-primary-dark/20"
      >
        <span class="text-5xl">🎟️</span>
      </div>

      <!-- Ticket Status Badge -->
      <!-- <span
        class="absolute top-2 left-2 px-3 py-1 rounded-full text-sm font-semibold text-white"
        :class="statusColor"
      >
        {{ ticketStatusText }}
      </span> -->

      <!-- Ticket Number Badge -->
      <span
        class="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold bg-black/60 text-white backdrop-blur-sm"
      >
        #{{ ticket.ticket_number }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3">
      <!-- Lottery Info -->
      <div class="flex justify-between items-center">
        <h3
          class="font-bold text-textPrimary-light dark:text-textPrimary-dark line-clamp-1"
        >
          {{ ticket.lottery.lottery_id }}
        </h3>
        <span
          class="text-sm font-semibold text-primary-light dark:text-primary-dark"
        >
          {{ ticket.lottery.price_per_ticket }} ብር / ትኬት
        </span>
      </div>

      <!-- Lottery Items -->
      <div class="flex gap-2 overflow-x-auto py-1">
        <span
          v-for="item in ticket.lottery.items.slice(0, 3)"
          :key="item.id"
          class="text-xs bg-gray-100 dark:bg-gray-700 text-textPrimary-light dark:text-textPrimary-dark px-2 py-1 rounded-full whitespace-nowrap"
        >
          {{ item.title }}
        </span>
        <span
          v-if="ticket.lottery.items.length > 3"
          class="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          +{{ ticket.lottery.items.length - 3 }} እቃዎች
        </span>
      </div>

      <!-- Buyer Info -->
      <div class="flex items-center gap-3">
        <BaseAvatar
          :src="ticket.user?.profile_image"
          :name="ticket.user?.name || ticket.name"
          size="36"
        />
        <div class="flex-1">
          <p
            class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark"
          >
            {{ ticket.user?.name || ticket.name || "—" }}
          </p>
          <p
            class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
          >
            {{
              ticket.user?.phone?.replace(",", "") ||
              ticket.phone_number?.replace(",", "") ||
              "—"
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

// Compute featured media
const featuredMedia = computed(() => {
  if (props.ticket.lottery.medias?.length > 0) {
    return (
      props.ticket.lottery.medias.find((m) => m.is_featured) ||
      props.ticket.lottery.medias[0]
    );
  }
  return null;
});

// Ticket status text & color
const ticketStatusText = computed(() => {
  switch (props.ticket.status) {
    case "verified":
      return "የተረጋገጠ";
    case "pending":
      return "በመጠባበቅ ላይ";
    default:
      return "ያልተረጋገጠ";
  }
});

const statusColor = computed(() => {
  switch (props.ticket.status) {
    case "verified":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
});

const openDetail = () => {
  router.push(
    `/lotteries/${props.ticket.lottery.id}?tab=tickets&ticket_id=${props.ticket.id}`
  );
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
