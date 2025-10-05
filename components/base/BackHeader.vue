<template>
  <header
    class="sticky top-0 z-50 flex items-center gap-3 px-4 py-2 border-b bg-white dark:bg-card-dark dark:border-borderColor-dark border-borderColor-light shadow-sm lg:hidden"
  >
    <button
      @click="handleBack"
      class="text-textPrimary-light dark:text-textPrimary-dark hover:opacity-75 transition"
    >
      <Icon name="mdi:arrow-left" size="24" />
    </button>

    <h1
      class="text-base font-semibold text-textPrimary-light dark:text-textPrimary-dark truncate"
    >
      {{ title }}
    </h1>
  </header>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const router = useRouter();

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}
</script>
