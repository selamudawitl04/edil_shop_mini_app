<script setup>
import buyTicket from "@/graphql/lottery/buy_ticket.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue", "updated"]);

const props = defineProps({
  modelValue: Boolean,
  ticketNumber: {
    type: Number,
    required: true,
  },
  lottery: {
    type: Object,
    required: true,
  },
});

const refetchLottery = inject("refetchLottery");
const refetchLotteries = inject("refetchLotteries");

// Open state
const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const form = reactive({
  payment_option: null,
  payment_url: null,
});

const { mutate, onDone, loading, onError } = mutator(buyTicket, {
  clientId: "auth",
  showError: false,
});

// Submit handler
const onSubmit = handleSubmit(() => {
  const input = {
    ticket_number: props.ticketNumber,
    lottery_id: props.lottery.id,
    lottery_payment_option_id: form.payment_option.id,
  };

  mutate({ input });
});

onDone(({ data }) => {
  if (data?.insert_tickets_one?.id) {
    toast.success("ትኬት በተሳካ ሁኔታ ተገዝቷል! ክፊያዎ ስረጋገጥ መዕለክት ይደርሶታል");

    if (typeof refetchLotteries === "function") refetchLotteries();
    if (typeof refetchLottery === "function") refetchLottery();

    open.value = false;
  } else {
    toast.error("ትኬት መመዝገብ አልተሳካም!");
  }
});

onError((error) => {
  if (error.message.includes("Uniqueness violation")) {
    toast.error("ይህን ትኬት ሌላ ሰው ገዝቷል።");
  } else {
    toast.error(error.message);
  }
});
</script>

<template>
  <BaseDialog v-model="open" :autoClose="false" bodyClass="max-w-lg">
    <!-- Heading -->
    <template #heading>
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <!-- Left: Title -->
        <div class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-blue-600 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M4 6a2 2 0 012-2h12a2 2 0 012 2v3a1 1 0 01-1 1h-1v4h1a1 1 0 011 1v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3a1 1 0 011-1h1v-4H5a1 1 0 01-1-1V6zm8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          <span class="text-lg font-bold">ትኬት ይግዙ</span>
        </div>

        <!-- Right: Action Buttons -->
        <div class="flex items-center gap-2">
          <!-- Buy Ticket -->
          <BaseButton
            type="submit"
            size="sm"
            :loading="loading"
            :disabled="loading || !form.payment_option || !form.payment_url"
            class="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
            @click="onSubmit"
          >
            ✅ ይግዙ
          </BaseButton>

          <!-- Close -->
          <BaseButton
            type="button"
            size="sm"
            class="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap"
            @click="open = false"
          >
            ✖ ዝጋ
          </BaseButton>
        </div>
      </div>
    </template>

    <!-- Body -->
    <template #content>
      <div class="max-w-lg mx-auto">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <!-- Lottery Info -->
          <div
            class="bg-white dark:bg-slate-800 rounded-xl p-4 lg:p-6 border border-borderColor-light dark:border-borderColor-dark"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="info-text">የእጣ መለያ</span>
                  <span class="info-value">{{ lottery.lottery_id }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="info-text">ጠቅላላ ትኬቶች</span>
                  <span class="info-value">
                    {{ lottery.total_tickets.toLocaleString() }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="info-text">የአንድ የትኬት ዋጋ</span>
                  <span class="info-value">
                    {{ lottery.price_per_ticket }} ብር
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method -->

          <LotteryPaymentOptionsSelector
            v-model="form.payment_option"
            :lottery="lottery"
          />

          <!-- Payment Proof -->
          <div>
            <h2 class="text-lg font-bold mb-3">ገንዘብ የላኩበት ማስረጃ ፎቶ</h2>
            <MediaImageUpload v-model="form.payment_url" />
          </div>

          <!-- Submit -->
          <BaseButton
            type="submit"
            :full="true"
            size="lg"
            :loading="loading"
            :disabled="loading || !form.payment_option || !form.payment_url"
            class="bg-green-600 hover:bg-green-700 text-white"
          >
            ✅ ትኬት ይግዙ
          </BaseButton>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>
.info-text {
  @apply text-textSecondary-light dark:text-textSecondary-dark text-sm font-bold;
}

.info-value {
  @apply font-semibold text-primary-light dark:text-primary-dark text-sm;
}
</style>
