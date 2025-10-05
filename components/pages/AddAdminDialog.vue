<template>
  <!-- 👤 Add Admin Dialog -->
  <BaseDialog v-model="open" title="Add Page Admin" :autoClose="false">
    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- 👤 Selected User -->
        <div @click="openSelectUserDialog = true" class="cursor-pointer">
          <div
            v-if="form.user.id"
            class="flex items-start gap-3 p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition"
          >
            <!-- 🖼️ Avatar -->
            <div
              class="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center font-bold text-lg overflow-hidden"
            >
              <img
                v-if="form.user.photoUrl"
                :src="form.user.photoUrl"
                class="w-full h-full object-cover rounded-full"
                alt="User Image"
              />
              <span v-else>{{ form.user.fullName?.charAt(0) }}</span>
            </div>

            <!-- 👤 Info -->
            <div class="flex-1">
              <div
                class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
              >
                {{ form.user.fullName }}
              </div>
              <div
                class="text-xs text-textSecondary-light dark:text-textSecondary-dark"
              >
                {{ form.user.userName }}
              </div>
            </div>
          </div>

          <!-- Placeholder -->
          <div
            v-else
            class="p-4 text-sm text-textSecondary-light dark:text-textSecondary-dark rounded-lg border border-dashed border-borderColor-light dark:border-borderColor-dark bg-background-light dark:bg-background-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition"
          >
            Click to select a user to make admin
          </div>
        </div>

        <!-- ✅ Submit -->
        <div class="pt-2">
          <BaseButton
            :loading="loading"
            :disabled="loading || !form.user.id"
            class="w-full"
          >
            <span class="text-white" v-if="!loading">➕ Add Admin</span>
            <span class="text-white" v-else>Adding...</span>
          </BaseButton>
        </div>
      </form>
    </template>
  </BaseDialog>

  <!-- 🔍 User Selector -->
  <SelectUserDialog
    v-model="openSelectUserDialog"
    :exclude="[page.created_by]"
    @selected="selectUser"
  />
</template>

<script setup>
import addPageAdminMutation from "@/graphql/pages/add_admin.gql";
import { useForm } from "vee-validate";
import { useToast } from "vue-toast-notification";

const { handleSubmit } = useForm();
const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  page: {
    type: Object,
    required: true,
  },
});

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const refetchPage = inject("refetchPage");

const openSelectUserDialog = ref(false);

const form = ref({
  user: {
    fullName: "",
    userName: "",
    id: "",
    photoUrl: "",
  },
});

const selectUser = (user) => {
  if (user) {
    form.value.user = {
      id: user.id,
      fullName: user.full_name,
      userName: user.user_name,
      photoUrl: user.profile_image,
    };
  }
};

const { mutate, onDone, onError, loading } = mutator(addPageAdminMutation, {
  role: "page:owner",
  clientId: "auth",
});

// ✅ Submit handler
const onSubmit = handleSubmit(() => {
  const input = {
    user_id: form.value.user.id,
    page_id: props.page.id,
    role: "page:admin",
  };
  mutate({ input });
});

// ✅ Success
onDone(({ data }) => {
  if (data.insert_page_admins_one) {
    toast.success("🎉 Admin added successfully!", {
      position: "top-right",
    });
    form.value = {
      user: { fullName: "", userName: "", id: "", photoUrl: "" },
    };
    open.value = false;

    if (typeof refetchPage === "function") refetchPage();
  }
});

// ❌ Error handling
onError((error) => {
  if (error.message?.includes("Uniqueness violation")) {
    toast.error("⚠️ This user is already an admin.", {
      position: "top-right",
    });
  } else {
    toast.error("❌ Failed to add admin. Please try again.", {
      position: "top-right",
    });
  }
});
</script>
