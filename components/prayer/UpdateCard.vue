<template>
  <div
    class="bg-card-light dark:bg-card-dark shadow-md rounded-2xl p-4 space-y-2 border border-borderColor-light dark:border-borderColor-dark"
  >
    <!-- Update Order as Styled Badge -->
    <div class="flex items-center justify-between">
      <div
        class="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark"
      >
        Update #{{ prayerUpdate.update_order }}
      </div>
    </div>

    <!-- Content -->
    <p
      class="text-textPrimary-light dark:text-textPrimary-dark text-md leading-relaxed"
    >
      {{ prayerUpdate.content }}
    </p>

    <!-- Timestamp -->
    <div
      class="text-xs text-textSecondary-light dark:text-textSecondary-dark mt-2"
    >
      Updated at: {{ formattedTime }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  prayerUpdate: {
    type: Object,
    required: true,
  },
});

const formattedTime = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
}).format(new Date(props.prayerUpdate.created_at));
</script>
