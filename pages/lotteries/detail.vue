<script setup>
import lotteryItemQuery from "@/graphql/lottery/lottery_item.gql";
import { useLotteryStore } from "@/stores/lottery";
const lotteryStore = useLotteryStore();

const route = useRoute();
const router = useRouter();

const loading = ref(false);

onMounted(() => {
  const startParam =
    window.Telegram.WebApp.initDataUnsafe.start_param ||
    localStorage.getItem("startParam");

  const filter = computed(() => {
    if (startParam && startParam.startsWith("lottery_")) {
      const lotteryId = startParam.replace("lottery_", "");
      return {
        lottery_id: {
          _eq: lotteryId,
        },
      };
    } else {
      router.push("/lotteries");
    }
  });

  const sort = computed(() => {
    return [{ created_at: "desc" }];
  });
  const limit = ref(1);
  const offset = ref(0);

  const { onResult, loading, onError } = queryList(lotteryItemQuery, {
    clientId: "auth",
    filter: filter,
    order: sort,
    limit: limit,
    offset: offset,
  });

  onResult(({ data }) => {
    if (data.lotteries?.length) {
      lotteryStore.openLottery(data.lotteries[0].id, "tickets");
    } else {
      router.push("/lotteries");
    }
    loading.value = false;
    localStorage.removeItem("startParam");
    localStorage.removeItem("backRoute");
  });

  onError((error) => {
    if (
      !error.message.includes(
        "An error occurred! For more details, see the full error text at"
      )
    ) {
      router.push("/lotteries");
    }
  });
});

watch(
  () => lotteryStore.showLottery,
  (newVal) => {
    if (!newVal) {
      router.push("/lotteries");
    }
  }
);
</script>
<template>
  <NuxtLayout name="app">
    <div class="flex justify-center items-center h-screen">
      <div v-if="loading" class="class flex justify-center py-8">
        <div class="loader"></div>
      </div>
    </div>
  </NuxtLayout>
</template>
