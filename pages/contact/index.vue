<template>
  <NuxtLayout>
    <section class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Contact Us</h1>
      <p class="text-lg text-textPrimary-light dark:text-textPrimary-dark mb-4">
        We would love to hear from you! Whether you have questions, feedback, or
        just want to say hello, feel free to reach out.
      </p>

      <form @submit.prevent="submitForm" class="space-y-6">
        <BaseInput
          id="name"
          v-model="form.name"
          label="Your Name"
          placeholder="Enter your name"
          rules="required"
        />
        <BaseInput
          id="email"
          v-model="form.email"
          label="Your Email"
          type="email"
          placeholder="Enter your email"
          rules="required|email"
        />
        <BaseTextInput
          id="message"
          v-model="form.message"
          label="Message"
          placeholder="Type your message here..."
          rows="5"
          rules="required|min:10|max:500"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-primary-light text-white rounded hover:bg-primary-dark dark:hover:bg-primary-light dark:text-black transition-colors duration-200"
        >
          Send Message
        </button>
      </form>
    </section>
  </NuxtLayout>
</template>
<script setup>
const form = ref({
  name: "",
  email: "",
  message: "",
});

const submitForm = async () => {
  try {
    form.value = {
      name: "",
      email: "",
      message: "",
    };
  } catch (error) {
    toast.error("Failed to send message.");
  }
};
</script>
