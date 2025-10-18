<template>
  <div class="space-y-2 relative pb-36">
    <!-- Add bottom padding so content not hidden -->
    <div class="space-y-4">
      <!-- Items / Winners Section -->
      <div v-if="lottery.status === 'closed' && lottery.items.length" class="">
        <LotteryDetailWinners :lottery="lottery" />
      </div>
    </div>

    <!-- Tickets Grid -->
    <div class="grid grid-cols-6 gap-2 pb-16">
      <div
        v-for="ticketNumber in visibleTickets"
        :key="ticketNumber"
        @click="onTicketClick(ticketNumber)"
        :class="getTicketClasses(ticketNumber)"
        class="relative flex items-center justify-center rounded-md cursor-pointer select-none"
      >
        <span
          :class="getTextColor(ticketNumber)"
          class="font-bold text-sm md:text-base"
        >
          {{ ticketNumber }}
        </span>

        <!-- Winner star -->
        <svg
          v-if="isWinner(ticketNumber)"
          class="absolute top-1 right-1 w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.416 8.262L12 18.897l-7.416 4.635L6 15.27 0 9.423l8.332-1.268z"
          />
        </svg>
      </div>

      <!-- Buy Ticket Modal -->
      <LotteryAddTicketDialog
        v-if="showBuyModal"
        v-model="showBuyModal"
        :lottery="lottery"
        :ticket-numbers="_selectedTicketNumbers"
        @clearTicketNumbers="onTicketAdded"
        @ticketAdded="onTicketAdded"
      />

      <!-- Owner Info Modal -->
      <LotteryTicketDetailDialog
        v-if="showOwnerModal"
        v-model="showOwnerModal"
        :ticket="selectedTicketInfo"
      />
    </div>

    <!-- ✅ Fixed Bottom Bar -->
    <transition name="fade">
      <div
        v-if="lottery.status === 'active'"
        class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-4 z-50 shadow-lg space-y-4"
      >
        <!-- Instruction -->
        <div class="flex items-center space-x-2">
          <Icon
            name="carbon:touch-1"
            class="w-5 h-5 text-blue-600 flex-shrink-0"
          />
          <p class="text-blue-800 font-semibold text-sm md:text-base">
            ለመግዛት የሚፈልጉትን ትኬት ቁጥር ይምርጡ።
          </p>
        </div>

        <!-- Selected Tickets -->
        <transition name="fade">
          <div v-if="_selectedTicketNumbers.length" class="space-y-1">
            <p class="text-green-700 font-bold text-sm md:text-base">
              ✅ የተመረጡ ቁጥሮች:
              <span
                v-for="(value, index) in sortedSelectedTicketNumbers"
                :key="value"
                class="text-primary-light font-extrabold"
              >
                {{ value
                }}<span v-if="index < sortedSelectedTicketNumbers.length - 1"
                  >,</span
                >
              </span>
            </p>
            <p class="text-red-600 text-xs md:text-sm font-medium">
              ቁጥርን ለመተው ድጋሚ ይንኩ።
            </p>
          </div>
        </transition>
        <!-- Buy Button -->
        <transition name="fade">
          <button
            v-if="_selectedTicketNumbers.length > 0"
            class="w-full bg-primary-light hover:bg-primary text-white font-semibold rounded-xl p-4 transition duration-300 shadow-md flex flex-col items-center space-y-1"
            @click="onBuyTickets"
          >
            <span class="text-lg font-bold">
              🛒 ይግዙ ({{ _selectedTicketNumbers.length }} ትኬት)
            </span>

            <span class="text-sm opacity-90">
              አጠቃላይ ዋጋ:
              <span class="font-bold text-white">
                {{ _selectedTicketNumbers.length }} ×
                {{ lottery.price_per_ticket }} ብር =
                {{ _selectedTicketNumbers.length * lottery.price_per_ticket }}
                ብር
              </span>
            </span>
          </button>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
const emit = defineEmits(["ticketAdded"]);

