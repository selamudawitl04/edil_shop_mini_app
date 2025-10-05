<script setup>

const { handleSubmit } = useForm();


const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    }
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
        <!-- Group Visibility -->
        <div
            class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4">
            <div class="mb-4">
                <h3 class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                    🔒 Group Visibility & Privacy
                </h3>
                <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                    Choose how your prayer group will be visible and accessible to others
                </p>
            </div>

            <div class="space-y-3">
                <!-- Public Option -->
                <label
                    class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': form.visibility === 'public' }">
                    <input type="radio" value="public" v-model="form.visibility"
                        class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🌍
                                Public</span>
                            <span
                                class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">Recommended</span>
                        </div>
                        <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                            Visible to everyone. Anyone can find and join your group without approval. Great for open
                            prayer
                            communities.
                        </p>
                    </div>
                </label>

                <!-- Private Option -->
                <label
                    class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': form.visibility === 'private' }">
                    <input type="radio" value="private" v-model="form.visibility"
                        class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🔐
                                Private</span>
                            <span
                                class="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">Controlled</span>
                        </div>
                        <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                            Visible to everyone but requires invitation or approval to join. Perfect for selective
                            prayer
                            groups.
                        </p>
                    </div>
                </label>

                <!-- Hidden Option -->
                <label
                    class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': form.visibility === 'hidden' }">
                    <input type="radio" value="hidden" v-model="form.visibility"
                        class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🕵️
                                Hidden</span>
                            <span
                                class="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">Exclusive</span>
                        </div>
                        <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                            Not visible to non-members and excluded from search. Only invited users can find and join.
                        </p>
                    </div>
                </label>
            </div>
        </div>


        <div class="flex justify-between items-center w-full">

            <BaseButton variant="outline" :full="false" @click="emit('back')">
                ← Back
            </BaseButton>


            <!-- Submit -->
            <BaseButton @click="onSubmit" :full="false">
                <span class="text-white">Next →</span>
            </BaseButton>

        </div>

    </form>
</template>
