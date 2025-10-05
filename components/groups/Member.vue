<template>
  <NuxtLink
    :to="'#'"
    class="flex items-start gap-3 p-2 rounded-md cursor-pointer transition hover:bg-primary-light/10 dark:hover:bg-primary-dark/10"
    active-class="bg-primary-light  text-white dark:bg-primary-dark"
  >
    <!-- Avatar -->
    <div
      class="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center font-bold text-lg overflow-hidden"
    >
      <img
        v-if="groupMember.user.profile_image"
        :src="groupMember.user.profile_image"
        class="w-full h-full object-cover rounded-full"
        alt="Group Image"
      />
      <span v-else>{{ groupMember.user.full_name?.charAt(0) }}</span>
    </div>

    <!-- Info -->
    <div class="flex-1">
      <div class="text-xs mt-0.5">
        {{ groupMember.user.user_name }}
      </div>
    </div>
  </NuxtLink>
</template>
<script setup>
const props = defineProps({
  groupMember: {
    type: Object,
    require: true,
  },
});
</script>
