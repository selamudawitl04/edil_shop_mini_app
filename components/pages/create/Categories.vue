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

const selectedCategories = ref(props.modelValue.categories || []);

// Watch for changes and emit
watch(selectedCategories, (newValue) => {
    form.value.categories = newValue;
    emit("update:modelValue", form.value);
}, { deep: true });

// Watch for prop changes
watch(() => props.modelValue.categories, (newValue) => {
    selectedCategories.value = newValue || [];
}, { immediate: true });

const onSubmit = () => {
    emit("next");
};
</script>

<template>
    <div class="space-y-6">
        <!-- Categories -->
        <div class="mb-6">
            <PagesCategorySelection v-model="selectedCategories" />
        </div>

        <div class="flex justify-between items-center w-full">
            <BaseButton variant="outline" :full="false" @click="emit('back')">
                ← Back
            </BaseButton>

            <!-- Submit -->
            <BaseButton :full="false" @click="onSubmit">
                <span class="text-white">Next →</span>
            </BaseButton>
        </div>
    </div>
</template>