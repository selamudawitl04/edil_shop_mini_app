<template>
    <!-- ✨ Update Devotion Series Dialog -->
    <BaseDialog v-model="open" title="✏️ Update Devotion Series" :autoClose="false">
        <template #content>
            <div class="max-w-3xl mx-auto">
                <form @submit.prevent="onSubmit" class="space-y-6">
                    <!-- Title -->
                    <BaseInput id="title" name="title" label="Series Title" v-model="title"
                        placeholder="Enter a title for the devotion series" rules="required" />

                    <!-- Description -->
                    <BaseTextEditor id="description" name="description" label="Series Description" v-model="description"
                        placeholder="Describe what this series is about and what readers can expect" rules="required"
                        :min-height="'150px'" :max-height="'300px'" />

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
                    <BaseButton :loading="loading" :disabled="loading || !hasChanges">
                        <span class="text-white" v-if="!loading">💾 Update Series</span>
                        <span class="text-white" v-else>Updating...</span>
                    </BaseButton>
                </form>
            </div>
        </template>
    </BaseDialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useForm } from "vee-validate";
import { useToast } from "vue-toast-notification";
import updateDevotionSeries from "@/graphql/devotions/series_update.gql";

const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue", "series-updated"]);

const props = defineProps({
    modelValue: Boolean,
    series: {
        type: Object,
        required: true,
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


const refetchSerieses = inject("refetchSerieses")
const refetchSeries = inject("refetchSeries")





const title = ref("");
const description = ref("");
const coverImage = ref("");

watch(
    () => props.series,
    (s) => {
        if (s) {
            title.value = s.title;
            description.value = s.description;
            coverImage.value = s.cover_image || "";
        }
    },
    { immediate: true }
);


const hasChanges = computed(() => {
    return (
        title.value !== props.series.title ||
        description.value !== props.series.description ||
        (coverImage.value || "") !== (props.series.cover_image || "")
    );
});


const { mutate, onDone, loading } = mutator(updateDevotionSeries, {
    clientId: "auth",
});

const onSubmit = handleSubmit(() => {
    const input = {
        title: title.value,
        description: description.value,
        cover_image: coverImage.value || null,
    };

    mutate({ input, id: props.series?.id });
});

onDone(({ data }) => {
    if (data?.update_devotion_series_by_pk) {
        toast.success("Devotion series updated successfully!", { position: "top-right" });
        open.value = false;
        if (typeof refetchSeries === "function") {
            refetchSeries();
        }
        if (typeof refetchSerieses === "function") {
            refetchSerieses();
        }
    } else {
        toast.error("Failed to update devotion series. Please try again.");
    }
});
</script>
