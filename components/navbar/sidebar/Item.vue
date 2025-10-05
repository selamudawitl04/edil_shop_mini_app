<script setup>
defineProps({
  name: String,
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>
<template>
  <nuxt-link
    :to="`${name.toLowerCase()}`"
    @click="handleClick"
    class="sidebar-item group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
    :class="[
      $route.path.includes(name)
        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border-2 border-white/40 ring-2 ring-white/20'
        : 'lg:text-white hover:text-white border border-transparent',
    ]"
  >
    <!-- Icon -->
    <div class="flex-shrink-0 mr-3">
      <slot name="icon"></slot>
    </div>

    <!-- Title -->
    <div class="flex-1">
      <slot name="title"></slot>
    </div>

    <!-- Active indicator -->
    <div
      v-if="$route.path.includes(name)"
      class="w-2 h-2 bg-white rounded-full flex-shrink-0 animate-pulse shadow-sm"
    ></div>
  </nuxt-link>
</template>
