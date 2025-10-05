<!-- Only the creator of the devotion can update it -->

<template>
    <!-- ✨ Edit Devotion Dialog -->
    <BaseDialog v-model="open" title="✏️ Edit Devotion" :autoClose="false">
        <template #content>
            <div class="max-w-3xl mx-auto">
                <form @submit.prevent="onSubmit" class="space-y-6">

                    <!-- Title -->
                    <BaseInput id="title" name="title" label="Title" v-model="title"
                        placeholder="Enter a title for the devotion" rules="required" />

                    <!-- Content -->
                    <BaseTextEditor id="content" name="content" label="Devotion Content" v-model="content"
                        placeholder="Write the main body of the devotion here" rules="required" :min-height="'300px'"
                        :max-height="'600px'" />



                    <!-- Optional Cover Image -->
                    <div
                        class="mb-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-borderColor-light dark:border-borderColor-dark">
                        <label class="block mb-2 text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark">
                            Cover Image
                            <span
                                class="text-sm text-textSecondary-light dark:text-textSecondary-dark">(optional)</span>
                        </label>
                        <MediaImageUpload v-model="coverImage" :folder="'uploads/devotions'" />
                    </div>

                    <!-- Submit Button -->
                    <BaseButton :loading="loading" :disabled="loading || !hasChanged">
                        <span class="text-white" v-if="!loading">✅ Update Devotion</span>
                        <span class="text-white" v-else>Updating...</span>
                    </BaseButton>

                </form>
            </div>
        </template>
    </BaseDialog>
</template>

<script setup>
import updateDevotion from "@/graphql/devotions/update.gql";
import { useToast } from "vue-toast-notification";

const user = useCookie("userData");
const toast = useToast();
const { handleSubmit } = useForm();
const emit = defineEmits(["update:modelValue", "updated"]);

const props = defineProps({
    modelValue: Boolean,
    devotion: {
        type: Object,
        required: true,
    }


});

const refetchDevotion = inject("refetchDevotion");
const refetchDevotions = inject("refetchDevotions");

// Open state
const open = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

// Pre-fill fields
const title = ref(props.devotion.title || "");
const content = ref(props.devotion.content || "");
const coverImage = ref(props.devotion.cover_image || null);


// implment has changed
const hasChanged = computed(() => {
    return title.value !== props.devotion.title || content.value !== props.devotion.content || coverImage.value != props.devotion.cover_image;
});



const { mutate, onDone, loading } = mutator(updateDevotion, {
    clientId: "auth",
});

const onSubmit = handleSubmit(() => {
    const input = {
        title: title.value,
        content: content.value,
        cover_image: coverImage.value || null,
    };

    mutate({ input, id: props.devotion.id }); // pass both input + ID
});

onDone(({ data }) => {
    if (data?.update_devotion_devotions_by_pk) {
        toast.success("Devotion updated successfully!", {
            position: "top-right",
        });
        emit("updated", data.update_devotion_devotions_by_pk);

        if (typeof refetchDevotion === "function") {
            refetchDevotion();
        }

        if (typeof refetchDevotions === "function") {
            refetchDevotions();
        }
        open.value = false;
    } else {
        toast.error("Failed to update devotion. Please try again.", {
            position: "top-right",
        });
    }
});
</script>
