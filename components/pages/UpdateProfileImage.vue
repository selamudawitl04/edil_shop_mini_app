<script setup>
import updatePageInfo from "@/graphql/pages/update_page_info.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  page: {
    type: Object,
    required: true,
  },
  myRoleForPage: {
    type: Object,
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
const refetchPage = inject("refetchPage");
const refetchPages = inject("refetchPages");


// GraphQL: Update Group
const { mutate, onDone, loading } = mutator(updatePageInfo, {
  clientId: "auth",
  role: props.myRoleForPage?.role || "group:owner", // Assuming user will join as a regular members
});



onDone(({ data }) => {
  const newRequest = data?.update_pages_by_pk;
  if (newRequest) {
    toast.success("Profile image updated successfully!", {
      position: "top-right",
    });
    if (typeof refetchPage === "function") {
      refetchPage();
    }

    if (typeof refetchPages === "function") {
      refetchPages();
    }
  } else {
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });
  }

  open.value = false;
});


const profileImageUploader = ref(null);
const handleProfileImageUpload = (url) => {

  const input = {
    profile_image: url,
  }
  mutate({
    id: props.page.id,
    input,
  });

}

defineExpose({
  openFilePicker: () => {
    profileImageUploader.value.openFilePicker();
  },
});
</script>

<template>


  <MediaUploadWithCropper :aspect-ratio="1" ref="profileImageUploader" @upload="handleProfileImageUpload" />
  <!-- Edit button, absolute bottom-right -->
  <button @click="profileImageUploader.openFilePicker()" type="button"
    class="absolute bottom-1 right-1 bg-primary-light dark:bg-primary-dark text-white rounded-full p-1 shadow-md hover:bg-primary-dark dark:hover:bg-primary-light transition-colors focus:outline-none"
    aria-label="Change profile image">
    <Icon name="mdi:camera" size="23" />
  </button>


</template>
