<template>
  <NuxtLayout>
    <section
      class="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 py-12">
      <div
        class="w-full max-w-md bg-card-light dark:bg-card-dark border border-borderColor-light dark:border-borderColor-dark p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-6 text-center text-textPrimary-light dark:text-textPrimary-dark">
          🔒 Reset Your Password
        </h1>

        <form @submit.prevent="resetPassword" class="space-y-5">
          <!-- New Password -->
          <BaseInput id="newPassword" name="newPassword" label="New Password" type="password" rules="required|min:6"
            v-model="newPassword" placeholder="••••••••" />

          <!-- Confirm Password -->
          <BaseInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password"
            rules="required|confirmed:@newPassword" v-model="confirmPassword" placeholder="••••••••" />

          <!-- Submit -->
          <button type="submit"
            class="w-full py-2 rounded-md bg-primary-light dark:bg-primary-dark text-white text-sm font-semibold hover:opacity-90">
            Reset Password
          </button>
        </form>

        <!-- Back to login -->
        <p class="text-sm text-center mt-6 text-textSecondary-light dark:text-textSecondary-dark">
          Go back to
          <NuxtLink to="/auth/login" class="text-primary-light dark:text-primary-dark font-medium hover:underline ml-1">
            Login
          </NuxtLink>
        </p>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import { useForm } from "vee-validate";
import resetPasswordMutation from "@/graphql/auth/reset_password.gql";

const { handleSubmit } = useForm();

const route = useRoute();
const router = useRouter();

const newPassword = ref("");
const confirmPassword = ref("");
const resetToken = route.query.reset_token;
const mode = route.query.mode || "email";

const emailOrPhone = mode == "email" ? route.query.email : route.query.phone;

// Reset password
const {
  mutate: resetPasswordMutate,
  loading: resetPasswordLoading,
  onDone: resetPasswordDone,
} = mutator(resetPasswordMutation, {});

const resetPassword = handleSubmit(async () => {
  const input = {
    reset_token: resetToken,
    password: newPassword.value,
  };
  resetPasswordMutate({ input });
});

resetPasswordDone(() => {
  router.replace({
    path: "/auth/login",
    query: { mode, [mode]: emailOrPhone },
  });
});
</script>
