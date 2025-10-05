<script setup>
import updateLotteryData from "@/graphql/lottery/update_lottery_data.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
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

const { mutate, onDone, loading } = mutator(updateLotteryData, {
  clientId: "auth",
  showError: false,
});

const handleStartLottery = () => {
  const input = {
    status: "active",
  };

  mutate({
    id: props.lottery.id,
    input,
  });
};

onDone(({ data }) => {
  if (data?.update_lotteries?.affected_rows) {
    toast.success("🎉 ሎተሪው በትክክል ተጀምሯል!", {
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
    toast.error("❌ ሎተሪ መጀመር አልተሳካም!", {
      position: "top-right",
    });
  }
});
</script>

<template>
  <BaseConfirmation
    v-model="open"
    confirm-button="አስጀምር"
    :description="`እርግጠኛ ነህ ሎተሪውን መጀመር ትፈልጋለህ? ከተጀመረ በኋላ ተጠቃሚዎች ትኬቶችን መግዛት ይጀምራሉ። ይህ እርምጃ ወደ ኋላ አይመለስም።`"
    title="ሎተሪ ጀምር"
    icon="uil:play-circle"
    icon-class="text-green-500 text-2xl"
    confirm-title="ተጀምሯል"
    confirm-msg="ሎተሪው በትክክል ተጀምሯል።"
    cancel-msg="ሎተሪ መጀመር ተሰርዟል።"
    @confirm="handleStartLottery"
    :loading="loading"
  />
</template>
