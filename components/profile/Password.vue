<template>
  <!-- ፓስዎርድ መቀየሪያ -->
  <section
    class="space-y-5 bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
  >
    <!-- ርዕስ -->
    <h2
      class="text-lg sm:text-xl font-bold text-textPrimary-light dark:text-textPrimary-dark flex items-center gap-2"
    >
      🔒 ፓስዎርድ አዘምን
    </h2>

    <!-- ፓስዎርድ መቀየሪያ ፎርም -->
    <form @submit.prevent="changePassword" class="space-y-4">
      <!-- አሁን ያለው ፓስዎርድ -->
      <BaseInput
        v-model="passwordForm.current"
        label="🔑 አሁን ያለው ፓስዎርድ"
        type="password"
        name="password"
        rules="required|password"
      />

      <!-- አዲስ ፓስዎርድ -->
      <BaseInput
        v-model="passwordForm.new"
        label="✨ አዲስ ፓስዎርድ"
        name="newPassword"
        type="password"
        rules="required|password"
      />

      <!-- አዲሱን ፓስዎርድ ያረጋግጡ -->
      <BaseInput
        v-model="passwordForm.confirm"
        label="✅ አዲሱን ፓስዎርድ ያረጋግጡ"
        type="password"
        name="confirmPassword"
        rules="required|confirmed:@newPassword"
      />

      <!-- መላኪያ ቁልፍ -->
      <BaseButton :loading="loading" :disabled="loading" type="submit" full>
        🔄 ፓስዎርድ ቀይር
      </BaseButton>
    </form>
  </section>
</template>

<script setup>
import changePasswordMutation from "@/graphql/auth/change_password.gql";
import { useToast } from "vue-toast-notification";
import { useForm } from "vee-validate";

const router = useRouter();
const toast = useToast();
const { handleSubmit } = useForm();

const user = useCookie("userData");

const passwordForm = ref({
  current: "",
  new: "",
  confirm: "",
});

const { mutate, onDone, loading, onError } = mutator(changePasswordMutation, {
  clientId: "auth",
});

// ማስተካከያ በተሳካ ጊዜ
onDone(() => {
  user.value = null;
  toast.success("ፓስዎርድ በትክክል ተቀይሯል።", { position: "top-right" });
  router.replace("/auth/login");
});

// ፓስዎርድ መቀየሪያ ፋንክሽን
const changePassword = handleSubmit(() => {
  const input = {
    old_password: passwordForm.value.current,
    new_password: passwordForm.value.new,
  };
  mutate({ input });
});
</script>
