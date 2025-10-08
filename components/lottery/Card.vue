<template>
  <div
    @click="openDetail('overview')"
    :title="`Lottery #${lottery.lottery_id}`"
    class="group flex flex-col lg:min-w-[23rem] bg-white dark:bg-slate-800 border border-borderColor-light dark:border-borderColor-dark rounded-xl shadow-lg hover:shadow-xl hover:ring-2 hover:ring-primary-light dark:hover:ring-primary-dark transition-all duration-300 overflow-hidden hover:cursor-pointer"
  >
    <!-- Featured Image Section -->
    <div class="relative h-48 overflow-hidden">
      <LotteryMedia :item="selectedItem" />

      <!-- Overlay with Status & ID -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
      >
        <div class="absolute top-3 left-3">
          <span
            class="text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm"
            :class="statusColorAndName.color"
          >
            {{ statusColorAndName.name }}
          </span>
        </div>
        <div class="absolute top-3 right-3 flex items-center gap-2">
          <span
            class="text-xs font-bold px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm"
          >
            #{{ lottery.lottery_id }}
          </span>
          <LotteryLike :lottery="lottery" />
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="flex-1 flex flex-col p-4 space-y-2">
      <!---------------Selected item and Creator  -->

      <div class="flex justify-between items-start w-full">
        <!-- Title + Category -->
        <div class="flex-1 flex flex-col">
          <h2 class="text-black font-bold text-lg line-clamp-2">
            <span v-show="lottery.items.length > 1"
              >{{ selectedItem?.order }}ኛ.</span
            >
            {{ selectedItem?.title }}
          </h2>
          <p class="text-secondary text-sm line-clamp-1">
            {{
              lottery.items.length > 0
                ? `አይነት: ${selectedItem?.category?.name}`
                : "--"
            }}
          </p>
        </div>

        <!-- User Info -->
        <div class="flex items-center ml-4 min-w-0">
          <!-- Avatar Component -->
          <BaseAvatar
            :name="lottery.user.name"
            :avatar_color="lottery.user?.avatar_color"
            :avatar_image="lottery.user?.profile_image"
            :size="34"
          />

          <div class="flex flex-col ml-2 min-w-0">
            <p class="text-secondary text-sm line-clamp-1">
              {{ lottery.user.name }}
            </p>
            <p class="text-secondary text-xs line-clamp-1">
              {{ lottery.user?.number_of_lotteries }} ዕጣዎች
            </p>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-primary-light">
            የተሸጡ ትኬቶች : {{ lottery.sold_tickets || 0 }}
          </span>
          <span
            class="text-sm font-bold text-primary-light dark:text-primary-dark"
          >
            አጠቃላይ ትኬቶች: {{ lottery.total_tickets }}
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            class="bg-gradient-to-r from-primary-light to-primary-dark h-1.5 rounded-full transition-all duration-300"
            :style="{ width: `${lotteryProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- -----------------Detail and Buy Ticket section -->

      <div class="flex justify-between items-center">
        <!-- Ticket Price -->
        <div class="flex items-center flex-1 min-w-0 justify-start">
          <Icon
            name="mdi:confirmation-number"
            class="w-4 h-4 text-primary-light mr-1.5"
          />
          <span class="font-bold text-black truncate">
            የትኬት ዋጋ: {{ lottery.price_per_ticket }}
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <!-- View Details Button -->

          <button
            @click.stop="openDetail(1)"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-light/10 dark:bg-primary-dark/10 hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 text-primary-light dark:text-primary-dark transition-colors text-sm font-medium"
          >
            <Icon name="mdi:information-outline" class="w-4 h-4" />
            ዝርዝር
          </button>

          <!-- Buy Ticket or Ticket Info -->

          <div>
            <button
              v-if="!ticket && lottery.status === 'active'"
              @click.stop="openDetail"
              class="bg-primary text-white bg-primary-light rounded-md px-4 py-1.5 text-sm font-bold hover:opacity-90 transition"
            >
              ግዛ
            </button>

            <div
              v-else-if="ticket"
              @click.stop="openDetail"
              class="cursor-pointer rounded-md px-3 py-1.5 border text-sm"
              :class="[ticketBgColor, ticketBorderColor, ticketTextColor]"
            >
              ትኬት: {{ ticket.ticket_number }}
            </div>
          </div>
        </div>
      </div>

      <!-- ------------------------Items marquee -->
      <div class="mb-4" v-if="showItems && lottery.items.length > 1">
        <BaseMarquee
          :text="
            lottery.items.map((i) => `${i.order}ኛ እጣ. ${i.title}`).join(' - ')
          "
          :duration="10"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const props = defineProps({
  lottery: {
    type: Object,
    required: true,
  },
  showItems: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    required: false,
  },
  ticket: {
    type: Object,
    required: false,
  },
});

