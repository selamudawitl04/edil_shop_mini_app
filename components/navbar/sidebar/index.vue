<script setup>
const props = defineProps({
  navs: {
    type: Array,
    required: true,
  },
  layout: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["nav-click"]);

const handleNavClick = () => {
  emit("nav-click");
};
</script>
<template>
  <div class="flex flex-col justify-between h-full space-y-4 pb-14">
    <!-- Navigation Items -->
    <div class="space-y-2">
      <NavbarSidebarItem
        v-for="(nav, index) in navs"
        :key="index"
        :name="nav.to"
        @click="handleNavClick"
      >
        <template #icon>
          <Icon :name="nav.icon" size="24" color="white" />
        </template>
        <template #title>
          <p class="text-white">{{ nav.name }}</p>
        </template>
      </NavbarSidebarItem>
    </div>
  </div>
</template>
