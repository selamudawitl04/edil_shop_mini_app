<template>
  <div class="min-h-screen bg-gray-50 pb-10">
    <!-- Header with back icon -->
    <header
      class="sticky top-0 bg-white shadow-sm flex items-center px-4 py-3 z-50"
    >
      <button
        @click="goBack()"
        class="flex items-center text-gray-700 hover:text-primary-light transition"
      >
        <Icon name="mdi:arrow-left" class="text-2xl" />
        <h1 class="ml-2 text-lg font-bold text-gray-900">የእጣ ትኬት መግዛት</h1>
      </button>
    </header>

    <div class="p-3 space-y-6">
      <!-- Intro Section -->
      <div class="bg-primary-light text-white rounded-2xl p-6 text-center">
        <Icon name="mdi:school" class="text-white text-5xl mb-3 mx-auto" />
        <h2 class="text-xl text-white font-bold mb-1">የእጣ ትኬት እንዴት እንገዛ</h2>
        <p class="text-sm font-bold text-white">በ 3 ቀላል ደረጃዎች የእጣ ትኬት ይግዙ</p>
      </div>

      <!-- Steps -->
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <!-- Step Header -->
        <div
          class="flex items-center gap-4 p-5"
          :class="`bg-${primaryColor}-50`"
        >
          <div
            class="w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg"
            :class="`bg-${primaryColor}-500`"
          >
            {{ step.number }}
          </div>
          <div class="flex-1">
            <p class="text-gray-900 font-bold text-lg">{{ step.title }}</p>
            <p class="text-gray-600 text-sm mt-0.5">{{ step.description }}</p>
          </div>
          <Icon
            :name="step.icon"
            :class="`text-${primaryColor}-600 text-2xl`"
          />
        </div>

        <!-- Step Instructions -->
        <div class="p-5">
          <h3 class="font-semibold text-gray-900 text-base mb-4">
            {{ step.subtitle }}
          </h3>

          <div
            v-for="(instr, i) in step.instructions"
            :key="i"
            class="flex items-start gap-3 mb-3"
          >
            <div
              class="w-7 h-7 flex items-center justify-center rounded-full font-bold text-xs"
              :class="`bg-${primaryColor}-100 text-${primaryColor}-600`"
            >
              {{ i + 1 }}
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 text-sm">{{ instr.title }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ instr.desc }}</p>
            </div>
          </div>

          <!-- Alert Box -->
          <div
            v-if="step.alert"
            :class="`mt-4 flex items-start gap-3 bg-${step.alert.color}-50 border border-${step.alert.color}-200 rounded-lg p-3`"
          >
            <Icon
              :name="step.alert.icon"
              :class="`text-${step.alert.color}-600 text-xl flex-shrink-0`"
            />
            <p :class="`text-${step.alert.color}-800 text-sm font-medium`">
              {{ step.alert.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- Important Notes -->
      <div class="bg-white rounded-2xl shadow-sm p-5 border border-red-200">
        <div class="flex items-center mb-4">
          <Icon name="mdi:warning" class="text-red-600 text-2xl" />
          <h3 class="ml-2 font-bold text-lg text-gray-900">አስፈላጊ ማስታወሻዎች</h3>
        </div>
        <ul class="list-disc pl-5 space-y-2 text-gray-700 text-sm">
          <li v-for="(note, i) in notes" :key="i">{{ note }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const primaryColor = "blue";

function goBack() {
  if (window.history.length > 2) {
    window.history.back();
  } else {
    router.push("/more");
  }
}

const steps = [
  {
    number: 1,
    title: "ትኬት ቁጥር ይምረጡ",
    description: "የሚፈልጉትን ትኬት ቁጥር ይምረጡ",
    icon: "mdi:ticket-confirmation",
    subtitle: "ትኬት ቁጥር ለመምረጥ:",
    instructions: [
      {
        title: "የሎተሪ ዝርዝር ገጽ ይክፈቱ",
        desc: 'የሚፈልጉትን ሎተሪ ይምረጡ እና "ዝርዝር" ዎይም "ግዛ" የሚለውን ቁልፍ ይንኩ።',
      },
      {
        title: '"ትኬት ግዛ" የምለውን ይምረጡ',
        desc: 'የሎተሪ ዝርዝር ገጽ ላይ "ትኬት ግዛ" የምለውን ይምረጡ።',
      },
      {
        title: "የሚፈልጉትን ትኬት ቁጥር ይምረጡ",
        desc: "ከተሸጡ ያልሆኑ ትኬቶች ውስጥ የሚፈልጉትን ትኬት ቁጥር ይንኩ።",
      },
      {
        title: "ትኬት የምገዛበት Screen ይከፈታል",
        desc: "ትኬት ከነኩ በኋላ ትኬት የምገዛበት Screen በራሱ ይከፈታል።",
      },
    ],
    alert: {
      color: "blue",
      icon: "mdi:information",
      text: "አስታውስ: የተሸጡ ትኬቶች ቀለም ያላቸው ናቸው።",
    },
  },
  {
    number: 2,
    title: "መክፈያ",
    description: "የመክፈያ ዘዴ ይምረጡ እና ማስረጃ ያስገቡ",
    icon: "mdi:credit-card",
    subtitle: "መክፈያ ለማድረግ:",
    instructions: [
      { title: "የመክፈያ ዘዴ ይምረጡ", desc: "ከሚታዩት የመክፈያ ዘዴዎች ውስጥ አንዱን ይምረጡ።" },
      { title: "መክፈያ ያድርጉ", desc: "በተመረጠው የመክፈያ ዘዴ የተጠቀሰውን ብር ይክፈሉ።" },
      {
        title: "ማስረጃ ፎቶ ያስገቡ",
        desc: "በ mobile የከፈሉበት  መረጃ ዎይም በአካል የከፈሉበት ደረሰኝ photo አንስቶ ያስገቡ።",
      },
    ],
    alert: {
      color: "orange",
      icon: "mdi:alert",
      text: "አስፈላጊ: የመክፈያ ማስረጃ ፎቶ አስፈላጊ ነው።",
    },
  },
  {
    number: 3,
    title: "ጨርስ",
    description: "መክፈያውን ያስገቡ እና ያስቀምጡ",
    icon: "mdi:check-circle",
    subtitle: "መክፈያ ለማስገባት:",
    instructions: [
      {
        title: "መረጃውን ያረጋግጡ",
        desc: "የትኬት ቁጥር፣ የመክፈያ ዘዴ እና ፎቶ በትክክል መሆኑን ያረጋግጡ።",
      },
      {
        title: '"ትኬት ይግዙ" ይንኩ',
        desc: 'ሁሉም መረጃ ከተሞላ በኋላ "ትኬት ይግዙ" የሚለውን ቁልፍ ይንኩ።',
      },
      { title: "የማረጋገጫ መልዕክት", desc: "መክፈያው በተሳካ ሁኔታ ተላልፏል የሚል መልዕክት ይታያል።" },
      { title: "የማረጋገጫ ተጠባባቂ", desc: "መክፈያው እንደተፀድቀ በቅርቡ ይታወቃል።" },
    ],
    alert: {
      color: "green",
      icon: "mdi:check-circle",
      text: "መክፈያው እንደተፀድቀ በማሳወቂያ ይታወቃሉ።",
    },
  },
];

const notes = [
  "ከመክፈሉ በፊት የተቀባዩን ስም እኛ Account ቁጥር ማየቶን ያረጋግጡ።",
  "የመክፈያ ማስረጃ ፎቶ ንጹህ እና በትክክል የታየ መሆን አለበት።",
  "የተሳሳተ መረጃ ካስገቡ ትኬት አይፈቀድም።",
  "መክፈያ ከመፀድቅ በፊት ትኬት አይሰጥም።",
  "በ mobile የላኩት ብር በተለያዬ ምክንያት እጣው ከወጣ ቦኃል እኛ ጋ ከደረሰ ገንዘቡ ተመላሽ ይሆናል",
  'የተገዛው ትኬት በ"የእኔ ትኬቶች" ውስጥ ይታያል።',
];
</script>

<style scoped>
.shadow-sm {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>
