<template>
  <NuxtLayout>
    <section
      class="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 py-12"
    >
      <div
        class="w-full max-w-md bg-card-light dark:bg-card-dark border border-borderColor-light dark:border-borderColor-dark p-8 rounded-lg shadow-md"
      >
        <h1
          class="text-2xl font-bold mb-6 text-center text-textPrimary-light dark:text-textPrimary-dark"
        >
          🔑 Forgot Password
        </h1>

        <!-- Tabs -->
        <div class="flex justify-center gap-4 mb-6">
          <button
            :class="[
              'px-4 py-1 text-sm font-medium rounded',
              mode === 'email'
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
            ]"
            @click="mode = 'email'"
          >
            Email
          </button>
          <button
            :class="[
              'px-4 py-1 text-sm font-medium rounded',
              mode === 'phone'
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
            ]"
            @click="mode = 'phone'"
          >
            Phone
          </button>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-5">
          <BaseInput
            v-if="mode === 'email'"
            id="email"
            name="email"
            label="Email Address"
            placeholder="you@example.com"
            rules="required|email"
            v-model="email"
          />

          <BasePhoneInput
            v-else
            name="phone"
            label="Phone Number"
            v-model="phone"
            rules="required"
          />

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-2 rounded-md bg-primary-light dark:bg-primary-dark text-white text-sm font-semibold hover:opacity-90"
          >
            Send Reset OTP
          </button>
        </form>

        <!-- Back to login -->
        <p
          class="text-sm text-center mt-6 text-textSecondary-light dark:text-textSecondary-dark"
        >
          Remember your password?
          <NuxtLink
            to="/auth/login"
            class="text-primary-light dark:text-primary-dark font-medium hover:underline ml-1"
          >
            Login
          </NuxtLink>
        </p>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import forgotPasswordMutation from "@/graphql/auth/forgot_password.gql";

import { useForm } from "vee-validate";
const router = useRouter();
const mode = ref("email");
const email = ref("");
const phone = ref("");

const { handleSubmit } = useForm();

// Forgot password
const {
  mutate: forgotPasswordMutate,
  loading: forgotPasswordLoading,
  onDone: forgotPasswordDone,
} = mutator(forgotPasswordMutation, {});

const onSubmit = handleSubmit(() => {
  const input = {
    identifier: mode.value === "email" ? email.value : phone.value,
    selected_method: mode.value,
  };
  forgotPasswordMutate({ input });
  // Simulate sending the reset code
  // You can replace this with a real API call
});

forgotPasswordDone((result) => {
  const contact = mode.value === "email" ? email.value : phone.value;
  router.push({
    path: "/auth/verify-otp",
    query: {
      [mode.value]: contact,
      reason: "reset_password",
    },
  });
});
</script>
