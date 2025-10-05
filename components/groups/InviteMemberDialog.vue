<template>
  <!-- 🚪 Invite Member Dialog -->
  <BaseDialog v-model="open" title="Invite Member" :autoClose="false">
    <template #content>
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- 👤 Selected User Card or Placeholder -->
        <div @click="openSelectUserDialog = true" class="cursor-pointer">
          <div
            v-if="form.user.id"
            class="flex items-start gap-3 p-3 rounded-lg border border-borderColor-light dark:border-borderColor-dark bg-white dark:bg-card-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition"
          >
            <!-- 🖼️ User Avatar -->
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

            <!-- 📝 User Info -->
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

          <!-- 🔍 Placeholder if no user selected -->
          <div
            v-else
            class="p-4 text-sm text-textSecondary-light dark:text-textSecondary-dark rounded-lg border border-dashed border-borderColor-light dark:border-borderColor-dark bg-background-light dark:bg-background-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition"
          >
            Click to select a user to invite
          </div>
        </div>

        <!-- 🛡️ Admin Access Toggle -->
        <div v-if="myRoleForGroup.role == 'group:owner'" class="mt-2">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.isAdmin"
              class="h-5 w-5 text-primary-light border-borderColor-light rounded focus:ring-primary-light dark:text-primary-dark dark:border-borderColor-dark dark:focus:ring-primary-dark"
            />
            <span
              class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
            >
              Give admin access
            </span>
          </label>
          <p
            class="mt-1 ml-8 text-xs text-textSecondary-light dark:text-textSecondary-dark"
          >
            Admins can manage members, edit the group, and moderate prayer
            requests.
          </p>
        </div>

        <!-- 🙏 Submit Button -->
        <div class="pt-2">
          <BaseButton
            :loading="loading"
            :disabled="loading || !form.user.id"
            class="w-full"
          >
            <span class="text-white" v-if="!loading">🙏 Send Invitation</span>
            <span class="text-white" v-else>Sending...</span>
          </BaseButton>
        </div>
      </form>
    </template>
  </BaseDialog>

  <!-- 🔍 User Selection Dialog -->
  <SelectUserDialog
    v-model="openSelectUserDialog"
    :exclude="[group.owner_id]"
    @selected="selectUser"
  />
</template>

<script setup>
import inviteGroupMemberQuery from "@/graphql/groups/invite.gql";
import { useForm } from "vee-validate";
import { useToast } from "vue-toast-notification";

// Setup form and helpers
const { handleSubmit } = useForm();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  group: {
    type: Object,
    required: true,
  },
  myRoleForGroup: {
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

const refetchGroup = inject("refetchGroup");

// Select user modal
const openSelectUserDialog = ref(false);

// Form state
const form = ref({
  user: {
    fullName: "",
    userName: "",
    id: "",
    photoUrl: "",
  },
  isAdmin: false,
});

// Set selected user
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

// GraphQL Mutation
const { mutate, onError, onDone, loading } = mutator(inviteGroupMemberQuery, {
  role: "group:owner",
  clientId: "auth",
  showError: false,
});

// Submit form
const onSubmit = handleSubmit(() => {
  const input = {
    user_id: form.value.user.id,
    status: "invited",
    group_id: props.group.id,
    role: form.value.isAdmin ? "group:admin" : "group:member",
  };
  mutate({ input });
});

// On successful invitation
onDone(({ data }) => {
  if (data.insert_group_members_one) {
    toast.success("✅ Invitation sent successfully!", {
      position: "top-right",
    });
    // Reset form
    form.value = {
      user: { fullName: "", userName: "", id: "", photoUrl: "" },
      isAdmin: false,
    };
    open.value = false;

    refetchGroup(); // ✅ Safe to call
  }
});

// Handle errors
onError((error) => {
  if (error.message?.includes("Uniqueness violation")) {
    toast.error("⚠️ This user is already a member of the group.", {
      position: "top-right",
    });
  } else {
    toast.error("❌ Failed to send invitation. Please try again.", {
      position: "top-right",
    });
  }
  open.value = false;
});
</script>
