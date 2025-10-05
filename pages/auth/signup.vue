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
          ✨ Create an Account
        </h1>

        <!-- Tabs -->
        <div class="flex justify-center gap-4 mb-6">
          <button
            :class="[
              'px-4 py-1 text-sm font-medium rounded',
              signupMode === 'email'
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
            ]"
            @click="signupMode = 'email'"
          >
            Email
          </button>
          <button
            :class="[
              'px-4 py-1 text-sm font-medium rounded',
              signupMode === 'phone'
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
            ]"
            @click="signupMode = 'phone'"
          >
            Phone
          </button>
        </div>

        <form @submit.prevent="signup" class="space-y-5">
          <!-- Full Name -->
          <BaseInput
            id="name"
            name="name"
            label="Full Name"
            placeholder="Your full name"
            rules="required"
            v-model="name"
          />

          <!-- Email or Phone -->
          <div>
            <BaseInput
              v-if="signupMode === 'email'"
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
              rules="required"
              v-model="phone"
            />
          </div>

          <!-- User Name  -->

          <BaseUserName v-model="userName" />

          <!-- Password -->
          <BaseInput
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            rules="required|min:1"
            v-model="password"
          />

          <!-- Confirm Password -->
          <BaseInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            rules="required|confirmed:@password"
            v-model="confirmPassword"
          />

          <!-- Sign Up Button -->

          <BaseButton :loading="loading" :disabled="loading">
            <span class="text-white" v-if="!loading">Sign Up</span>
            <span class="text-white" v-else>Loading...</span>
          </BaseButton>
        </form>

        <!-- Redirect -->
        <p
          class="text-sm text-center mt-6 text-textSecondary-light dark:text-textSecondary-dark"
        >
          Already have an account?
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
import { useForm } from "vee-validate";
import signUpMutation from "@/graphql/auth/signup.gql";

const { handleSubmit } = useForm();
const router = useRouter();

const signupMode = ref("email");
const name = ref("");
const email = ref("");
const phone = ref("");
const userName = ref("");
const password = ref("");
const confirmPassword = ref("");

const { mutate, loading, onDone } = mutator(signUpMutation, {});
const signup = handleSubmit(() => {
  const input = {
    identifier: signupMode.value === "email" ? email.value : phone.value,
    password: password.value,
    full_name: name.value,
    user_name: userName.value,
    selected_method: signupMode.value,
  };
  mutate({ input });
});

onDone(async (result) => {
  if (result.data?.signup) {
    // Redirect to `to` query if exist or redirect to index route
    // ❗ nextTick is required to wait for DOM updates and later redirect
    const contact = signupMode.value === "email" ? email.value : phone.value;
    router.push({
      path: "/auth/verify-otp",
      query: {
        [signupMode.value]: contact,
        reason: "verify_" + signupMode.value,
      },
    });
  }
});
</script>
