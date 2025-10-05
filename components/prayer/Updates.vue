<template>
  <BaseDialog v-model="openAddPrayerRequestUpdate" title="Add a Prayer Update">
    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Update Content Input -->
        <BaseTextInput v-model="addPrayerUpdateForn.content" label="Update Message"
          placeholder="Write a short update about your prayer request..." name="update_content" id="update_content"
          rules="required" />

        <!-- Is Answered Checkbox -->
        <BaseCheckBox v-model="addPrayerUpdateForn.is_answer" label="Answered Prayer"
          description="Enable this if this update marks the prayer as answered." name="is_answer" />

        <!-- Submit Button -->
        <BaseButton :loading="addLoading" :disabled="addLoading" type="submit" class="mt-2">
          <span clas v-if="!addLoading">📬 Post Update</span>
          <span v-else class="text-white">Submitting...</span>
        </BaseButton>
      </form>
    </template>
  </BaseDialog>

  <div class="lg:bg-card-light lg:dark:bg-card-dark py-4 ">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4 gap-2 px-0">
      <h3 class="text-lg lg:text-xl font-semibold text-textPrimary-light dark:text-textPrimary-dark">
        Updates ({{ updates?.length || 0 }})
      </h3>

      <!-- Add New Button (only for owner) -->
      <template v-if="isMyPrayerRequest">


        <BaseButton @click="openAddPrayerRequestUpdate = true" variant="primary-dark" :full="false">
          <Icon name="uil:plus" size="20" class="mr-2" />
          Add Update
        </BaseButton>
      </template>

      <!-- Sort Dropdown -->
      <template v-else>
        <div>
          <label for="sort" class="sr-only">Sort updates</label>
          <select v-model="selectSort" id="sort"
            class="w-full lg:w-auto px-3 py-2 pr-10 rounded-md border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-slate-800 text-sm text-textPrimary-light dark:text-textPrimary-dark appearance-none">
            <option value="new_first">Newest First</option>
            <option value="old_first">Oldest First</option>
          </select>
        </div>
      </template>
    </div>

    <!-- Update List -->
    <template v-if="updates?.length">
      <div class="space-y-4">
        <PrayerUpdateCard v-for="update in updates" :key="update.id" :prayer-update="update" />
      </div>
    </template>

    <!-- No Updates Message -->
    <template v-else>
      <p class="text-center text-textSecondary-light dark:text-textSecondary-dark py-8">
        No updates have been added yet.
      </p>
    </template>
  </div>
</template>

<script setup>
import addPrayerRequestUpdateMutation from "@/graphql/prayers/add_prayer_request _update.gql";
import { useForm } from "vee-validate";
import { useToast } from "vue-toast-notification";

const { handleSubmit } = useForm();

const toast = useToast();
const route = useRoute();
const props = defineProps({
  prayerRequest: {
    type: Object,
    required: true,
  },
  isMyPrayerRequest: {
    type: Boolean,
    default: false,
  },
});

// Sort state
const selectSort = ref("new_first"); // options: "new_first", "old_first", etc.

const updates = computed(() => {
  if (!props.prayerRequest?.updates) return [];

  return props.prayerRequest.updates.sort((a, b) => {
    if (selectSort.value === "new_first") {
      return b.update_order - a.update_order; // Newest first
    } else if (selectSort.value === "old_first") {
      return a.update_order - b.update_order; // Oldest first
    }
    return 0; // fallback (no sorting)
  });
});

// Watch sort and refetch when changed
watch(selectSort, () => {
  refetch();
});

/**-----------------------Add Prayer Request Update------------ */
const openAddPrayerRequestUpdate = ref(false);
const addPrayerUpdateForn = ref({
  content: "",
  is_answer: false,
});

const {
  mutate: addMutate,
  onDone: addDone,
  loading: addLoading,
} = mutator(addPrayerRequestUpdateMutation, {
  clientId: "auth",
});

const onSubmit = handleSubmit(() => {
  const input = {
    prayer_request_id: props.prayerRequest?.id,
    content: addPrayerUpdateForn.value.content,
    is_answer: addPrayerUpdateForn.value.is_answer,

    edit_token: route.query.edit_token || null,
  };
  addMutate({
    input,
  });
});

const refechPrayerRequest = inject("refechPrayerRequest");
addDone(({ data }) => {
  if (data.add_prayer_request_update) {
    refechPrayerRequest();
    // ✅ Show success toast
    toast.success("Prayer request updated successfully", {
      position: "top-right",
    });
    openAddPrayerRequestUpdate.value = false;
  }
});
</script>
