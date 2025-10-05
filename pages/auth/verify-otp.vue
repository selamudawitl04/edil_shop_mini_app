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
          🔑 Enter OTP Code
        </h1>

        <p
          class="text-sm text-center mb-6 text-textSecondary-light dark:text-textSecondary-dark"
        >
          We’ve sent a 6-digit code to your
          <strong class="font-medium">
            {{ isPhone ? "phone number" : "email address" }} </strong
          >. Please enter it below to continue.
        </p>

        <form @submit.prevent="verifyCode" class="space-y-5">
          <!-- OTP Code -->
          <BaseInput
            label="Verification Code"
            name="code"
            rules="required|length:6"
            v-model="code"
            placeholder="123456"
          />

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-2 rounded-md bg-primary-light dark:bg-primary-dark text-white text-sm font-semibold hover:opacity-90"
          >
            Verify Code
          </button>
        </form>

        <!-- Resend -->
        <p
          class="text-sm text-center mt-6 text-textSecondary-light dark:text-textSecondary-dark"
        >
          Didn’t receive the code?
          <button
            @click="resendCode"
            class="text-primary-light dark:text-primary-dark font-medium hover:underline ml-1"
          >
            Resend
          </button>
        </p>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import { useForm } from "vee-validate";
import verifyOTPMutation from "@/graphql/auth/verify_otp.gql";
import verifyEmailMutation from "@/graphql/auth/verify_email.gql";
import verifyPhoneMutation from "@/graphql/auth/verify_phone.gql";
import forgotPasswordMutation from "@/graphql/auth/forgot_password.gql";
import deleteAccountMutation from "@/graphql/auth/delete_account.gql";

import { useToast } from "vue-toast-notification";

const toast = useToast();
const { handleSubmit } = useForm();
const route = useRoute();
const router = useRouter();

const code = ref("");
const reason = route.query.reason || "unknown";
const phoneOrEmail = route.query.phone || route.query.email;
// If there is no phone or email in query params, redirect to error page

if (!phoneOrEmail || !phoneOrEmail?.length) {
  router.push("/error");
}

const user = useCookie("userData");
const isPhone = !!route.query.phone;

const {
  mutate: verifyOTPMutate,
  loading: verifyOTPLoading,
  onDone: verifyOTPDone,
} = mutator(verifyOTPMutation, {});
verifyOTPDone(async (result) => {
  if (result.data?.verify_otp) {
    // Check the verification purpose and redirect to the appropriate page
    // 1. If the verification purpose is to verify email, show success message
    // 2. If the verification purpose is to verify phone, show success message
    // 3. If the verification purpose is to reset password then redirect to the reset password page
    const data = result.data.verify_otp;

    if (data.purpose == "verify_email") {
      // Show success message
      toast.success("Your email has been verified successfully", {
        position: "top-right",
      });

      if (user.value) {
        const _user = {
          ...user.value,
          email: phoneOrEmail,
          is_email_verified: true,
        };
        user.value = _user;
        router.replace("/user/profile");
      } else {
        await nextTick(() => {
          router.replace({
            path: "/auth/login",
            query: { mode: "email", email: phoneOrEmail },
          });
        });
      }
    } else if (data.purpose == "verify_phone") {
      // Show success message
      toast.success("Your phone number has been verified successfully", {
        position: "top-right",
      });

      if (user.value) {
        const _user = {
          ...user.value,
          phone_number: phoneOrEmail,
          is_phone_number_verified: true,
        };

        user.value = _user;
        router.replace("/user/profile");
      } else {
        await nextTick(() => {
          router.replace({
            path: "/auth/login",
            query: { mode: "phone", phone: phoneOrEmail },
          });
        });
      }
    } else if (data.purpose == "delete_account") {
      toast.success("Your account is deleted", { position: "top-right" });

      user.value = null;
      router.replace("/auth/account-deleted");
    } else if (data.purpose == "reset_password") {
      const mode = isPhone ? "phone" : "email";
      router.push({
        path: "/auth/reset-password",
        query: {
          reset_token: data.token,
          mode,
          [mode]: phoneOrEmail,
        },
      });
    } else {
      alert("Some thing went Wrong");
    }
  }
});

const verifyCode = handleSubmit(async () => {
  const input = {
    identifier: phoneOrEmail,
    code: code.value,
  };
  verifyOTPMutate({ input });
});

// Resend Email Code

const {
  mutate: verifyEmailMutate,
  loading: verifyEmailLoading,
  onDone: verifyEmailDone,
} = mutator(verifyEmailMutation, {});
verifyEmailDone(() => {
  toast.success("Otp has sent successfully", { position: "top-right" });
});

// Resend Phone Code

const {
  mutate: verifyPhoneMutate,
  loading: verifyPhoneLoading,
  onDone: verifyPhoneDone,
} = mutator(verifyPhoneMutation, {});
verifyPhoneDone(() => {
  toast.success("Otp has sent successfully", { position: "top-right" });
});

// Forgot password
const {
  mutate: forgotPasswordMutate,
  loading: forgotPasswordLoading,
  onDone: forgotPasswordDone,
} = mutator(forgotPasswordMutation, {});
forgotPasswordDone(() => {
  toast.success("Otp has sent successfully", { position: "top-right" });
});

// Delete Account
const {
  mutate: deleteMutate,
  loading: deleteLoading,
  onDone: deleteDone,
} = mutator(deleteAccountMutation, { clientId: "auth" });

deleteDone((result) => {
  toast.success("Otp has sent successfully", { position: "top-right" });
});

async function resendCode() {
  if (reason == "verify_email") {
    const input = {
      email: phoneOrEmail,
    };

    verifyEmailMutate({ input });
  } else if (reason == "verify_phone") {
    const input = {
      phone_number: phoneOrEmail,
    };
    verifyPhoneMutate({ input });
  } else if (reason == "delete_account") {
    const selected_method = isPhone ? "phone" : "email";
    const input = {
      identifier: phoneOrEmail,
      selected_method,
    };
    deleteMutate({ input });
  } else {
    const selected_method = isPhone ? "phone" : "email";
    const input = {
      identifier: phoneOrEmail,
      selected_method,
    };
    forgotPasswordMutate({ input });
  }
}

// Check the route check send in first time

if (route.query?.send_at_start) {
  resendCode();
}
</script>
