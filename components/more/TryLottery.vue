<template>
  <BaseError show-retry v-if="errorHappened" @retry="refetch" />
  <div v-else class="p-3 bg-green-50 border border-green-200 rounded-lg">
    <div class="flex items-start gap-3">
      <Icon name="mdi:verified" class="text-green-600 text-lg flex-shrink-0" />

      <div class="flex-1">
        <p class="text-green-800 text-sm font-medium">
          ይህ ዘዴ በጣም ግልጽ እና እምነት ያለው ነው።
        </p>

        <p class="text-green-700 text-sm font-medium mt-2">
          ተጠቃሚዎች የእጣ አዎጣጥ ሂደቱን እንዴት እንደሚሰራ ለመረዳት ዌብሳይት ላይ በቀጥታ ሙከራ ማድረግ ይችላሉ።
        </p>

        <button
          @click="openLink(contactInformation?.try_lottery_website)"
          class="mt-3 flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition"
        >
          <Icon name="mdi:open-in-new" class="text-base" />
          እጣ አዎጣጥ ይሞክሩ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import getContactInformations from "~/graphql/settings/get_contact_informations.gql";

const { onResult, onError, loading, refetch } = queryList(
  getContactInformations,
  {}
);

const errorHappened = ref(false);
const contactInformation = ref(null);
onResult((result) => {
  if (result.data.settings.length > 0) {
    contactInformation.value = result.data.settings[0];
    errorHappened.value = false;
  } else {
    errorHappened.value = true;
  }
});

onError((error) => {
  errorHappened.value = true;
});

function openLink(url) {
  if (!url) return;
  window.open(url, "_blank");
}
</script>

<style scoped>
button {
  box-shadow: 0 1px 2px rgba(0, 128, 0, 0.15);
}
</style>
