<!-- Only the creator of the devotion can update it -->

<template>
  <!-- ✨ Edit Devotion Dialog -->
  <BaseDialog v-model="open" title="✏️ Edit Event" :autoClose="false">
    <template #content>
      <div class="max-w-3xl mx-auto">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- ---------------------------Basic Info ---------------------------- -->

          <!-- Title -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput
              id="title"
              name="title"
              label="Title"
              v-model="form.title"
              placeholder="Event title"
              rules="required"
            />

            <!-- Category -->
            <SelectEventCategory
              id="category_id"
              name="category_id"
              label="Category"
              v-model="form.category_id"
              rules="required"
              show-label
            />
          </div>

          <!-- Description -->
          <div>
            <BaseTextInput
              id="description"
              name="description"
              label="Description"
              v-model="form.description"
              placeholder="Enter a short description for your prayer group"
              rules="required"
            />
          </div>

          <!-- Optional Cover Image -->
          <div
            class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark"
          >
            <label
              class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
            >
              Cover Image
              <span
                class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
                >(optional)</span
              >
            </label>
            <MediaImageUpload
              v-model="form.cover_image"
              :folder="'uploads/events'"
            />
          </div>

          <!-- --------------------------Event Schedule -->

          <div
            class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Event Schedule
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Start Date & Time -->
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

              <!-- End Date & Time -->
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
                All times are displayed in your local timezone:
                {{ form.time_zone }}
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <BaseButton :loading="loading" :disabled="loading || !hasChanged">
            <span class="text-white" v-if="!loading">✅ Update Devotion</span>
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
  title: props.event.title || "",
  category_id: props.event.event_category_id || null,
  cover_image: props.event.banner_url || null,
  start_time_utc: toDatetimeLocal(props.event.start_time_utc),
  end_time_utc: toDatetimeLocal(props.event.end_time_utc),
  description: props.event.description || "",
});

// implment has changed
const hasChanged = computed(() => {
  return (
    form.value.title !== props.event.title ||
    form.value.category_id !== props.event.event_category_id ||
    form.value.cover_image != props.event.banner_url ||
    form.value.start_time_utc !== toDatetimeLocal(props.event.start_time_utc) ||
    form.value.end_time_utc !== toDatetimeLocal(props.event.end_time_utc) ||
    form.value.description !== props.event.description
  );
});

const { mutate, onDone, loading } = mutator(updateEvent, {
  clientId: "auth",
  role: userRole.value,
});

const onSubmit = handleSubmit(() => {
  const input = {
    title: form.value.title,
    event_category_id: form.value.category_id,
    banner_url: form.value.cover_image || null,
    start_time_utc: form.value.start_time_utc,
    end_time_utc: form.value.end_time_utc,
    description: form.value.description,
  };

  mutate({ input, id: props.event.id, delete_event_links: false }); // pass both input + ID
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
</script>
