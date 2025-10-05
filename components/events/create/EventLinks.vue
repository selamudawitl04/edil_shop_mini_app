<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const eventLinks = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const platforms = [
  {
    id: "youtube",
    name: "YouTube",
    icon: "mdi:youtube",
    color: "text-red-600",
  },
  { id: "zoom", name: "Zoom", icon: "mdi:video", color: "text-blue-600" },
  {
    id: "facebook",
    name: "Facebook",
    icon: "mdi:facebook",
    color: "text-blue-700",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "mdi:music-note",
    color: "text-black dark:text-white",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "mdi:telegram",
    color: "text-blue-500",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "mdi:instagram",
    color: "text-pink-600",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "mdi:twitter",
    color: "text-blue-400",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "mdi:linkedin",
    color: "text-blue-700",
  },
  {
    id: "discord",
    name: "Discord",
    icon: "mdi:discord",
    color: "text-indigo-600",
  },
  { id: "skype", name: "Skype", icon: "mdi:skype", color: "text-blue-500" },
  {
    id: "teams",
    name: "Microsoft Teams",
    icon: "mdi:microsoft-teams",
    color: "text-purple-600",
  },
  {
    id: "meet",
    name: "Google Meet",
    icon: "mdi:video-outline",
    color: "text-green-600",
  },
  {
    id: "other",
    name: "Other",
    icon: "mdi:link-variant",
    color: "text-gray-600",
  },
];

const addPlatform = () => {
  eventLinks.value.push({
    platform: "",
    url: "",
    id: Date.now(),
  });
};

const removePlatform = (index) => {
  eventLinks.value.splice(index, 1);
};

const updatePlatform = (index, field, value) => {
  eventLinks.value[index][field] = value;
};

const getPlatformIcon = (platformId) => {
  const platform = platforms.find((p) => p.id === platformId);
  return platform ? platform.icon : "mdi:link-variant";
};

const getPlatformColor = (platformId) => {
  const platform = platforms.find((p) => p.id === platformId);
  return platform ? platform.color : "text-gray-600";
};

const getPlatformName = (platformId) => {
  const platform = platforms.find((p) => p.id === platformId);
  return platform ? platform.name : "Other";
};
</script>

<template>
  <div class="space-y-4">
    <!-- Existing Event Links -->
    <div v-if="eventLinks.length > 0" class="space-y-3">
      <div
        v-for="(link, index) in eventLinks"
        :key="link.id"
        class="flex items-center space-x-3 p-3 border border-borderColor-light dark:border-borderColor-dark rounded-lg bg-white dark:bg-gray-800"
      >
        <!-- Platform Icon -->
        <div class="flex-shrink-0">
          <Icon
            :name="getPlatformIcon(link.platform)"
            :class="getPlatformColor(link.platform)"
            size="24"
          />
        </div>

        <!-- Platform Selection -->
        <div class="flex-1">
          <select
            :value="link.platform"
            @change="updatePlatform(index, 'platform', $event.target.value)"
            class="w-full px-3 py-2 border border-borderColor-light dark:border-borderColor-dark rounded-lg bg-white dark:bg-gray-800 text-textPrimary-light dark:text-textPrimary-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
          >
            <option value="">Select Platform</option>
            <option
              v-for="platform in platforms"
              :key="platform.id"
              :value="platform.id"
            >
              {{ platform.name }}
            </option>
          </select>
        </div>

        <!-- URL Input -->
        <div class="flex-1">
          <input
            :value="link.url"
            @input="updatePlatform(index, 'url', $event.target.value)"
            type="url"
            class="w-full px-3 py-2 border border-borderColor-light dark:border-borderColor-dark rounded-lg bg-white dark:bg-gray-800 text-textPrimary-light dark:text-textPrimary-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
            :placeholder="`Enter ${getPlatformName(link.platform)} URL`"
          />
        </div>

        <!-- Remove Button -->
        <button
          @click="removePlatform(index)"
          type="button"
          class="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Remove platform"
        >
          <Icon name="mdi:close" size="20" />
        </button>
      </div>
    </div>

    <!-- Add Platform Button -->
    <button
      @click="addPlatform"
      type="button"
      class="w-full p-3 border-2 border-dashed border-borderColor-light dark:border-borderColor-dark rounded-lg text-textSecondary-light dark:text-textSecondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors"
    >
      <div class="flex items-center justify-center space-x-2">
        <Icon name="mdi:plus" size="20" />
        <span>Add Online Platform</span>
      </div>
    </button>

    <!-- Help Text -->
    <p
      class="text-xs text-textSecondary-light dark:text-textSecondary-dark text-center"
    >
      Add the platforms where people can join your online event. You can add
      multiple platforms.
    </p>
  </div>
</template>
