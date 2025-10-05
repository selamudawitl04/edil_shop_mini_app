<template>
    <div class="space-y-4">
        <p class="text-sm text-textSecondary-light dark:text-textSecondary-dark">
            What type of devotion would you like to create?
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Regular Devotion Option -->
            <div @click="selectType('devotion')"
                class="cursor-pointer border rounded-xl p-4 flex items-center gap-4 hover:border-primary-light dark:hover:border-primary-dark transition"
                :class="selected === 'devotion'
                    ? 'border-primary-light dark:border-primary-dark'
                    : 'border-borderColor-light dark:border-borderColor-dark'
                    ">
                <div class="bg-primary-light/10 text-primary-light dark:text-primary-dark p-3 rounded-full">
                    <Icon name="mdi:book-open-variant" width="24" height="24" class="text-xl" />
                </div>
                <div>
                    <h3 class="font-semibold text-sm text-textPrimary-light dark:text-textPrimary-dark">
                        Single Devotion
                    </h3>
                    <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                        A standalone devotion with a single message, perfect for daily readings,
                        reflections, or one-time spiritual content.
                    </p>
                </div>
            </div>

            <!-- Devotion Series Option -->
            <div @click="selectType('series')"
                class="cursor-pointer border rounded-xl p-4 flex items-center gap-4 hover:border-primary-light dark:hover:border-primary-dark transition"
                :class="selected === 'series'
                    ? 'border-primary-light dark:border-primary-dark'
                    : 'border-borderColor-light dark:border-borderColor-dark'
                    ">
                <div class="bg-primary-light/10 text-primary-light dark:text-primary-dark p-3 rounded-full">
                    <Icon name="mdi:book-multiple" width="24" height="24" class="text-xl" />
                </div>
                <div>
                    <h3 class="font-semibold text-sm text-textPrimary-light dark:text-textPrimary-dark">
                        Devotion Series
                    </h3>
                    <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                        A collection of related devotions that tell a complete story or explore
                        a theme over multiple parts. Great for Bible studies, sermon series,
                        or progressive spiritual teachings.
                    </p>
                </div>
            </div>
        </div>

        <!-- Navigation -->

        <div class="flex justify-between items-center gap-4">
            <BaseButton :disabled="true" :full="false" type="button">
                Previous
            </BaseButton>
            <BaseButton :disabled="!selected" :full="false" @click="continueToCreate" type="button">
                Next
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: "devotion",
    },
});

const emit = defineEmits(["update:modelValue", "devotion-type-selected"]);
const selected = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

function selectType(type) {
    selected.value = type;
}


function continueToCreate() {

    if (selected.value) {
        emit("devotion-type-selected", selected.value);
    }
}
</script>