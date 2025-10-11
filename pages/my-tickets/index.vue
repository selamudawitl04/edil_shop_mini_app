<template>
  <NuxtLayout name="app">
    <!-- AppBar Tab -->
    <div
      class="fixed top-0 left-0 right-0 z-50 bg-white shadow flex items-center p-2 gap-2 text-sm"
    >
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="flex-1 cursor-pointer rounded-lg py-2 px-1 text-center transition-all duration-200"
        :class="
          selected === index
            ? 'bg-primary-light text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        "
        @click="selected = index"
      >
        <span class="font-semibold text-sm">{{ tab.title }}</span>
      </div>
    </div>

    <!-- ------------Tickets List--------------- -->

    <!-- Spacer for header -->
    <div class="h-14"></div>

    <div v-if="enabled">
      <BaseError v-if="errorHappened" show-retry @retry="refetch" />
      <div v-else>
        <div v-if="tickets.length" class="p-3 space-y-3">
          <div v-for="ticket in tickets" :key="ticket.id">
            <LotteryCard :lottery="ticket.lottery" :ticket="ticket" />
          </div>
        </div>

        <!-- ---------------No Result Found -->
        <div v-if="!loading && !tickets.length" class="text-center">
          <BaseZeroResult message="ምንም ውጤት አልተገኘም" />
        </div>

        <div v-if="loading" class="class flex justify-center py-8">
          <div class="loader"></div>
        </div>

        <BaseScrollObserver @reach-bottom="loadMore" />
      </div>
    </div>
    <LotteryLikedLotteries v-else />
  </NuxtLayout>
</template>

<script setup>
import { ref } from "vue";

const tabs = [
  { title: "ሁሉም" },
  { title: "ያልዎጡ" },
  { title: "ያሸነፉ" },
  { title: "ያልተረጋገጡ" },
  { title: "የተወደዱ" },
];

const selected = ref(0);

const errorHappened = ref(false);
import listQuery from "@/graphql/lottery/tickets.gql";

const user = useCookie("userData");

const tickets = ref([]);
const length = ref(0);

const filter = computed(() => {
  const query = {
    user_id: {
      _eq: user.value.id,
    },
  };

  if (selected.value === 0) {
    // all tickets
    query.status = {
      _in: ["verified", "pending"],
    };
  } else if (selected.value === 1) {
    // active tickets
    query.status = {
      _eq: "verified",
    };
    query.lottery = {
      status: {
        _eq: "active",
      },
    };
  } else if (selected.value === 2) {
    query.winners_aggregate = {
      count: {
        predicate: {
          _gt: 0,
        },
      },
    };
    query.lottery = {
      status: {
        _eq: "closed",
      },
    };
  } else if (selected.value === 3) {
    // pending tickets
    query.status = {
      _eq: "pending",
    };
  }
  return query;
});

const sort = ref([{ created_at: "desc" }]);
const limit = ref(10);
const offset = ref(0);
const enabled = computed(() => {
  return selected.value != 4;
});

const { onResult, loading, refetch, onError, fetchMore } = queryList(
  listQuery,
  {
    filter: filter,
    order: sort,
    limit: limit,
    offset: offset,
    enabled: enabled,
  }
);

const _tickets = ref([]);
onResult(({ data }) => {
  if (!data.tickets) return;

  _tickets.value = data.tickets;

  if (selected.value == 2) {
    tickets.value = _tickets.value.map((t) => ({
      ...t,
      ticket_numbers: [
        {
          number: t.ticket_number,
          status: t.status,
        },
      ],
    }));
    return;
  }

  // ✅ Build groups keyed by group_id (fallback to ticket.id if group_id is null)
  const groupMap = {};
  data.tickets.forEach((ticket) => {
    const groupKey = ticket.group_id || ticket.id;

    if (!groupMap[groupKey]) {
      groupMap[groupKey] = {
        group_id: groupKey,
        tickets: [],
        ticket_numbers: [],
        lottery: ticket.lottery || null,
        user: ticket.user || null,
        status: ticket.status || null,
        created_at: ticket.created_at || null,
      };
    }

    groupMap[groupKey].tickets.push(ticket);
    // ✅ Store each ticket_number as an object with its status
    groupMap[groupKey].ticket_numbers.push({
      number: ticket.ticket_number,
      status: ticket.status,
    });
  });

  // ✅ Convert to array, dedupe based on number, and sort
  tickets.value = Object.values(groupMap).map((g) => ({
    ...g,
    ticket_numbers: Array.from(
      new Map(
        g.ticket_numbers.map((tn) => [tn.number, tn]) // dedupe by number
      ).values()
    ).sort((a, b) => a.number - b.number),
  }));

  length.value = data.tickets_aggregate?.aggregate?.count || 0;
  errorHappened.value = false;
});

onError((error) => {
  errorHappened.value = true;
});

let isLoadingMore = false;
let lastLoadedAt = 0;
const GAP_DURATION = 1000; // milliseconds

const loadMore = async () => {
  const now = Date.now();

  // Prevent overlapping or too-frequent calls
  if (
    isLoadingMore ||
    now - lastLoadedAt < GAP_DURATION ||
    tickets.value.length >= length.value
  ) {
    return;
  }

  isLoadingMore = true;

  try {
    const { data } = await fetchMore({
      variables: {
        limit: limit.value,
        offset: tickets.value.length, // move forward
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.tickets.length === 0) {
          return previousResult;
        }

        return {
          ...previousResult,
          tickets: [...previousResult.tickets, ...fetchMoreResult.tickets],
          tickets_aggregate: {
            aggregate: {
              count: fetchMoreResult.tickets_aggregate.aggregate.count,
            },
          },
        };
      },
    });

    if (data?.tickets?.length > 0) {
      lastLoadedAt = Date.now();
    }
  } catch (e) {
    console.error("Failed to load more:", e);
  } finally {
    isLoadingMore = false;
  }
};
</script>
