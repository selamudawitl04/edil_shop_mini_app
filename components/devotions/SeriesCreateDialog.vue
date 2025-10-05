<template>
    <!-- ✨ Create New Devotion Series Dialog -->
    <BaseDialog v-model="open" title="📚 Create New Devotion Series" :autoClose="false" body-class="max-w-3xl mx-auto">
        <template #content>
            <div>
                <form @submit.prevent="onSubmit" class="space-y-6">
                    <!-- Title -->
                    <BaseInput id="title" name="title" label="Series Title" v-model="title"
                        placeholder="Enter a title for the devotion series" rules="required" />

                    <!-- Description -->
                    <BaseTextEditor id="description" name="description" label="Series Description" v-model="description"
                        placeholder="Describe what this series is about and what readers can expect" rules="required"
                        :min-height="'150px'" :max-height="'300px'" />

                    <!-- Visibility -->
                    <div v-if="communityType === 'group' && isPrivateGroup"
                        class="bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark rounded-lg p-4">
                        <div class="mb-4">
                            <h3 class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                                🔒 Series Visibility
                            </h3>
                            <p class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                                Choose how your devotion series will be visible and accessible to others
                            </p>
                        </div>
                        <div class="space-y-3">
                            <!-- Public Option -->
                            <label
                                class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': visibility === 'public' }">
                                <input type="radio" value="public" v-model="visibility"
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
                                        Everyone can discover and follow this series publicly.
                                    </p>
                                </div>
                            </label>

                            <!-- Private Option -->
                            <label
                                class="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                :class="{ 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5': visibility === 'private' }">
                                <input type="radio" value="private" v-model="visibility"
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
                                        Only you and group members can see this series.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Optional Cover Image -->
                    <div
                        class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark">
                        <label class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                            Series Cover Image
                            <span
                                class="text-sm text-textSecondary-light dark:text-textSecondary-dark">(optional)</span>
                        </label>
                        <MediaImageUpload v-model="coverImage" :folder="'uploads/devotion-series'" />
                    </div>

                    <!-- Submit -->
                    <BaseButton :loading="loading" :disabled="loading">
                        <span class="text-white" v-if="!loading">📚 Create Series</span>
                        <span class="text-white" v-else>Creating...</span>
                    </BaseButton>
                </form>
            </div>
        </template>
    </BaseDialog>
</template>

<script setup>
// TODO: Import the GraphQL mutation when created
import createDevotionSeries from "@/graphql/devotions/create_series.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue", "series-created"]);

const props = defineProps({
    modelValue: Boolean,
    communityId: {
        type: String,
        required: true,
    },
    communityType: {
        type: String,
        default: "group",
    },
    role: {
        type: String,
        default: "group:admin",
    },
    isPrivateGroup: {
        type: Boolean,
        default: false,
    },
});

const open = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const title = ref("");
const description = ref("");
const visibility = ref("public");
const coverImage = ref("");

const { mutate, onDone, loading } = mutator(createDevotionSeries, {
    clientId: "auth",
    role: props.role,
});

const onSubmit = handleSubmit(() => {

    const input = {
        title: title.value,
        description: description.value,
        cover_image: coverImage.value || null,
        feed: {
            data: {
                type: "devotion",
                visibility: visibility.value,
            }
        }
    };

    if (props.communityType == "group") {
        input.feed.data.group_id = props.communityId;
    } else if (props.communityType == "page") {
        input.feed.data.page_id = props.communityId;
    }

    mutate({ input });
});


onDone(({ data }) => {
    if (data?.insert_devotion_series_one) {
        toast.success("Devotion series created successfully!", { position: "top-right" });
        emit("series-created", data.insert_devotion_series_one);
        open.value = false;

        // Reset form
        title.value = "";
        description.value = "";
        visibility.value = "public";
        coverImage.value = "";
    } else {
        toast.error("Failed to create devotion series. Please try again.");
    }
    loading.value = false;
});
</script>