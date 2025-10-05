<script setup>
import addQuery from "@/graphql/lottery/create.gql";
import { useToast } from "vue-toast-notification";

const { handleSubmit } = useForm();

const router = useRouter();
const toast = useToast();

const form = reactive({
  total_tickets: null,
  price_per_ticket: null,
  end_date: null,
  when_all_tickets_sold: true,
  description: "",
  items: [
    {
      title: "",
      description: "",
      category_id: "",
      order: null,
    },
  ],
  payment_options: [],
  medias: [],
});

// --- Mutation ---
const { mutate, onDone, loading } = mutator(addQuery, {
  clientId: "auth",
});

const onSubmit = handleSubmit(async () => {
  const input = {
    total_tickets: form.total_tickets,
    price_per_ticket: form.price_per_ticket,
    end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
    when_all_tickets_sold: form.when_all_tickets_sold,
    description: form.description,
    items: {
      data: form.items.map((item, index) => ({
        title: item.title,
        category_id: item.category_id,
        order: index + 1,
      })),
    },
    medias: {
      data: form.medias.map((media) => ({
        url: media.url,
        is_featured: media.is_featured,
      })),
    },
    payment_options: {
      data: form.payment_options.map((payment_option) => ({
        user_payment_option_id: payment_option.id,
      })),
    },
  };

  mutate({ input });
});

onDone(async ({ data }) => {
  const newLottery = data?.insert_lotteries_one;
  if (newLottery) {
    toast.success("Lottery created successfully!", {
      position: "top-right",
    });
    router.replace(`/lotteries/${newLottery.id}`);
  } else {
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });
  }
});
</script>

<template>
  <NuxtLayout name="app">
    <section
      class="container p-3 lg:py-8 lg:px-4 min-h-screen max-w-4xl space-y-6"
    >
      <!-- Page Title -->
      <h1 class="text-xl md:text-3xl font-bold mb-2">🎲 ዕጣ መፍጠሪያ</h1>
      <p class="text-gray-600 mb-6">የሚፈለጉትን መረጃዎች ይሙሉ እና ሎተሪዎን ያቀርቡ።</p>

      <form class="space-y-6" @submit.prevent="onSubmit">
        <!-- Items -->
        <div class="bg-white p-4 rounded-lg shadow-sm space-y-2">
          <h2 class="text-xl font-bold mb-4">📦 የሎተሪ እጣዎች</h2>
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

        <!-- Payment Options -->

        <LotteryCreatePaymentOptions v-model="form.payment_options" />

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
          <p class="text-gray-500 text-sm mb-2">የሎተሪዎን እቃ ለማሳየት ምስሎችን ይጨምሩ።</p>
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
          🚀 ሎተሪ መፍጠሪያ
        </BaseButton>
      </form>
    </section>
  </NuxtLayout>
</template>
