<script setup>
const router = useRouter();

const goBack = () => {
  if (window?.history?.state?.back) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>

<template>
  <p
    @click="goBack"
    class="text-sm text-primary-light dark:text-primary-dark hover:underline cursor-pointer"
  >
    ← Back
  </p>
</template>
