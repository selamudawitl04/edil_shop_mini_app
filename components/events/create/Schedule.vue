<template>
  <div class="space-y-6">
    <div
      class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4"
    >
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Event Schedule</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Start Date & Time -->
        <!-- <div class="space-y-4">
          <BaseInput
            v-model="form.start_date"
            label="Start Date"
            name="start_date"
            id="start_date"
            placeholder="Select start date"
            type="date"
            hint="If this event is recuuring event and start date is in the past, the start date will be the next occurrence of the event."
          />

          <BaseInput
            v-model="form.start_time_utc"
            label="Start Time"
            name="start_time_utc"
            id="start_time_utc"
            :rules="'required'"
            placeholder="Select start time"
            type="time"
            hint=""
          />
        </div> -->

        <!-- End Date & Time -->
        <BaseInput
          v-model="form.start_time_utc"
          label="Start Time"
          name="start_time_utc"
          id="start_time_utc"
          :rules="'required'"
          placeholder="Select start time"
          type="datetime-local"
          hint=""
        />

        <BaseInput
          v-model="form.end_time_utc"
          label="End Time"
          name="end_time_utc"
          id="end_time_utc"
          :rules="'required'"
          placeholder="Select end time"
          type="datetime-local"
        />
      </div>

      <!-- Timezone Info -->
      <div
        class="mt-4 text-xs text-textSecondary-light dark:text-textSecondary-dark p-3 rounded-md"
      >
        <p class="flex items-center">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          All times are displayed in your local timezone: {{ form.time_zone }}
        </p>
      </div>
    </div>

    <!-- ------------------ Recurring Event ------------------ -->

    <!-- <pre>
      {{ form.recurrence_rule }}
    </pre> -->
    <!-- <div
      class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Recurring Event
        </h3>
        <BaseSwitch
          v-model="form.is_recurring"
          id="recurrence"
          name="recurrence"
        />
      </div>
      <BaseRRule v-if="form.is_recurring" v-model="form.recurrence_rule" />
    </div> -->

    <!-- Navigation Buttons -->
    <div class="flex justify-between items-center w-full pt-4">
      <BaseButton
        variant="outline"
        :full="false"
        @click="emit('back')"
        class="px-6 py-2"
      >
        ← Back
      </BaseButton>

      <BaseButton :full="false" @click="handleNext" class="px-6 py-2">
        <span class="text-white">Submit</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "next", "back"]);

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const handleNext = () => {
  emit("next");
};
</script>
