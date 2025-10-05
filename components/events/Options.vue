<script setup>
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const openUpdateEventDialog = ref(false);
const openDeleteEventDialog = ref(false);
const openReportEventDialog = ref(false);
const openUpdateLocationDialog = ref(false);

const canUpdateEvent = computed(() => {
  let isPageAdmin = props.event?.feed?.page?.page_admins?.length > 0;
  let groupAdmin = props.event?.feed?.group?.group_members?.find(
    (member) => member.role != "group:member"
  );
  return isPageAdmin || groupAdmin;
});
</script>

<template>
  <!-- ----------------Update prayer request---------- -->
  <EventsUpdateDialog
    v-if="event && openUpdateEventDialog"
    v-model="openUpdateEventDialog"
    :event="event"
  />

  <EventsUpdateLocationDialog
    v-if="event && openUpdateLocationDialog"
    v-model="openUpdateLocationDialog"
    :event="event"
  />

  <EventsDeleteDialog
    v-if="event && openDeleteEventDialog"
    v-model="openDeleteEventDialog"
    :event="event"
  />

  <HeadlessPopover class="relative inline-block text-left">
    <HeadlessPopoverButton
      class="p-2 rounded-md hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition"
    >
      <Icon
        name="mi:options-vertical"
        size="22"
        class="text-textPrimary-light dark:text-textPrimary-dark"
      />
    </HeadlessPopoverButton>

    <HeadlessPopoverPanel
      class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-card-dark z-50"
    >
      <div
        class="py-2 text-sm text-textPrimary-light dark:text-textPrimary-dark"
      >
        <!-- Update -->
        <button
          v-if="canUpdateEvent"
          @click.stop="openUpdateEventDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
        >
          <Icon name="mdi:file-edit-outline" class="w-4 h-4" />
          Edit Event
        </button>

        <!-- Update Location -->
        <button
          v-if="canUpdateEvent"
          @click.stop="openUpdateLocationDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
        >
          <Icon name="mdi:map-marker-outline" class="w-4 h-4" />
          Update Location
        </button>

        <!-- Delete -->
        <button
          v-if="canUpdateEvent"
          @click.stop="openDeleteEventDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 text-danger-light dark:text-danger-dark hover:bg-danger-light/10 dark:hover:bg-danger-dark/10 transition rounded-md"
        >
          <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
          Delete Event
        </button>

        <!-- Report -->
        <button
          @click.stop="openReportEventDialog = true"
          class="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-borderColor-light dark:hover:bg-borderColor-dark transition rounded-md"
        >
          <Icon name="mdi:flag-outline" class="w-4 h-4" />
          Report Event
        </button>
      </div>
    </HeadlessPopoverPanel>
  </HeadlessPopover>
</template>
