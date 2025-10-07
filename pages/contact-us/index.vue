<template>
  <div class="min-h-screen bg-gray-50">
    <BaseError show-retry v-if="errorHappened" @retry="refetch" />
    <div v-else>
      <!-- Header with back icon -->
      <header
        class="sticky top-0 bg-white shadow-sm flex items-center px-4 py-3 z-50"
      >
        <button
          @click="goBack()"
          class="flex items-center text-gray-700 hover:text-primary-light transition"
        >
          <Icon name="mdi:arrow-left" class="text-2xl" />
          <h1 class="ml-2 text-lg font-bold text-gray-900">
            እኛን ለማግኘት እኛ ለመከታተል
          </h1>
        </button>
      </header>

      <div class="p-3 space-y-6" v-if="contactInformation">
        <!-- Header Card -->
        <div class="bg-primary-light text-white rounded-2xl p-6 text-center">
          <div class="text-5xl mb-3">
            <Icon name="ic:outline-contact-support" class="text-white" />
          </div>
          <h2 class="text-xl font-bold text-white mb-1">እኛን ለማግኘት እኛ ለመከታተል</h2>
          <p class="text-sm font-bold text-white">
            በማህበራዊ ሚዲያ እና በስልክ እኛን ያግኙን
          </p>
        </div>

        <!-- Social Media Section -->
        <div v-if="socialMedia.length">
          <div class="flex items-center mb-4">
            <div class="bg-blue-100 px-2 py-1 rounded">
              <Icon name="material-symbols:share" class="text-blue-600" />
            </div>
            <h3 class="ml-3 text-lg font-bold text-gray-900">ማህበራዊ ሚዲያ</h3>
          </div>

          <div v-for="(social, index) in socialMedia" :key="index" class="mb-3">
            <div
              class="flex items-center p-4 bg-white rounded-lg shadow-sm cursor-pointer"
              @click="openUrl(social.url)"
            >
              <!-- Fixed-size icon container -->
              <div
                class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg"
                :style="{ backgroundColor: social.color + '20' }"
              >
                <Icon
                  :name="social.icon"
                  :style="{ color: social.color, fontSize: '1.5rem' }"
                />
              </div>

              <!-- Text with two-line wrap -->
              <div class="ml-4 flex-1 overflow-hidden">
                <p class="font-semibold text-gray-900">{{ social.name }}</p>
                <p
                  class="text-sm text-gray-500 overflow-hidden"
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-word;
                  "
                  :title="social.url"
                >
                  {{ social.url }}
                </p>
              </div>

              <i
                class="mdi mdi-arrow-right text-gray-400 flex-shrink-0 ml-2"
              ></i>
            </div>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div v-if="contacts.length">
          <div class="flex items-center mb-4">
            <div class="bg-green-100 px-2 py-1 rounded">
              <i class="mdi mdi-phone text-green-600"></i>
            </div>
            <h3 class="ml-3 text-lg font-bold text-gray-900">የስልክ መስመሮች</h3>
          </div>

          <div v-for="(contact, index) in contacts" :key="index" class="mb-3">
            <div
              class="flex items-center p-4 bg-white rounded-lg shadow-sm cursor-pointer"
              @click="callPhone(contact.number)"
            >
              <div
                class="w-12 h-12 flex items-center justify-center rounded-lg"
                :style="{ backgroundColor: contact.color + '20' }"
              >
                <i
                  :class="contact.icon"
                  :style="{ color: contact.color, fontSize: '1.5rem' }"
                ></i>
              </div>
              <div class="ml-4 flex-1">
                <p class="font-semibold text-gray-900">{{ contact.name }}</p>
                <p class="text-sm text-gray-500">{{ contact.number }}</p>
              </div>
              <i class="mdi mdi-phone" :style="{ color: contact.color }"></i>
            </div>
          </div>
        </div>

        <!-- Support Section -->
        <div>
          <div class="flex items-center mb-4">
            <div class="bg-red-100 px-2 py-1 rounded">
              <i class="mdi mdi-help text-red-600"></i>
            </div>
            <h3 class="ml-3 text-lg font-bold text-gray-900">ድጋፍ</h3>
          </div>

          <div class="p-4 bg-white rounded-lg shadow-sm space-y-3">
            <div class="flex items-center">
              <i class="mdi mdi-information text-red-600 mr-2"></i>
              <p class="text-sm font-medium text-gray-900">
                ለማንኛውም ጥያቄ ወይም ድጋፍ እኛን ያግኙን
              </p>
            </div>

            <div class="flex gap-3">
              <button
                v-if="contactInformation.telegram_user"
                class="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
                @click="openUrl(contactInformation.telegram_user)"
              >
                <i class="mdi mdi-telegram text-lg"></i> ቴሌግራም
              </button>

              <button
                v-if="contactInformation.support_phone_number"
                class="flex-1 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"
                @click="callPhone(contactInformation.support_phone_number)"
              >
                <i class="mdi mdi-phone text-lg"></i> ይደውሉ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import getContactInformations from "~/graphql/settings/get_contact_informations.gql";

const errorHappened = ref(false);
const contactInformation = ref(null);

// Start with empty arrays
const socialMedia = ref([]);
const contacts = ref([]);

const { onResult, onError, refetch } = queryList(getContactInformations, {});

onResult((result) => {
  if (result.data.settings.length > 0) {
    contactInformation.value = result.data.settings[0];
    errorHappened.value = false;

    // Populate social media
    socialMedia.value = [
      {
        name: "ቴሌግራም ቻናል",
        url: contactInformation.value.telegram_channel,
        icon: "mdi-telegram", // works if mdi-telegram is loaded
        color: "#1E40AF",
      },
      {
        name: "ቲክቶክ",
        url: contactInformation.value.tiktok_channel,
        icon: "ic:baseline-tiktok",
        color: "#010101",
      },
      {
        name: "ዩቱብ",
        url: contactInformation.value.youtube_channel,
        icon: "mdi-youtube",
        color: "#B91C1C",
      },
      {
        name: "ቴሌግራም ሚኒ አፕልካሽን",
        url: contactInformation.value.mini_app,
        icon: "mdi-apps",
        color: "#1E40AF",
      },
    ];

    // Populate contacts
    contacts.value = [
      {
        name: "ዋና ስልክ",
        number: contactInformation.value.phone_number,
        icon: "mdi mdi-phone",
        color: "#22C55E",
      },
      {
        name: "የድጋፍ ስልክ",
        number: contactInformation.value.support_phone_number,
        icon: "mdi mdi-headset",
        color: "#F97316",
      },
    ];
  } else {
    errorHappened.value = true;
  }
});

onError(() => {
  errorHappened.value = true;
});

function openUrl(url) {
  window.open(url, "_blank");
}

function callPhone(number) {
  window.location.href = `tel:${number}`;
}

function goBack() {
  if (window.history.length > 2) {
    window.history.back();
  } else {
    router.push("/more");
  }
}
</script>

<style scoped>
.bg-primary-light {
  background-color: #1e40afff;
}
.shadow-sm {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>