const props = defineProps({
  lottery: { type: Object, required: true },
  showNotSold: { type: Boolean, default: false },
});

const _selectedTicketNumbers = ref([]);
const sortedSelectedTicketNumbers = computed(() => {
  return [..._selectedTicketNumbers.value].sort((a, b) => a - b);
});

const winnerTicketNumbers = computed(() =>
  props.lottery.items
    .map((item) => item.winner?.ticket?.ticket_number)
    .filter(Boolean)
);

const tickets = computed(() =>
  Array.from({ length: props.lottery.total_tickets }, (_, i) => i + 1)
);

const visibleTickets = computed(() => {
  if (!props.showNotSold) return tickets.value;

  return tickets.value.filter((ticketNumber) => {
    const isSold = props.lottery.tickets.some(
      (t) => t.ticket_number === ticketNumber && t.status === "verified"
    );
    const isPending = props.lottery.tickets.some(
      (t) => t.ticket_number === ticketNumber && t.status === "pending"
    );
    return !isSold && !isPending;
  });
});

// Modals
const showBuyModal = ref(false);
const showOwnerModal = ref(false);
const selectedTicketInfo = ref(null);

function isWinner(ticketNumber) {
  return (
    props.lottery.status === "closed" &&
    winnerTicketNumbers.value.includes(ticketNumber)
  );
}

function onTicketClick(ticketNumber) {
  const ticket = props.lottery.tickets.find(
    (t) => t.ticket_number === ticketNumber
  );

  const isSold = ticket?.status === "verified";
  const isPending = ticket?.status === "pending";

  if (isSold || isPending) {
    // show owner info
    selectedTicketInfo.value = ticket;
    showOwnerModal.value = true;
  } else if (props.lottery.status === "active") {
    if (_selectedTicketNumbers.value.includes(ticketNumber)) {
      _selectedTicketNumbers.value = _selectedTicketNumbers.value.filter(
        (t) => t !== ticketNumber
      );
    } else {
      _selectedTicketNumbers.value.push(ticketNumber);
    }
  }
}
const user = useCookie("userData");

function getTicketClasses(ticketNumber) {
  const ticket = props.lottery.tickets.find(
    (t) => t.ticket_number === ticketNumber
  );

  // console.log(props.lottery.tickets);
  let classes = "border rounded-md ";

  if (props.lottery.status === "closed") {
    if (isWinner(ticketNumber)) {
      classes += "bg-green-600 border-green-800";
    } else {
      classes += "bg-primary-light border-primary-light";
    }
  } else {
    if (ticket?.status === "verified") {
      classes += "bg-primary-light border-primary-light";
    }
    // ✅ Pending tickets — highlight only if belongs to current user
    else if (ticket?.status === "pending") {
      if (ticket.user_id === user.value?.id) {
        classes += "bg-yellow-400 border-yellow-600 "; // user’s own pending ticket
      } else {
        classes += "bg-primary-light border-primary-light "; // other users’ pending
      }
    } else if (_selectedTicketNumbers.value.includes(ticketNumber)) {
      classes += "bg-green-600 border-green-800";
    } else {
      classes += "bg-gray-200 border-gray-400";
    }
  }

  return classes + " w-full h-12 md:h-16";
}

function getTextColor(ticketNumber) {
  const ticket = props.lottery.tickets.find(
    (t) => t.ticket_number === ticketNumber
  );
  if (
    props.lottery.status !== "closed" &&
    (!ticket || ticket.status == null || ticket.status == "rejected") &&
    !_selectedTicketNumbers.value.includes(ticketNumber)
  ) {
    return "text-black";
  }
  return "text-white";
}

function onBuyTickets() {
  if (_selectedTicketNumbers.value.length === 0) {
    return;
  }
  selectedTicketInfo.value = 90;
  showBuyModal.value = true;
}
function onTicketAdded() {
  _selectedTicketNumbers.value = [];
  emit("ticketAdded");
}
</script>
