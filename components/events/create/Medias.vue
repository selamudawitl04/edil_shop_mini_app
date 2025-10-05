<script setup>
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

const onSubmit = () => {
  emit("next");
};

const bannerImageUploader = ref(null);
const handleBannerImageUpload = (url) => {
  form.value.banner_url = url;
};
</script>

<template>
  <MediaUploadWithCropper
    :aspect-ratio="16 / 9"
    ref="bannerImageUploader"
    @upload="handleBannerImageUpload"
  />

  <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-6">
    Add a banner image for your event
  </p>

  <div class="space-y-20">
    <!-- Cover Image Section -->
    <div
      class="relative w-full h-48 md:h-64 lg:h-80 bg-gradient-to-br from-primary-light/20 to-primary-dark/20 dark:from-primary-dark/20 dark:to-primary-light/20 space-y-20"
    >
      <!-- Cover Image -->
      <img
        v-if="form.banner_url"
        :src="form.banner_url"
        :alt="form.title"
        class="w-full h-full object-cover"
      />

      <!-- Fallback Background -->
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="text-center">
          <Icon
            name="mdi:file-document"
            size="64"
            class="text-primary-light/50 dark:text-primary-dark/50 mx-auto mb-2"
          />
          <p
            class="text-primary-light/70 dark:text-primary-dark/70 text-sm font-medium"
          >
            {{ form.title }}
          </p>
        </div>
      </div>

      <!-- Update Cover Image -->
      <div
        class="absolute bottom-2 right-4 md:right-8 transform translate-y-1/2"
      >
        <div class="relative inline-block">
          <button
            @click="bannerImageUploader.openFilePicker()"
            type="button"
            class="absolute bottom-1 right-1 bg-primary-light dark:bg-primary-dark text-white rounded-full p-1 shadow-md hover:bg-primary-dark dark:hover:bg-primary-light transition-colors focus:outline-none"
            aria-label="Change cover image"
          >
            <Icon name="mdi:camera" size="23" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center w-full">
      <BaseButton variant="outline" :full="false" @click="emit('back')">
        ← Back
      </BaseButton>

      <!-- Submit -->
      <BaseButton :full="false" @click="onSubmit">
        <span class="text-white"> Next → </span>
      </BaseButton>
    </div>
  </div>
</template>
