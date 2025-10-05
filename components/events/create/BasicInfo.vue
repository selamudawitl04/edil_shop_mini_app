<script setup>
const { handleSubmit } = useForm();

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "next"]);
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const onSubmit = handleSubmit(async () => {
  emit("next");
});
</script>

<template>
  <!--  -->
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Name -->
    <div>
      <BaseInput
        id="title"
        name="title"
        label="Title"
        v-model="form.title"
        placeholder="Event title"
        rules="required"
      />
    </div>

    <!-- Category -->
    <div>
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

    <div class="flex justify-between items-center w-full">
      <BaseButton :disabled="true" variant="outline" :full="false">
        ← Back
      </BaseButton>

      <!-- Submit -->
      <BaseButton :full="false">
        <span class="text-white">Next →</span>
      </BaseButton>
    </div>
  </form>
</template>
