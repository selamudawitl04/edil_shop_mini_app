<template>

    <div class="space-y-6">

        <BaseCategorySelection v-model="selectedCategories" header="Group Categories"
            description="Select up to 5 categories that best describe your prayer group" :max-per-group="5" />


        <div v-if="showNavigation" class="flex justify-between items-center w-full">

            <BaseButton variant="outline" :full="false" @click="emit('back')">
                ← Back
            </BaseButton>



            <!-- Submit -->
            <BaseButton :full="false" @click="emit('next')">
                <span class="text-white"> Next →</span>
            </BaseButton>

        </div>
    </div>

</template>

<script setup>


const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    showNavigation: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:modelValue', 'next', 'back']);

const selectedCategories = ref(props.modelValue || []);

// Watch for changes and emit
watch(selectedCategories, (newValue) => {
    emit('update:modelValue', newValue);
}, { deep: true });

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
    selectedCategories.value = newValue || [];
}, { immediate: true });
</script>