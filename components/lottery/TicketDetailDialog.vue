<script setup>
import { ref, computed } from "vue";

// Props
const props = defineProps({
  modelValue: Boolean,
  ticket: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// --- Mask phone number (like in Dart) ---
function maskPhoneNumber(phone) {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, ""); // only digits
  if (digits.length < 6) return phone;
  const masked = `${digits.slice(0, 4)}${"*".repeat(
    digits.length - 6
  )}${digits.slice(-2)}`;
  return masked;
}

// Computed masked phone
const maskedPhone = computed(() => {
  const phone =
    props.ticket.user?.phone?.replace(/^251/, "0") ||
    props.ticket.phone_number?.replace(/^251/, "0") ||
    "";
  return maskPhoneNumber(phone);
});

// Ticket number
const ticketNumber = computed(() => props.ticket.ticket_number || "—");

// --- Ticket status ---
const statusLabel = computed(() => {
  switch (props.ticket.status) {
    case "verified":
      return "✅ የተረጋገጠ";
    case "pending":
      return "🕓 በመጠባበቅ ላይ";
    case "rejected":
      return "❌ ያልተረጋገጠ";
    default:
      return "—";
  }
});

const statusClass = computed(() => {
  switch (props.ticket.status) {
    case "verified":
      return "bg-green-100 text-green-700 border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
});
</script>

<template>
  <BaseDialog v-model="open" title="የትኬት ዝርዝር" bodyClass="max-w-xl">
    <template #content>
      <!-- Sheet Container -->
      <div
        class="w-full max-w-md bg-white rounded-t-2xl shadow-lg p-6 animate-slide-up"
      >
        <!-- Title -->
        <h2 class="text-xl font-bold text-center text-blue-600 mb-4">
          ትኬት #{{ ticketNumber }}
        </h2>

        <!-- Ticket Status -->
        <div v-if="ticket.status == 'pending'" class="flex justify-center mb-6">
          <span
            class="px-4 py-1.5 text-sm font-medium rounded-full border"
            :class="statusClass"
          >
            {{ statusLabel }}
          </span>
        </div>

        <!-- Owner Info -->
        <div class="text-center space-y-2">
          <p class="text-gray-500 text-sm">የገዢው ስልክ ቁጥር</p>
          <p class="text-2xl font-bold text-blue-600">{{ maskedPhone }}</p>
        </div>

        <!-- Optional Buyer Name -->
        <!-- <div
          v-if="ticket.user?.name || ticket.name"
          class="text-center mt-4 text-gray-600 text-sm"
        >
          <p class="font-semibold">
            {{ ticket.user?.name || ticket.name }}
          </p>
        </div> -->

        <!-- Close Button -->
        <button
          @click="open = false"
          class="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition"
        >
          ዝጋ
        </button>
      </div>
    </template>
  </BaseDialog>
</template>
