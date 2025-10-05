<script setup>

import { usePrayerStore } from "@/stores/prayer";


const prayerStore = usePrayerStore();
const route = useRoute();
const router = useRouter();






watch(() => prayerStore.showPrayerRequest, (newVal) => {
  if (!newVal) {
    router.push({
      path: "/",
    });
  }
});



onMounted(() => {
  if (!route.params?.id) {
    router.push({
      path: "/",
    });
  } else {
    prayerStore.openPrayerRequest(route.params?.id);
  }

})


</script>




<template>
  <PrayerDetailDialog v-if="prayerStore.showPrayerRequest" v-model="prayerStore.showPrayerRequest" />
</template>