const winnedItem = computed(() => {
  return props.lottery.items?.find(
    (item) => item.winner?.ticket?.ticket_number === props.ticket.ticket_number
  );
});

const selectedItem = computed(() => {
  if (props.lottery.items?.length) {
    if (props.lottery.status == "closed" && props.ticket) {
      if (winnedItem.value) {
        return winnedItem.value;
      }
    }

    if (props.category && props.category !== "ሁሉም") {
      return props.lottery.items.find((i) => i.category?.id === props.category);
    }
    return props.lottery.items[0];
  }
  return null;
});

const lotteryProgress = computed(() => {
  if (props.lottery.total_tickets && props.lottery.sold_tickets) {
    return Math.round(
      (props.lottery.sold_tickets / props.lottery.total_tickets) * 100
    );
  }
  return 0;
});

const openDetail = (tab = "tickets") => {
  // remove the query params from the current route
  const currentRoute = router.currentRoute.value;
  const { tab: currentTab, ...rest } = currentRoute.query;
  router.push(
    `/lotteries/${props.lottery.id}?tab=${tab}&from=${
      router.currentRoute.value.fullPath
    }&${Object.entries(rest)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`
  );
};

const statusColorAndName = computed(() => {
  switch (props.lottery.status) {
    case "active":
      return { color: "bg-green-600/90 text-white", name: "አልውጣም" };
    case "pending":
      return { color: "bg-yellow-500/90 text-white", name: "ያልተጀመረ" };
    case "closed":
      return { color: "bg-blue-500/90 text-white", name: "ዎቱዋል" };
    case "suspended":
      return { color: "bg-orange-500/90 text-white", name: "ቆሟል" };
    case "finished":
      return {
        color: "bg-purple-600/90 text-white",
        name: "ተጠናቀቀ - ማረጋገጫ በመጠባበቅ ላይ",
      };
    default:
      return { color: "bg-gray-500/90 text-white", name: "ያልታወቀ" };
  }
});

const ticketBgColor = ref("bg-transparent");
const ticketBorderColor = ref("border-transparent");
const ticketTextColor = ref("text-black");

const setTicketColors = (status) => {
  switch (status) {
    case "pending":
      ticketBgColor.value = "bg-yellow-50";
      ticketBorderColor.value = "border-yellow-300";
      ticketTextColor.value = "text-orange-800";
      break;
    case "verified":
      ticketBgColor.value = "bg-green-50";
      ticketBorderColor.value = "border-green-300";
      ticketTextColor.value = "text-green-700";
      break;
    case "rejected":
      ticketBgColor.value = "bg-red-50";
      ticketBorderColor.value = "border-red-300";
      ticketTextColor.value = "text-red-700";
      break;
    default:
      ticketBgColor.value = "bg-transparent";
      ticketBorderColor.value = "border-transparent";
      ticketTextColor.value = "text-black";
      break;
  }
};

onMounted(() => {
  if (props.ticket) {
    setTicketColors(props.ticket.status);
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
