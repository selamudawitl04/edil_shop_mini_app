<script setup lang="ts">
import { clearError } from "#app";
import type { NuxtError } from "#app";
import { computed } from "vue";

const props = defineProps({
  error: Object as () => NuxtError,
});

// Determine if the error is a 404
const is404 = computed(() => props.error?.statusCode === 404);

// Go back to home and clear error
const handleBackToHome = () => {
  clearError({ redirect: "/" });
};

// Refresh current page and clear error
const handleRefresh = () => {
  clearError();
  window.location.reload();
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center text-center bg-background-light dark:bg-background-dark px-6 py-10"
  >
    <div
      class="bg-card-light dark:bg-card-dark shadow-lg rounded-xl p-8 max-w-lg w-full border border-borderColor-light dark:border-borderColor-dark"
    >
      <!-- Icon -->
      <div class="text-danger-light dark:text-danger-dark mb-4">
        <Icon
          :name="
            is404 ? 'mdi:alert-octagon-outline' : 'mdi:emoticon-sad-outline'
          "
          class="w-16 h-16 mx-auto"
        />
      </div>

      <!-- Heading -->
      <h1
        class="text-4xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-2"
      >
        ችግር ተፈጥሯል
      </h1>

      <!-- Error message -->
      <p class="text-textSecondary-light dark:text-textSecondary-dark mb-4">
        {{
          props.error?.message ||
          props.error?.statusMessage ||
          "ያልተጠበቀ ችግር ተፈጥሯል። እባኮትን በኋላ ይሞክሩ።"
        }}
      </p>

      <!-- Friendly explanation -->
      <p
        class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-6"
      >
        {{
          is404
            ? "የምትፈልጉት ገፅ አልተገኘም ወይም ወደ ሌላ ቦታ ተዛውሯል።"
            : "እባኮትን እንደገና ይሞክሩ ወይም ወደ መነሻ ገፅ ይመለሱ።"
        }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleBackToHome"
          class="bg-danger-light text-white hover:bg-danger-dark px-5 py-2 rounded-md font-semibold shadow transition"
        >
          ← ወደ መነሻ ገፅ ተመለስ
        </button>

        <button
          @click="handleRefresh"
          class="border border-danger-light text-danger-light hover:bg-danger-light hover:text-white px-5 py-2 rounded-md font-semibold shadow transition"
        >
          ⟳ እንደገና ይሞክሩ
        </button>
      </div>
    </div>
  </div>
</template>
