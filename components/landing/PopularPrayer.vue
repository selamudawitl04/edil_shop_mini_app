<template>
  <section
    class="bg-card-light dark:bg-card-dark py-16 px-4 sm:px-8 md:px-16 lg:px-32"
  >
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-2xl font-bold mb-8 text-textPrimary-light dark:text-textPrimary-dark text-center"
      >
        🙏 Most Recent Prayer Requests
      </h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PrayerCard
          v-for="prayerRequest in prayersRequests"
          :key="prayerRequest.id"
          :prayer-request="prayerRequest"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const prayersRequests = [
  {
    id: 1,
    title: "Healing for my sister",
    description: "Please pray for complete recovery and peace of mind.",
    prayerCount: 132,
    created: "1 hour ago",
    category: "Healthy",
    medias: {
      type: "image",
      url: "",
    },
  },
  {
    id: 2,
    title: "Guidance in decision",
    description: "Pray for clarity and wisdom in career choices.",
    prayerCount: 89,
    created: "3 hours ago",
    category: "Career",
    medias: {
      type: null,
      url: "",
    },
  },
  {
    id: 3,
    title: "Peace in the family",
    description: "Seeking prayer for reconciliation between siblings.",
    prayerCount: 51,
    created: "5 hours ago",
    category: "Family",
    medias: {
      type: null,
      url: "",
    },
  },
  {
    id: 4,
    title: "Job opportunity",
    description: "Trusting God for an open door this month.",
    prayerCount: 73,
    created: "8 hours ago",
    category: "Career",
    medias: {
      type: null,
      url: "",
    },
  },
  {
    id: 5,
    title: "Safe delivery",
    description: "Pray for a friend going into labor today.",
    prayerCount: 210,
    created: "10 hours ago",
    category: "Health",
    medias: {
      type: null,
      url: "",
    },
  },
  {
    id: 6,
    title: "School exams",
    description: "Requesting prayer for strength and focus during finals.",
    prayerCount: 65,
    created: "Yesterday",
    category: "Education",
    medias: {
      type: null,
      url: "",
    },
  },
];
</script>
