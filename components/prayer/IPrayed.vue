<script setup>
import addQuery from "@/graphql/prayers/add_i_prayed.gql";

const { mutate, onDone } = mutator(addQuery, {
  clientId: "auth",
});

const props = defineProps({
  prayerRequest: {
    type: Object,
    required: true,
  },
});

const userPrayed = computed(() => {
  return props.prayerRequest?.prayer_prayeds?.length > 0 ? true : false;
});

const onPray = () => {
  if (userPrayed.value) {
    return;
  }
  mutate({
    input: {
      prayer_request_id: props.prayerRequest.id,
    },
  });
};

onDone(({ data }) => {
  if (data.insert_prayer_prayed_one?.prayer_request_id) {
    props.prayerRequest.prayer_prayeds.push(data.insert_prayer_prayed_one);
  }
});
</script>

<template>
  <div>
    <button
      :disabled="userPrayed"
      @click.stop="onPray"
      :class="[
        'inline-flex items-center gap-2 px-3 py-0.5 text-sm font-medium rounded-lg transition-colors duration-200',
        userPrayed
          ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 cursor-not-allowed'
          : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      ]"
    >
      <span class="text-base">🙏</span>
      <span>{{ userPrayed ? "You Prayed" : "I Prayed" }}</span>
    </button>
  </div>
</template>
