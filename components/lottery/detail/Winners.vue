<template>
  <div
    class="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-4 lg:p-6 border border-borderColor-light dark:border-borderColor-dark"
  >
    <h2
      class="text-xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-6"
    >
      እጣዎች እና አሸናፊዎች
    </h2>

    <div v-if="lottery.items?.length" class="space-y-4">
      <div
        v-for="(item, index) in lottery.items"
        :key="item.id"
        class="flex items-center gap-4 p-4 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:shadow-md transition"
      >
        <!-- Item number -->
        <span
          class="text-white bg-primary-light rounded-full w-6 h-6 flex items-center justify-center"
          :class="item.winner?.ticket?.ticket_number ? 'bg-green-500' : ''"
        >
          {{ index + 1 }}
        </span>

        <!-- Item details and winner info -->
        <div class="flex-1">
          <h3
            class="font-semibold text-textPrimary-light dark:text-textPrimary-dark"
          >
            {{ item.title }}
          </h3>

          <p
            class="text-sm font-medium"
            :class="
              item.winner?.ticket?.ticket_number
                ? 'text-green-500'
                : 'text-red-500'
            "
          >
            አሸናፊ ቁጥር:
            {{ item.winner?.ticket?.ticket_number || "እጣው አልዎጣም" }}
          </p>
        </div>

        <!-- Item category icon -->
        <div class="flex-shrink-0 text-2xl">
          {{ item.category?.icon || "🎁" }}
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <Icon
        name="mdi:gift-outline"
        class="w-16 h-16 text-textSecondary-light dark:text-textSecondary-dark mx-auto mb-4"
      />
      <p class="text-textSecondary-light dark:text-textSecondary-dark">
        እቃዎች የሉም
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  lottery: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
