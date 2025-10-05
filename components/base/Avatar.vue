<template>
  <div class="rounded-full text-white flex items-center justify-center font-bold text-sm overflow-hidden"
    :class="custom_class" :style="{ backgroundColor: avatar_color, width: size + 'px', height: size + 'px' }">
    <img v-if="avatar_image" :src="avatar_image" class="w-full h-full object-cover rounded-full" alt="User Image" />
    <span v-else>
      {{ initials }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  avatar_image: {
    type: String,
    required: false,
  },
  custom_class: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  avatar_color: {
    type: String,
    default: "#4A90E2", // Default fallback color
  },
  size: {
    type: [Number, String],
    default: 40,
  },
});

// Generate initials like Telegram (e.g., John Doe → JD)
const initials = computed(() => {
  if (!props.name) return "";

  const names = props.name.trim().split(" ");
  const first = names[0]?.charAt(0) ?? "";
  const last = names.length > 1 ? names[names.length - 1]?.charAt(0) : "";

  return (first + last).toUpperCase();
});
</script>
