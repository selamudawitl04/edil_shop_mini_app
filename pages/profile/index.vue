<template>
  <NuxtLayout name="app">
    <div class="max-w-3xl px-4 space-y-6 pt-5 lg:pt-10 mx-auto">
      <!-- Title -->
      <h1
        class="text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark"
      >
        የተጠቃሚ ቅንብሮች
      </h1>

      <!-- Avatar upload (moved inside the card) -->
      <div class="flex justify-center">
        <MediaUploadAvatar v-model="profileImage" />
      </div>

      <!-- 1. Personal Info -->

      <ProfilePersonal />

      <!-- 2. Password -->
      <ProfilePassword />

      <!-- 3. Delete Account -->
      <!-- <section class="space-y-4">
        <h2 class="text-xl font-semibold text-danger">Delete Account</h2>
        <p
          class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
        >
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <BaseButton variant="danger" @click="showDeleteModal = true"
          >Delete My Account</BaseButton
        >
      </section> -->

      <!-- Confirmation Modal -->
      <!-- <BaseConfirmation
        v-model="showDeleteModal"
        title="Confirm Account Deletion"
        description="Are you sure you want to delete your account? This action cannot be undone."
        confirm-button="Delete"
        cancel-button="Cancel"
        icon="mdi:alert"
        icon-class="text-danger"
        @confirm="deleteAccount"
      /> -->
    </div>
  </NuxtLayout>
</template>

<script setup>
const router = useRouter();
const user = useCookie("userData");

const profileImage = ref(user.value?.profile_image);

/**-----------------------------Delete Account---------- */

const showDeleteModal = ref(false);

function deleteAccount(confirmed) {
  if (confirmed) {
    // Select verified email or phone number to send otp
    let selected_method = "email";
    let identifier = user.value.email;

    if (!user.value.email || !user.value.is_email_verified) {
      selected_method = "phone";
      identifier = user.value?.phone_number;
    }
    router.push({
      path: "/auth/verify-otp",
      query: {
        [selected_method]: identifier,
        reason: "delete_account",
        send_at_start: true,
      },
    });
  }

  showDeleteModal.value = false;
}
</script>
