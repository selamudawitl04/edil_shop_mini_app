<template>
  <NuxtLayout name="app">
    <section class="container mx-auto px-3 lg:px-6 lg:py-8 min-h-screen">
      <!-- Header -->
      <div
        class="flex justify-between items-start md:items-center mb-2 lg:mb-8 gap-4"
      >
        <h1
          class="text-xl md:text-3xl font-extrabold text-gray-800 dark:text-gray-100"
        >
          ገንዘብ ከፍሎ ሚጠባበቁ ትከቶች
          <span class="text-primary-light dark:text-primary-dark"
            >({{ length }})</span
          >
        </h1>
      </div>

      <!-- <pre>{{ tickets }}</pre> -->

      <!-- Lottery Cards Grid -->
      <div v-if="!loading">
        <div
          v-if="tickets.length"
          class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6"
        >
          <LotteryTicketCard
            v-for="ticket in tickets"
            :key="ticket.id"
            :ticket="ticket"
            class="hover:scale-105 transition-transform duration-150"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-20 text-center text-gray-500 dark:text-gray-400"
        >
          <div class="text-6xl mb-4">🎟️</div>
          <p class="text-lg font-medium">ትኬቶች አልተገኙም</p>
          <p class="text-sm mt-2">እባክዎ አዲስ ትኬት ይፍጠሩ</p>
        </div>

        <div class="py-8">
          <BasePaginate
            :items-per-page="limit"
            :total-data="length"
            v-model:offset="offset"
          />
        </div>
      </div>

      <!-- Loading State -->

      <div v-if="loading" class="class flex justify-center py-8">
        <div class="loader"></div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import listQuery from "@/graphql/lottery/tickets.gql";

const user = useCookie("userData");

const tickets = ref([]);
const length = ref(0);

const filter = computed(() => {
  const query = {
    status: {
      _eq: "pending",
    },
    lottery: {
      user_id: {
        _eq: user.value.id,
      },
    },
  };

  return query;
});

const sort = ref([{ created_at: "desc" }]);
const limit = ref(12);
const offset = ref(0);

const { onResult, loading, refetch } = queryList(listQuery, {
  clientId: "auth",
  filter: filter,
  order: sort,
  limit: limit,
  offset: offset,
  include_user: true,
});

onResult(({ data }) => {
  if (data.tickets) {
    tickets.value = data.tickets;
    length.value = data.tickets_aggregate?.aggregate?.count;
  }
});

provide("refetchTickets", refetch);
</script>

<style scoped>
/* Optional: smooth hover effect for cards */
.LotteryTicket Card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
</style>
