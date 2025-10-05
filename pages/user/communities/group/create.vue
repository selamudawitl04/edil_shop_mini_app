<script setup>
import { reactive, ref, watch, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import addQuery from "@/graphql/groups/create.gql";
import { useToast } from "vue-toast-notification";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const steps = ["Basic Info", "Medias", "Categories", "Visibility", "Settings"];

// --- Active step from URL query or default ---
const activeStep = ref(parseInt(route.query.step || 0));

// --- Form state ---
const form = reactive({
  name: "",
  description: "",
  language: "",
  profileImage: "",
  coverImage: "",
  images: [],
  categories: [],
  visibility: "public",
  settings: {
    allowMembersToInvite: false,
    autoApproveMembers: true,
    allowMembersToCreatePrayerRequest: true,
    allowMembersToCreateDevotion: true,
    allowMembersToCreateTestimony: true,
  },
});

const pageTitle = computed(() => {

  return `Create Prayer Group - ${steps[activeStep.value]}`;
});

// --- Restore saved form ---
const saved = localStorage.getItem("group-create-form");
if (saved) Object.assign(form, JSON.parse(saved));

// --- Save form to local storage ---
watch(
  form,
  (newVal) => {
    localStorage.setItem("group-create-form", JSON.stringify(newVal));
  },
  { deep: true }
);

// --- Sync activeStep with route changes ---
watch(
  () => route.query.step,
  (val) => {
    const stepNum = parseInt(val || 0);
    if (!isNaN(stepNum) && stepNum >= 0 && stepNum < steps.length) {
      activeStep.value = stepNum;
    }
  }
);

function goToStep(step) {
  router.push({
    query: { ...route.query, step },
  });
}

function nextStep() {
  if (activeStep.value < steps.length - 1) {
    goToStep(activeStep.value + 1);
  }
}

function prevStep() {
  if (activeStep.value > 0) {
    goToStep(activeStep.value - 1);
  }
}

const refetchGroups = inject("refetchGroups");

// --- Mutation ---
const { mutate, onDone, loading } = mutator(addQuery, {
  clientId: "auth",
  role: "group:owner",
});

const onSubmit = async () => {
  const input = {
    name: form.name,
    description: form.description,
    language_code: form.language,
    profile_image: form.profileImage,
    cover_image: form.coverImage,
    is_private: form.visibility != "private",
    allow_members_to_create_request: form.settings.allowMembersToCreatePrayerRequest,
    allow_members_to_create_devotion: form.settings.allowMembersToCreateDevotion,
    allow_members_to_create_testimony: form.settings.allowMembersToCreateTestimony,
    group_categories: {
      data: form.categories.map((categoryId) => ({
        category_id: categoryId,
      })),
    },
  };

  if (form.visibility == "private") {
    input.invite_only = false;
    input.allow_members_to_invite_other = form.settings.allowMembersToInvite;
    input.auto_approve_members = true;
  } else if (form.visibility == "hidden") {
    input.invite_only = true;
    input.allow_members_to_invite_other = false;
    input.allow_members_to_create_request = true;
    input.allow_members_to_create_devotion = true;
    input.allow_members_to_create_testimony = true;
  } else {
    input.auto_approve_members = true;
    input.allow_members_to_invite_other = true;
  }

  mutate({ input });
};

function clearFormData() {
  localStorage.removeItem("group-create-form");
  Object.assign(form, {
    name: "",
    description: "",
    language: "",
    profileImage: "",
    coverImage: "",
    images: [],
    categories: [],
    visibility: "public",
    settings: {
      allowMembersToInvite: false,
      autoApproveMembers: true,
      allowMembersToCreatePrayerRequest: true,
      allowMembersToCreateDevotion: true,
      allowMembersToCreateTestimony: true,
    },
  });
}

function isFormEmpty() {
  return (
    !form.name &&
    !form.description &&
    !form.language &&
    !form.coverImage &&
    form.images.length === 0 &&
    form.categories.length === 0
  );
}


onDone(async ({ data }) => {
  const newGroup = data?.insert_prayer_groups_one;
  if (newGroup) {
    toast.success("Prayer group created successfully!", { position: "top-right" });
    if (typeof refetchGroups === "function") refetchGroups();
    clearFormData(); // ✅ clears storage & form
    router.replace(`/user/communities/group/${newGroup.id}`);
  } else {
    toast.error("Something went wrong. Please try again later.", { position: "top-right" });
  }
});



// Prevent leaving without confirmation
onMounted(() => {
  window.addEventListener("beforeunload", preventUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", preventUnload);
});

function preventUnload(e) {
  if (!isFormEmpty()) {
    e.preventDefault();
    e.returnValue = "";
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (!isFormEmpty()) {
    if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
      clearFormData();
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});


const openDialog = ref(false);

onMounted(() => {
  openDialog.value = true;
});

</script>

<template>








  <BaseDialog v-model="openDialog" @close="openDialog = false" :fullHeight="true" :title="pageTitle"
    :bodyClass="'max-w-3xl'">
    <template #content>

      <div>


        <GroupsCreateBasicInfo v-if="activeStep === 0" v-model="form" @next="nextStep" />

        <GroupsCreateCategories v-if="activeStep === 1" v-model="form.categories" @next="nextStep" @back="prevStep" />

        <GroupsCreateVisibility v-if="activeStep === 2" v-model="form" @next="nextStep" @back="prevStep" />

        <GroupsCreateSettings v-if="activeStep === 3" v-model="form" @next="nextStep" @back="prevStep" />

        <GroupsCreateMedias v-if="activeStep === 4" v-model="form" @next="onSubmit" @back="prevStep" />


      </div>


    </template>
  </BaseDialog>
</template>
