<template>
  <!-- Footer -->
  <footer
    class="bg-card-light dark:bg-card-dark border-t border-borderColor-light dark:border-borderColor-dark py-12 px-4 sm:px-8 md:px-16 lg:px-32"
  >
    <div
      class="max-w-6xl mx-auto grid gap-8 md:grid-cols-4 text-textSecondary-light dark:text-textSecondary-dark"
    >
      <div>
        <h3
          class="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark"
        >
          Entsely
        </h3>
        <p class="mt-2 text-sm">
          A place where faith meets action. Share prayers and uplift others
          around the world.
        </p>
      </div>
      <div>
        <h4
          class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
        >
          Explore
        </h4>
        <ul class="space-y-1 text-sm">
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/prayer-requests">Top Prayers</NuxtLink></li>
          <li>
            <NuxtLink to="/summit-prayer-requests">Submit Prayer</NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <h4
          class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
        >
          About
        </h4>
        <ul class="space-y-1 text-sm">
          <li><NuxtLink to="/about">Our Mission</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h4
          class="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2"
        >
          Stay Connected
        </h4>
        <form @submit.prevent class="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Your email"
            class="rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-borderColor-light dark:border-borderColor-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none"
          />
          <button
            class="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white text-sm font-semibold rounded-md hover:opacity-90"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
    <div
      class="mt-12 text-center text-xs text-textSecondary-light dark:text-textSecondary-dark"
    >
      © {{ new Date().getFullYear() }} Entsely. All rights reserved.
    </div>
  </footer>
</template>
