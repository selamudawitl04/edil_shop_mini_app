<template>
  <!-- ----------Profile(Full Name) Edit Dialog-------- -->

  <BaseDialog v-model="openEditFullNameDialog" title="Edit Profile">
    <template #content>
      <form @submit.prevent="updateProfile" class="space-y-4">
        <BaseInput
          v-model="form.fullName"
          label="Full Name"
          placeholder="John Doe"
          name="full_name"
          id="full_name"
        />

        <BaseButton
          :loading="updateUserLoading"
          :disabled="updateUserLoading"
          type="submit"
          class="mt-2"
          >Submit</BaseButton
        >
      </form>
    </template>
  </BaseDialog>

  <!-- ---------------Update Phone Dialog -->

  <BaseDialog v-model="openUpdatePhoneDialog" title="Update Phone Number">
    <template #content>
      <form @submit.prevent="updatePhone" class="space-y-4">
        <BasePhoneInput
          name="phone"
          v-model="form.alternate_phone"
          label="Phone Number"
          rules="required"
        />
        <BaseButton
          :loading="updateUserLoading"
          :disabled="updateUserLoading"
          type="submit"
          class="mt-2"
          >Submit</BaseButton
        >
      </form>
    </template>
  </BaseDialog>

  <!-- ---------------Add Email Dialog -->

  <BaseDialog v-model="openAddEmailDialog" title="Add email address">
    <template #content>
      <form @submit.prevent="addEmail" class="space-y-4">
        <BaseInput
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          name="email"
        />
        <BaseButton
          :loading="updateUserLoading"
          :disabled="updateUserLoading"
          type="submit"
          class="mt-2"
          >Submit</BaseButton
        >
      </form>
    </template>
  </BaseDialog>

  <!-- ግል መረጃ ክፍል -->
  <section
    class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 space-y-6 shadow-sm"
  >
    <!-- Section Heading -->
    <div class="flex justify-between items-center">
      <h2
        class="text-lg sm:text-xl font-bold text-textPrimary-light dark:text-textPrimary-dark flex items-center gap-2"
      >
        👤 ግል መረጃ
      </h2>
    </div>

    <!-- ሙሉ ስም -->
    <div>
      <BaseInput
        v-model="user.name"
        placeholder="ሙሉ ስም"
        name="name"
        id="name"
        disabled
      >
        <template #label>
          <div class="flex justify-between mb-1">
            <span
              class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
            >
              👤 ሙሉ ስም
            </span>
          </div>
        </template>
      </BaseInput>
    </div>

    <!-- ስልክ ቁጥር -->
    <div v-if="user.phone">
      <BaseInput
        name="phone"
        v-model="user.phone"
        placeholder="+251900000000"
        disabled
      >
        <template #label>
          <span
            class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
          >
            📞 ስልክ ቁጥር
          </span>
        </template>
      </BaseInput>
    </div>

    <!-- አማራጭ ስልክ ቁጥር -->
    <div>
      <BaseInput
        name="alternate_phone"
        v-model="user.alternate_phone"
        placeholder="+251911111111"
        disabled
      >
        <template #label>
          <div class="flex justify-between items-center mb-1">
            <span
              class="text-sm font-medium text-textPrimary-light dark:text-textPrimary-dark"
            >
              📱 አማራጭ ስልክ ቁጥር
            </span>
            <!-- <button
              @click="openUpdatePhoneDialog = true"
              type="button"
              class="text-xs px-3 py-1 rounded-lg border border-borderColor-light dark:border-borderColor-dark text-textPrimary-light dark:text-textPrimary-dark hover:bg-primary hover:text-white transition"
            >
              ቀይር
            </button> -->

            <button
              @click.stop="openUpdatePhoneDialog = true"
              class="px-2 py-1 text-sm font-medium border rounded-lg text-primary-light border-primary-light hover:bg-primary-light hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              <Icon name="mdi:pencil" class="w-4 h-4" />
              ቀይር
            </button>
          </div>
        </template>
      </BaseInput>
    </div>
  </section>
</template>
<script setup>
import updateUserMutation from "@/graphql/auth/update_user.gql";
import { useToast } from "vue-toast-notification";
import { useForm } from "vee-validate";

const router = useRouter();
const toast = useToast();
const user = useCookie("userData");

// form states
const form = ref({
  alternate_phone: user.value?.alternate_phone || "",
});

const passwordForm = ref({
  current: "",
  new: "",
  confirm: "",
});

// control which field is updating
const updateUserType = ref(""); // full_name, email, or phone_number

// Dialog visibility states
const openEditFullNameDialog = ref(false);
const openAddEmailDialog = ref(false);
const openUpdatePhoneDialog = ref(false);

// Toast + GraphQL
const { handleSubmit } = useForm();
const {
  mutate: updateUserMutate,
  onDone: updateUserDone,
  loading: updateUserLoading,
} = mutator(updateUserMutation, { clientId: "auth" });

updateUserDone(({ data }) => {
  if (data?.update_users_by_pk) {
    let newUser = { ...user.value };

    newUser.alternate_phone = form.value.alternate_phone;

    user.value = newUser;
    toast.success("User information updated successfully", {
      position: "top-right",
    });
  }

  openUpdatePhoneDialog.value = false;
});

// ---- Update Handlers ----

const updatePhone = handleSubmit(() => {
  if (user.value.alternate_phone === form.value.alternate_phone) {
    toast.success("No change made", { position: "top-right" });
    return;
  }

  updateUserMutate({
    input: { alternate_phone: form.value.alternate_phone },
    id: user.value.id,
  });
  updateUserType.value = "alternate_phone";
});

// ---- Password / Delete ----

function updatePassword() {
  console.log("Update Password:", passwordForm.value);
}

const showDeleteModal = ref(false);

function deleteAccount() {
  console.log("Deleting account...");
  // Call delete account API
}
</script>
