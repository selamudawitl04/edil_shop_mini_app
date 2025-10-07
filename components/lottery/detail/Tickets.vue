<template>
  <div class="space-y-2">
    <div class="space-y-4">
      <!-- Instructions -->
      <div
        v-if="lottery.status === 'active'"
        class="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-3"
      >
        <!-- Icon -->
        <Icon
          name="carbon:touch-1"
          class="w-5 h-5 text-blue-600 flex-shrink-0"
        />

        <p class="text-blue-800 font-bold text-sm">ለመግዛት የሚፈልጉትን ትኬት ቁጥር ይንኩ</p>
      </div>
      <!-- Items / Winners Section -->
      <div v-if="lottery.status === 'closed' && lottery.items.length" class="">
        <LotteryDetailWinners :lottery="lottery" />
      </div>
    </div>
    <div class="grid grid-cols-6 gap-2">
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
        :ticket-number="selectedTicketNumber"
      />

      <!-- Owner Info Modal -->

      <LotteryTicketDetailDialog
        v-if="showOwnerModal"
        v-model="showOwnerModal"
        :ticket="selectedTicketInfo"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  lottery: { type: Object, required: true },
  showNotSold: { type: Boolean, default: false },
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
const selectedTicketNumber = ref(null);
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
    selectedTicketNumber.value = ticketNumber;
    showBuyModal.value = true;
  }
}

function getTicketClasses(ticketNumber) {
  const ticket = props.lottery.tickets.find(
    (t) => t.ticket_number === ticketNumber
  );
  let classes = "border rounded-md ";

  if (props.lottery.status === "closed") {
    if (isWinner(ticketNumber)) {
      classes += "bg-green-600 border-green-800";
    } else {
      classes += "bg-blue-600 border-blue-600";
    }
  } else {
    if (isWinner(ticketNumber)) {
      classes += "bg-green-600 border-green-800";
    } else if (ticket?.status === "verified") {
      classes += "bg-blue-600 border-blue-600";
    } else if (ticket?.status === "pending") {
      classes += "bg-orange-500 border-orange-700";
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
    (!ticket || ticket.status === null)
  ) {
    return "text-black";
  }
  return "text-white";
}
</script>
