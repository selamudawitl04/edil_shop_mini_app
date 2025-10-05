<!-- Only the creator of the devotion can update it -->

<template>
  <!-- ✨ Edit Devotion Dialog -->
  <BaseDialog v-model="open" title="✏️ Edit Event" :autoClose="false">
    <template #content>
      <div class="max-w-3xl mx-auto">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Event Type Selection -->
          <div
            class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4"
          >
            <div class="mb-4">
              <h3
                class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
              >
                🎯 Event Type
              </h3>
              <p
                class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
              >
                Choose how your event will be conducted
              </p>
            </div>

            <div class="space-y-3">
              <label
                v-for="type in eventTypes"
                :key="type.value"
                class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{
                  'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5':
                    form.location_type === type.value,
                }"
              >
                <input
                  type="radio"
                  :value="type.value"
                  v-model="form.location_type"
                  class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                />
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <span
                      class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
                    >
                      {{ type.label }}
                    </span>
                  </div>
                  <p
                    class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
                  >
                    {{ type.description }}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Physical Location Fields -->
          <div
            v-if="
              form.location_type === 'physical' ||
              form.location_type === 'hybrid'
            "
            class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4"
          >
            <div class="mb-4">
              <h3
                class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
              >
                📍 Physical Location
              </h3>
              <p
                class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
              >
                Provide the physical address and location details
              </p>
            </div>

            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark mb-2"
                >
                  Address
                </label>
                <textarea
                  v-model="form.location_address"
                  rows="3"
                  class="w-full px-3 py-2 border border-borderColor-light dark:border-borderColor-dark rounded-lg bg-white dark:bg-gray-800 text-textPrimary-light dark:text-textPrimary-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
                  placeholder="Enter the full address of your event location"
                ></textarea>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark mb-2"
                >
                  Map Link (Optional)
                </label>
                <input
                  v-model="form.location_link"
                  type="url"
                  class="w-full px-3 py-2 border border-borderColor-light dark:border-borderColor-dark rounded-lg bg-white dark:bg-gray-800 text-textPrimary-light dark:text-textPrimary-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
                  placeholder="Google Maps, Apple Maps, or other map service link"
                />
              </div>
            </div>
          </div>

          <!-- Online Platform Fields -->
          <div
            v-if="
              form.location_type === 'online' || form.location_type === 'hybrid'
            "
            class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4"
          >
            <div class="mb-4">
              <h3
                class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
              >
                🌐 Online Platforms
              </h3>
              <p
                class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
              >
                Add online platforms where people can join your event
              </p>
            </div>

            <EventsCreateEventLinks v-model="form.event_links" />
          </div>

          <!-- Submit Button -->
          <BaseButton :loading="loading" :disabled="loading || !hasChanged">
            <span class="text-white" v-if="!loading">✅ Update Event</span>
            <span class="text-white" v-else>Updating...</span>
          </BaseButton>
        </form>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import updateEvent from "@/graphql/events/update.gql";
import { useToast } from "vue-toast-notification";
import { toDatetimeLocal } from "@/helpers/time_date";

const user = useCookie("userData");
const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue", "updated"]);

const props = defineProps({
  modelValue: Boolean,
  event: {
    type: Object,
    required: true,
  },
});

const refetchEvent = inject("refetchEvent");
const refetchEvents = inject("refetchEvents");

// Open state
const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const userRole = computed(() => {
  return (
    props.event.feed.page.page_admins[0]?.role ||
    props.event.feed.group.group_members.find(
      (member) => member.role != "group:member"
    )?.role
  );
});

const form = ref({
  location_type: props.event.location_type || null,
  location_address: props.event.location_address || null,
  location_link: props.event.location_link || null,
  event_links: props.event.event_links || [],
});

// implment has changed
const hasChanged = computed(() => {
  return (
    (form.value.location_type !== props.event.location_type &&
      form.value.location_type !== null) ||
    (form.value.location_address !== props.event.location_address &&
      form.value.location_address !== null) ||
    (form.value.location_link !== props.event.location_link &&
      form.value.location_link !== null)
  );
});

const { mutate, onDone, loading } = mutator(updateEvent, {
  clientId: "auth",
  role: userRole.value,
});

const onSubmit = handleSubmit(() => {
  const input = {
    location_type: form.value.location_type,
    location_address: form.value.location_address,
    location_link: form.value.location_link,
  };

  const event_links = form.value.event_links.map((link) => ({
    platform: link.platform,
    url: link.url,

    event_id: props.event.id,
  }));

  mutate({
    input,
    id: props.event.id,
    event_links: event_links,
    delete_event_links: false,
  }); // pass both input + ID
});

onDone(({ data }) => {
  if (data?.update_events) {
    toast.success("Event updated successfully!", {
      position: "top-right",
    });
    emit("updated", data.update_events);

    if (typeof refetchEvent === "function") {
      refetchEvent();
    }

    if (typeof refetchEvents === "function") {
      refetchEvents();
    }
    open.value = false;
  } else {
    toast.error("Failed to update event. Please try again.", {
      position: "top-right",
    });
  }
});

const eventTypes = [
  {
    value: "online",
    label: "🌐 Online Event",
    description: "Virtual event with online platforms",
  },
  {
    value: "physical",
    label: "📍 Physical Event",
    description: "In-person event at a specific location",
  },
  {
    value: "hybrid",
    label: "🔄 Hybrid Event",
    description: "Both online and physical attendance options",
  },
];
</script>
