<script setup>
import addWinners from "@/graphql/lottery/add_winners.gql";
import updateLotteryData from "@/graphql/lottery/update_lottery_data.gql";

import { useToast } from "vue-toast-notification";

const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue", "updated"]);

const props = defineProps({
  modelValue: Boolean,
  lottery: {
    type: Object,
    required: true,
  },
});

const refetchLottery = inject("refetchLottery");

// Open state
const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

// Form for ticket numbers for each item
const form = reactive({
  winners:
    props.lottery.items?.map((item) => ({
      item_id: item.id,
      item_title: item.title,
      ticket_number: null,
      ticket_info: null,
      error: null,
    })) || [],
});

const { mutate, onDone, loading, onError } = mutator(addWinners, {
  clientId: "auth",
  showError: false,
});

// Find ticket by number
const findTicketByNumber = (ticketNumber) => {
  if (!ticketNumber || !props.lottery.tickets?.length) return null;

  const ticket = props.lottery.tickets.find(
    (ticket) => ticket.ticket_number == ticketNumber
  );

  if (ticket) {
    return ticket;
  }

  return null;
};

// Watch for ticket number changes
watch(
  () => form.winners,
  (newWinners) => {
    newWinners.forEach((winner, index) => {
      if (winner.ticket_number) {
        const ticket = findTicketByNumber(winner.ticket_number);
        if (ticket) {
          form.winners[index].ticket_info = ticket;
          form.winners[index].error = null;
        } else {
          form.winners[index].ticket_info = null;
          form.winners[index].error = "ይህ ትኬት አልተሸጠም";
        }
      } else {
        form.winners[index].ticket_info = null;
        form.winners[index].error = null;
      }
    });
  },
  { deep: true }
);

const onSubmit = handleSubmit(() => {
  // Validate all winners have valid tickets
  const hasErrors = form.winners.some(
    (winner) => winner.error || !winner.ticket_info
  );

  if (hasErrors) {
    toast.error("እባክዎ ሁሉንም ትኬቶች ያረጋግጡ", {
      position: "top-right",
    });
    return;
  }

  // Prepare winners data
  const winnersData = form.winners.map((winner) => ({
    item_id: winner.item_id,
    ticket_id: winner.ticket_info.id,
  }));

  mutate({
    input: winnersData,
  });
});

onDone(({ data }) => {
  if (data?.insert_winners?.affected_rows) {
    toast.success("አሸናፊዎች ተጨመሩ!", {
      position: "top-right",
    });

    if (typeof refetchLottery === "function") {
      refetchLottery();
    }

    open.value = false;
  } else {
    toast.error("አሸናፊዎች መጨመር አልተሳካም!", {
      position: "top-right",
    });
  }
});

onError((error) => {
  if (error.message.includes("Uniqueness violation")) {
    toast.error("የውጣ እጣ ድጋሚ ማዉጣት አይቻልም", {
      position: "top-right",
    });
  } else {
    toast.error("አሸናፊዎች መጨመር አልተሳካም", {
      position: "top-right",
    });
  }
});
</script>

<template>
  <BaseDialog v-model="open" title="🏆 አሸናፊዎች መጨመር" :autoClose="false">
    <template #content>
      <div class="max-w-4xl mx-auto">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <!-- Instructions -->
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3
              class="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-2"
            >
              📋 መመሪያዎች
            </h3>
            <p class="text-blue-700 dark:text-blue-300 text-sm">
              ለእያንዳንዱ የሎተሪ እቃ የሚያሸንፈውን ትኬት ቁጥር ያስገቡ። ትኬቱ ከተሸጠ የትኬቱ ባለቤት ይታያል።
            </p>
          </div>

          <!-- Winners Form -->
          <div class="space-y-4">
            <div
              v-for="(winner, index) in form.winners"
              :key="winner.item_id"
              class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
            >
              <!-- Item Info -->
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
                >
                  <Icon
                    :name="
                      winner.item_title.includes('iPhone')
                        ? 'mdi:cellphone'
                        : winner.item_title.includes('MacBook')
                        ? 'mdi:laptop'
                        : 'mdi:gift'
                    "
                    class="w-6 h-6 text-primary"
                  />
                </div>
                <div>
                  <h3
                    class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark"
                  >
                    {{ winner.item_title }}
                  </h3>
                  <p
                    class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                  >
                    አቀማመጥ {{ index + 1 }}
                  </p>
                </div>
              </div>

              <!-- Ticket Number Input -->
              <div class="mb-4">
                <BaseInput
                  v-model="winner.ticket_number"
                  :label="`የ${winner.item_title} አሸናፊ ትኬት ቁጥር`"
                  placeholder="ትኬት ቁጥር ያስገቡ (ምሳሌ: 1, 25, 100)"
                  type="number"
                  :rules="'required'"
                  :name="`ticket_number_${index}`"
                />
              </div>

              <!-- Ticket Info Display -->
              <div
                v-if="winner.ticket_info"
                class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
              >
                <h4
                  class="text-sm font-semibold text-green-800 dark:text-green-400 mb-2"
                >
                  ✅ የትኬቱ ባለቤት
                </h4>
                <div class="flex items-center gap-3">
                  <BaseAvatar
                    :src="winner.ticket_info.user?.profile_image"
                    :name="
                      winner.ticket_info.user?.name || winner.ticket_info.name
                    "
                    size="40"
                  />
                  <div>
                    <p class="font-medium text-green-800 dark:text-green-400">
                      {{
                        winner.ticket_info.user?.name || winner.ticket_info.name
                      }}
                    </p>
                    <p class="text-sm text-green-600 dark:text-green-300">
                      📞
                      {{
                        winner.ticket_info.user?.phone ||
                        winner.ticket_info.phone_number
                      }}
                    </p>
                    <p class="text-xs text-green-500 dark:text-green-400">
                      ትኬት #{{ winner.ticket_info.ticket_number }} •
                      {{
                        new Date(
                          winner.ticket_info.created_at
                        ).toLocaleDateString()
                      }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Error Display -->
              <div
                v-else-if="winner.error"
                class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-500" />
                  <p class="text-red-700 dark:text-red-400 font-medium">
                    {{ winner.error }}
                  </p>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  ትኬት ቁጥር ያስገቡ የትኬቱን ባለቤት ለማየት
                </p>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3
              class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
            >
              📊 ማጠቃለያ
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">
                  {{ form.winners.length }}
                </div>
                <div
                  class="text-textSecondary-light dark:text-textSecondary-dark"
                >
                  ጠቅላላ እቃዎች
                </div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">
                  {{ form.winners.filter((w) => w.ticket_info).length }}
                </div>
                <div
                  class="text-textSecondary-light dark:text-textSecondary-dark"
                >
                  የተመረጡ አሸናፊዎች
                </div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600">
                  {{ form.winners.filter((w) => w.error).length }}
                </div>
                <div
                  class="text-textSecondary-light dark:text-textSecondary-dark"
                >
                  ስህተቶች
                </div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-600">
                  {{
                    form.winners.filter((w) => !w.ticket_info && !w.error)
                      .length
                  }}
                </div>
                <div
                  class="text-textSecondary-light dark:text-textSecondary-dark"
                >
                  ባዶ
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            :full="true"
            size="lg"
            :loading="loading"
            :disabled="
              loading || form.winners.some((w) => w.error || !w.ticket_info)
            "
            class="bg-green-600 hover:bg-green-700 text-white"
          >
            🏆 አሸናፊዎች መጨመር
          </BaseButton>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>
