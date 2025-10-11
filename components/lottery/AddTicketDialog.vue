<script setup>
import buyTicket from "@/graphql/lottery/buy_ticket.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue", "added", "clearTicketNumbers"]);

const props = defineProps({
  modelValue: Boolean,
  ticketNumbers: {
    type: Array,
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

const user = useCookie("userData");

// Submit handler
const onSubmit = handleSubmit(() => {
  const groupID = generateRandomGroupID();

  const inputs = props.ticketNumbers.map((ticketNumber) => ({
    ticket_number: ticketNumber,
    lottery_id: props.lottery.id,
    lottery_payment_option_id: form.payment_option.id,
    group_id: groupID,
    receipt_url: form.payment_url,
  }));

  mutate({ input: inputs });
});

function generateRandomGroupID() {
  if (props.ticketNumbers?.length == 0) return null;
  // include lottery.lottery_id and user.id
  return `${props.lottery.lottery_id}-${
    user.value?.name
  }-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

onDone(({ data }) => {
  if (data?.insert_tickets?.affected_rows) {
    toast.success("ትኬት በተሳካ ሁኔታ ተገዝቷል! ክፊያዎ ስረጋገጥ መዕለክት ይደርሶታል", {
      duration: 5000,
    });
    if (typeof refetchLotteries === "function") refetchLotteries();
    if (typeof refetchLottery === "function") refetchLottery();
    emit("added");
    open.value = false;
  } else {
    toast.error("ትኬት መመዝገብ አልተሳካም!", {
      duration: 5000,
    });
  }
});

onError((error) => {
  console.log(error);
  if (error.message.includes("Uniqueness violation")) {
    const confirmed = window.confirm(
      "ከተመረጡ ትከቶች አንድ አንዶች ቀድሞ ተይዞዋል እባኮ እንደገና ይምረጡ"
    );
    if (confirmed) {
      if (typeof refetchLottery === "function") refetchLottery();
      emit("clearTicketNumbers");
    }
    open.value = false;
  } else {
    toast.error("ትኬት መመዝገብ አልተሳካም! እባኮ እንደገና ይሞክሩ");
  }
});

const showLotteryDescription = ref(false);
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
        <form class="space-y-4" @submit.prevent="onSubmit">
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

                <div class="flex justify-between gap-3">
                  <span class="info-text whitespace-nowrap">የተመረጡ ትኬቶች</span>
                  <span class="info-value">
                    {{ ticketNumbers }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="info-text">የአንድ የትኬት ዋጋ</span>
                  <span class="info-value">
                    {{ lottery.price_per_ticket }} ብር
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="info-text">አጠቃላይ ዋጋ</span>
                  <span class="info-value">
                    {{ ticketNumbers.length }} ትኬት X
                    {{ lottery.price_per_ticket }} ብር =
                    {{ ticketNumbers.length * lottery.price_per_ticket }} ብር
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="lottery.description"
            class="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div
                class="flex items-start gap-3 cursor-pointer"
                @click="showLotteryDescription = !showLotteryDescription"
              >
                <Icon
                  name="mdi:information-outline"
                  class="text-blue-600 text-xl flex-shrink-0"
                />
                <p class="text-blue-800 text-sm md:text-base font-medium">
                  ብዙ ትከቶችን ለሚገዙ ቅናሽ ካለ ለማየት የእጣ ማብራሪያ ይመልከቱ
                </p>
              </div>

              <button
                type="button"
                class="text-blue-700 hover:text-white hover:bg-blue-600 border border-blue-600 text-sm font-semibold px-3 py-1.5 rounded-md transition-all"
                @click.stop="showLotteryDescription = !showLotteryDescription"
              >
                {{ showLotteryDescription ? "ዝጋ" : "እይ" }}
              </button>
            </div>

            <transition name="fade">
              <p
                v-if="showLotteryDescription"
                class="mt-3 text-gray-700 text-sm leading-relaxed border-t border-blue-100 pt-3"
              >
                {{ lottery.description }}
              </p>
            </transition>
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
            class="bg-primary-light text-white"
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
