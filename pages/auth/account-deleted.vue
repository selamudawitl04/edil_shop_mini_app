<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4"
  >
    <div
      class="max-w-xl w-full text-center space-y-6 bg-card-light dark:bg-card-dark border border-borderColor-light dark:border-borderColor-dark p-8 rounded-2xl shadow"
    >
      <h1
        class="text-3xl font-bold text-textPrimary-light dark:text-textPrimary-dark"
      >
        Your Account Has Been Deleted
      </h1>

      <p
        class="text-textSecondary-light dark:text-textSecondary-dark text-base"
      >
        We're sorry to see you go. Your account and all associated data have
        been permanently removed from our system.
      </p>

      <div
        class="space-y-2 text-sm text-textSecondary-light dark:text-textSecondary-dark"
      >
        <p>
          If this was a mistake or you want to restore your account, please
          contact us as soon as possible.
        </p>
        <p>Account restoration is only possible within a limited time frame.</p>
      </div>

      <NuxtLink
        to="/contact"
        class="inline-block mt-4 px-6 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md font-medium hover:opacity-90 transition"
      >
        Contact Support
      </NuxtLink>

      <NuxtLink
        to="/"
        class="block mt-2 text-sm text-primary-light dark:text-primary-dark hover:underline"
      >
        Return to Homepage
      </NuxtLink>
    </div>
  </div>
</template>
