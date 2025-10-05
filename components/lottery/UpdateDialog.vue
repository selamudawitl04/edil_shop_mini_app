<script setup>
import updateLottery from "@/graphql/lottery/update.gql";
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
  total_tickets: props.lottery.total_tickets,
  price_per_ticket: props.lottery.price_per_ticket,
  end_date: props.lottery.end_date,
  when_all_tickets_sold: props.lottery.when_all_tickets_sold,
  description: props.lottery.description,
  items: props.lottery.items?.map((item) => ({
    title: item.title,
    category_id: item.category_id,
    order: item.order,
  })),
  medias: props.lottery.medias?.map((media) => ({
    url: media.url,
    is_featured: media.is_featured,
  })),
  status: props.lottery.status,
  payment_options: props.lottery.payment_options?.map(
    (payment_option) => payment_option.user_payment_option
  ),
});

const { mutate, onDone, loading } = mutator(updateLottery, {
  clientId: "auth",
  showError: false,
});

const onSubmit = handleSubmit(() => {
  const input = {
    total_tickets: form.total_tickets,
    price_per_ticket: form.price_per_ticket,
    end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
    when_all_tickets_sold: form.when_all_tickets_sold,
    description: form.description,
  };

  const lottery_items = form.items.map((item, index) => ({
    title: item.title,
    category_id: item.category_id,
    order: index + 1,
    lottery_id: props.lottery.id,
  }));

  const lottery_medias = form.medias.map((media) => ({
    url: media.url,
    is_featured: media.is_featured,
    lottery_id: props.lottery.id,
  }));

  const payment_options = form.payment_options.map((payment_option) => ({
    user_payment_option_id: payment_option.id,
    lottery_id: props.lottery.id,
  }));

  mutate({
    input,
    id: props.lottery.id,
    items: lottery_items,
    medias: lottery_medias,
    payment_options,
  }); // pass both input + ID
});

onDone(({ data }) => {
  if (data?.update_lotteries?.affected_rows) {
    toast.success("ሎተሪ ተሻሽሉል!", {
      position: "top-right",
    });
    emit("updated", data.update_lotteries);

    if (typeof refetchLotteries === "function") {
      refetchLotteries();
    }

    if (typeof refetchLottery === "function") {
      refetchLottery();
    }
    open.value = false;
  } else {
    toast.error("ሎተሪ ማሻሽል  አልተሳካውም!", {
      position: "top-right",
    });
  }
});
</script>

<template>
  <BaseDialog v-model="open" title="✏️ ሎተሪ አሻሽል" :autoClose="false">
    <template #content>
      <div class="max-w-3xl mx-auto">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <!-- Items -->
          <div class="bg-white p-4 rounded-lg shadow-sm space-y-2">
            <h2 class="text-xl font-bold mb-4">📦 የሎተሪ እቃዎች</h2>
            <LotteryCreateItems v-model="form.items" />
          </div>

          <!-- Tickets & Price -->
          <div class="bg-white p-4 rounded-lg shadow-sm space-y-3">
            <h2 class="text-xl font-bold mb-4">🎟️ ትኬቶች እና ዋጋ</h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <BaseInput
                v-model="form.total_tickets"
                label="የሎተሪ ትኬቶች ብዛት"
                :placeholder="`ትኬቶች ብዛት ያስገቡ`"
                id="total_tickets"
                name="total_tickets"
                type="number"
                rules="required"
              />
              <BaseInput
                v-model="form.price_per_ticket"
                label="የአንድ ትኬት ዋጋ"
                :placeholder="`ዋጋ ያስገቡ`"
                id="price_per_ticket"
                name="price_per_ticket"
                type="number"
                rules="required"
              />
            </div>
          </div>

          <!-- Payment Options -->

          <LotteryCreatePaymentOptions v-model="form.payment_options" />

          <!-- Lottery Date -->
          <div class="bg-white p-4 rounded-lg shadow-sm space-y-3">
            <h2 class="text-xl font-bold mb-4">📅 የሎተሪ ቀን</h2>
            <div class="flex items-center justify-between gap-2">
              <label for="when_all_tickets_sold" class="font-medium">
                ✅ ሁሉም ትኬቶች ሲሸጡ በአውቶማቲክ ይዎጣል
              </label>
              <BaseSwitch
                v-model="form.when_all_tickets_sold"
                name="when_all_tickets_sold"
                id="when_all_tickets_sold"
              />
            </div>

            <BaseInput
              v-if="!form.when_all_tickets_sold"
              type="date"
              v-model="form.end_date"
              label="ቀን ይምረጡ"
              placeholder="የሎተሪ ቀን ያስገቡ"
              rules="required"
            />
          </div>

          <!-- Description -->
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h2 class="text-xl font-bold mb-4">📝 ማብራሪያ</h2>
            <BaseTextInput
              id="description"
              name="description"
              v-model="form.description"
              placeholder="ሎተሪ ስለምን እንደሚያደርጉ አጭር ማብራሪያ ያስገቡ..."
            />
          </div>

          <!-- Images -->
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h2 class="text-xl font-bold mb-4">🖼️ ምስሎች</h2>
            <p class="text-gray-500 text-sm mb-2">
              የሎተሪዎን እቃ ለማሳየት ምስሎችን ይጨምሩ።
            </p>
            <MediaUploadManyImages v-model="form.medias" :file-limit="5" />
          </div>

          <!-- Submit -->
          <BaseButton
            type="submit"
            :full="true"
            size="lg"
            :loading="loading"
            :disabled="loading"
          >
            🚀 ሎተሪ አሻሽል
          </BaseButton>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>
