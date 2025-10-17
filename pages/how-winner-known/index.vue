<template>
  <div class="min-h-screen bg-gray-50 pb-10">
    <header
      class="sticky top-0 bg-white shadow-sm flex items-center px-4 py-3 z-50"
    >
      <!-- Back Button + Title -->
      <button
        @click="goBack()"
        class="flex items-center text-gray-700 hover:text-blue-600 transition"
      >
        <Icon name="si:arrow-left-line" class="text-4xl" />

        <h1 class="ml-2 text-lg font-bold text-gray-900">እጣ አወጣት</h1>
      </button>
    </header>

    <!-- Main Content -->
    <div class="p-3 space-y-6">
      <!-- Intro Section -->
      <div class="bg-primary-light text-white rounded-2xl p-6 text-center">
        <Icon name="mdi:trophy" class="text-white text-5xl mb-3 mx-auto" />
        <h2 class="text-xl text-white font-bold mb-1">እጣ አወጣት እንዴት ይሆናል</h2>
        <p class="text-sm font-bold text-white">በ 2 የተለያዩ ዘዴዎች እጣ ይዎጣል</p>
      </div>

      <!-- Methods -->
      <div
        v-for="(method, index) in methods"
        :key="index"
        class="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <!-- Method Header -->
        <div
          class="flex items-center gap-4 p-5"
          :class="`bg-${method.color}-50`"
        >
          <!-- <div
              class="w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg"
              :class="`bg-${method.color}-500`"
            >
              {{ method.number }}
            </div> -->
          <div class="flex-1">
            <p class="text-gray-900 font-bold text-lg">{{ method.title }}</p>
            <p class="text-gray-600 text-sm mt-0.5">
              {{ method.description }}
            </p>
          </div>
          <Icon
            :name="method.icon"
            :class="`text-${method.color}-600 text-2xl`"
          />
        </div>

        <!-- Method Steps -->
        <div class="p-5">
          <h3 class="font-semibold text-gray-900 text-base mb-4">
            {{ method.subtitle }}
          </h3>

          <!-- Step List -->
          <div
            v-for="(step, i) in method.steps"
            :key="i"
            class="flex items-start gap-3 mb-3"
          >
            <div
              class="w-7 h-7 flex items-center justify-center rounded-full font-bold text-xs"
              :class="`bg-${method.color}-100 text-${method.color}-600`"
            >
              {{ i + 1 }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <Icon
                  :name="step.icon"
                  :class="`text-${method.color}-600 text-sm`"
                />
                <p class="font-medium text-gray-900 text-sm">
                  {{ step.title }}
                </p>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ step.desc }}</p>
            </div>
          </div>

          <!-- Optional extra content -->
          <div
            v-if="method.extra === 'security'"
            class="mt-4 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3"
          >
            <Icon
              name="mdi:shield-check"
              class="text-blue-600 text-xl flex-shrink-0"
            />
            <p class="text-blue-800 text-sm font-medium">
              ሁሉንም ነገር በታማኝነትና በትክክለኛነት እንከታተላለን።
            </p>
          </div>

          <div v-if="method.extra === 'tryLottery'" class="mt-5">
            <MoreTryLottery />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const methods = [
  {
    number: 1,
    title: "የእጅ እጣ አወጣት",
    description: "ከእጣ ቁጥሮች በእጅ ይመረጣል",
    icon: "mdi:account",
    color: "blue",
    subtitle: "የእጅ እጣ አወጣት ሂደት:",
    extra: "security",
    steps: [
      {
        title: "እጣ ማውጣት",
        desc: "ገለልተኛ ሰው በእጁ እጣ ይዎጣል።",
        icon: "mdi:account",
      },
      {
        title: "የምስክሮች መገኝነት",
        desc: "በምርጫው ሂደት ውስጥ የተለያዩ ሰዎች ተገኝተው ይመለከታሉ።",
        icon: "mdi:account-group",
      },
      {
        title: "የእኛ ተወካይ ቀረጻ",
        desc: "የእኛ ተወካይ ሁሉንም ሂደት በቪዲዮ ይቀረጻል።",
        icon: "mdi:video",
      },
      {
        title: "የቪዲዮ መልቀቅ",
        desc: "የምርጫው ቪዲዮ በሎተሪ ላይ ይገኛል።",
        icon: "mdi:link-variant",
      },
    ],
  },
];

function goBack() {
  if (window.history.length > 2) {
    window.history.back();
  } else {
    router.push("/more");
  }
}
</script>

<style scoped>
.shadow-sm {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>
