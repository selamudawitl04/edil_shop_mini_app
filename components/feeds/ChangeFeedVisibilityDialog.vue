<script setup>
import updateFeedMutation from "@/graphql/feeds/update.gql";
import { useForm } from "vee-validate";

import { useToast } from "vue-toast-notification";


const { handleSubmit } = useForm();


const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
    modelValue: Boolean,
    feed: {
        type: Object,
        required: true,
    },
});

const toast = useToast();

const open = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});


const feedTypeText = computed(() => {
    if (props.feed?.type === "prayer_request") {
        return "Prayer Request";
    } else if (props.feed?.type === "devotion") {
        return "Devotion";
    } else {
        return "Feed";
    }
});


// form states
const form = ref({
    visibility: props.feed?.visibility || "public", // Default visibility
});

const hasChanges = computed(() => {
    const original = props.feed;
    return (

        form.value.visibility !== original.visibility
    );
});


const { mutate, onDone, loading } = mutator(updateFeedMutation, {
    clientId: "auth",
});

const onSubmit = handleSubmit(() => {
    const input = {
        visibility: form.value.visibility,
    };
    mutate({

        id: props.feed?.id,
        input,
    });
});

onDone(({ data }) => {
    if (data.update_feeds_by_pk) {


        props.feed.visibility = form.value.visibility;
        // ✅ Show success toast
        toast.success(`${feedTypeText.value} visibility updated successfully`, {
            position: "top-right",
        });
        open.value = false;
    }
});
</script>

<template>
    <!-- ----------Check Prayer  Dialog-------- -->

    <BaseDialog v-model="open" :title="`Update ${feedTypeText} Visibility`">
        <template #content>
            <form @submit.prevent="onSubmit" class="space-y-6">




                <!-- Visibility  for group -->
                <div
                    class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4">
                    <div class="mb-4">
                        <h3 class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                            🔒 {{ feedTypeText }} Visibility
                        </h3>
                        <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                            Choose how your {{ feedTypeText }} will be visible and accessible to others
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
                                    <span
                                        class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🌍
                                        Public</span>
                                    <span
                                        class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">Recommended</span>
                                </div>
                                <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                    Everyone can read this {{ feedTypeText }} publicly.
                                </p>
                            </div>
                        </label>

                        <!-- Private Option -->
                        <label
                            class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': form.visibility === 'private' }">
                            <input type="radio" value="group_only" v-model="form.visibility"
                                class="mt-1 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark" />
                            <div class="flex-1">
                                <div class="flex items-center space-x-2 mb-1">
                                    <span
                                        class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">🔐
                                        Private</span>
                                    <span
                                        class="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">Controlled</span>
                                </div>
                                <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                    Only members of the group can view this {{ feedTypeText }}.
                                </p>
                            </div>
                        </label>

                    </div>
                </div>

                <!-- Submit Button -->
                <BaseButton :disabled="!hasChanges || loading" :loading="loading">
                    <span class="text-white" v-if="!loading">🙏 Submit</span>
                    <span class="text-white" v-else>Loading...</span>
                </BaseButton>
            </form>
        </template>
    </BaseDialog>
</template>
