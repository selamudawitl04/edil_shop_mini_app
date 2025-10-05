<script setup>
const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    }
});

const emit = defineEmits(["update:modelValue", "next", "back"]);
const form = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const onSubmit = () => {
    emit("next");
};

const profileImageUploader = ref(null);
const handleProfileImageUpload = (url) => {
    form.value.profileImage = url;
};

const coverImageUploader = ref(null);
const handleCoverImageUpload = (url) => {
    form.value.coverImage = url;
};

</script>

<template>




    <MediaUploadWithCropper :aspect-ratio="1" ref="profileImageUploader" @upload="handleProfileImageUpload" />

    <MediaUploadWithCropper :aspect-ratio="16 / 9" ref="coverImageUploader" @upload="handleCoverImageUpload" />




    <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-6">
        Add a cover image and profile image for your page.
    </p>



    <div class="space-y-20 ">

        <!-- Cover Image Section -->
        <div
            class="relative w-full h-48 md:h-64 lg:h-80 bg-gradient-to-br from-primary-light/20 to-primary-dark/20 dark:from-primary-dark/20 dark:to-primary-light/20 space-y-20">
            <!-- Cover Image -->
            <img v-if="form.coverImage" :src="form.coverImage" :alt="form.name" class="w-full h-full object-cover" />

            <!-- Fallback Background -->
            <div v-else class="w-full h-full flex items-center justify-center">
                <div class="text-center">
                    <Icon name="mdi:file-document" size="64"
                        class="text-primary-light/50 dark:text-primary-dark/50 mx-auto mb-2" />
                    <p class="text-primary-light/70 dark:text-primary-dark/70 text-sm font-medium">{{ form.name }}
                    </p>
                </div>
            </div>

            <!-- Update Cover Image -->
            <div class="absolute bottom-2 right-4 md:right-8 transform translate-y-1/2">
                <div class="relative inline-block">
                    <button @click="coverImageUploader.openFilePicker()" type="button"
                        class="absolute bottom-1 right-1 bg-primary-light dark:bg-primary-dark text-white rounded-full p-1 shadow-md hover:bg-primary-dark dark:hover:bg-primary-light transition-colors focus:outline-none"
                        aria-label="Change cover image">
                        <Icon name="mdi:camera" size="23" />
                    </button>
                </div>
            </div>


            <!-- Circular Profile Image -->
            <div class="absolute bottom-0 left-4 md:left-8 transform translate-y-1/2">
                <BaseAvatar :avatar_image="form.profileImage" :avatar_color="form.avatar_color" size="110"
                    custom_class="border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800 shadow-lg"
                    :name="form.name" />
                <button @click="profileImageUploader.openFilePicker()" type="button"
                    class="absolute bottom-1 right-1 bg-primary-light dark:bg-primary-dark text-white rounded-full p-1 shadow-md hover:bg-primary-dark dark:hover:bg-primary-light transition-colors focus:outline-none"
                    aria-label="Change profile image">
                    <Icon name="mdi:camera" size="23" />
                </button>
            </div>
        </div>
        <div class="flex justify-between items-center w-full">
            <BaseButton variant="outline" :full="false" @click="emit('back')">
                ← Back
            </BaseButton>

            <!-- Submit -->
            <BaseButton :full="false" @click="onSubmit">
                <span class="text-white"> Submit </span>
            </BaseButton>
        </div>
    </div>
</template>