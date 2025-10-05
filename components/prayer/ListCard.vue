<script setup>

const props = defineProps({
    prayerList: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['createNew']);

const user = useCookie("userData");

// Get YYYY-MM-DD string in user's timezone
function formatDateToYYYYMMDD_TZ(date, timezone) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    const y = parts.find((p) => p.type === "year").value;
    const m = parts.find((p) => p.type === "month").value;
    const d = parts.find((p) => p.type === "day").value;

    return `${y}-${m}-${d}`;
}

// Helper: Get Monday of a given date
function getMonday(date) {
    const day = date.getDay(); // Sunday=0, Monday=1, ...
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
}

const isToday = computed(() => {
    if (props.prayerList?.type != 'daily') return false

    try {
        // get user's timezone or device timezone
        const tz = user.value?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const today = new Date();
        const todayInTZ = formatDateToYYYYMMDD_TZ(today, tz);

        return todayInTZ == props.prayerList?.scheduled_date;
    } catch (error) {
        console.log("Error checking if today:", error);
        return false;
    }
})

const isThisWeek = computed(() => {
    if (props.prayerList?.type != 'weekly') return false

    try {
        // get user's timezone or device timezone
        const tz = user.value?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const today = new Date();
        const monday = getMonday(new Date(formatDateToYYYYMMDD_TZ(today, tz)));
        const mondayInTZ = formatDateToYYYYMMDD_TZ(monday, tz);

        return mondayInTZ == props.prayerList?.scheduled_week;
    } catch (error) {
        console.log("Error checking if this week:", error);
        return false;
    }
})


const link = computed(() => {
    return `/user/saved-requests/${props.prayerList?.id}?type=${props.prayerList?.type}&name=${props.prayerList?.name}&scheduled_date=${props.prayerList?.scheduled_date}&scheduled_week=${props.prayerList?.scheduled_week}&num_requests=${props.prayerList?.num_requests}`
})

</script>

<template>
    <li>

        <!-- Regular Card -->
        <NuxtLink :to="link"
            class="block p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-primary-light/20 dark:hover:border-primary-dark/20 bg-white dark:bg-slate-800"
            active-class="bg-gradient-to-br from-primary-light/10 to-primary-light/5 dark:from-primary-dark/10 dark:to-primary-dark/5 border-primary-light/30 dark:border-primary-dark/30 shadow-md"
            :class="isToday || isThisWeek ? ' border border-dashed border-primary-light/30 dark:border-primary-dark/30 hover:border-primary-light/50 dark:hover:border-primary-dark/50' : ''">

            <!-- Header with Type Badge and Date -->
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                    <!-- Type Badge -->
                    <span class="text-xs font-medium px-3 py-1.5 rounded-full capitalize" :class="{
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200': prayerList.type === 'daily',
                        'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200': prayerList.type === 'weekly',
                        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200': prayerList.type === 'monthly',
                        'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200': prayerList.type === 'custom',
                        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200': prayerList.type === 'general'
                    }">
                        {{ prayerList.type }}
                    </span>

                    <!-- Date for daily/weekly -->
                    <span v-if="prayerList.scheduled_date"
                        class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                        {{ new Date(prayerList.scheduled_date).toLocaleDateString() }}
                    </span>
                    <span v-else-if="prayerList.scheduled_week"
                        class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                        Week of {{ new Date(prayerList.scheduled_week).toLocaleDateString() }}
                    </span>
                </div>

                <!-- Completion Status -->
                <div class="flex items-center gap-1">
                    <span class="text-xs font-medium" :class="{
                        'text-blue-600 dark:text-blue-400': prayerList.percentage_completed < 30,
                        'text-yellow-600 dark:text-yellow-400': prayerList.percentage_completed >= 30 && prayerList.percentage_completed < 70,
                        'text-green-600 dark:text-green-400': prayerList.percentage_completed >= 70
                    }">
                        {{ prayerList.percentage_completed }}%
                    </span>
                    <Icon name="mdi:check-circle" size="14" :class="{
                        'text-blue-600 dark:text-blue-400': prayerList.percentage_completed < 30,
                        'text-yellow-600 dark:text-yellow-400': prayerList.percentage_completed >= 30 && prayerList.percentage_completed < 70,
                        'text-green-600 dark:text-green-400': prayerList.percentage_completed >= 70
                    }" />
                </div>
            </div>

            <!-- Content -->
            <div class="space-y-3">
                <!-- Title -->
                <h3
                    class="font-semibold text-sm text-textPrimary-light dark:text-textPrimary-dark line-clamp-2 leading-tight capitalize">
                    {{ !!isToday ? "Today" : !!isThisWeek ? "This Week" : prayerList.name }}
                </h3>

                <!-- Stats and Progress -->
                <div class="space-y-3">
                    <!-- Prayer Stats -->
                    <div class="flex items-center justify-between">
                        <div
                            class="flex items-center gap-4 text-xs text-textSecondary-light dark:text-textSecondary-dark">
                            <span class="flex items-center gap-1">
                                <Icon name="mdi:format-list-bulleted" size="14" />
                                {{ prayerList.num_requests }} requests
                            </span>
                            <span class="flex items-center gap-1">
                                <Icon name="mdi:heart" size="14" class="text-green-500" />
                                {{ prayerList.num_prayed }} prayed
                            </span>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="space-y-1">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-textSecondary-light dark:text-textSecondary-dark">Prayer Progress</span>
                            <span class="font-medium" :class="{
                                'text-blue-600 dark:text-blue-400': prayerList.percentage_completed < 30,
                                'text-yellow-600 dark:text-yellow-400': prayerList.percentage_completed >= 30 && prayerList.percentage_completed < 70,
                                'text-green-600 dark:text-green-400': prayerList.percentage_completed >= 70
                            }">
                                {{ prayerList.percentage_completed }}% complete
                            </span>
                        </div>
                        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-300" :class="{
                                'bg-gradient-to-r from-blue-500 to-blue-600': prayerList.percentage_completed < 30,
                                'bg-gradient-to-r from-yellow-500 to-yellow-600': prayerList.percentage_completed >= 30 && prayerList.percentage_completed < 70,
                                'bg-gradient-to-r from-green-500 to-green-600': prayerList.percentage_completed >= 70
                            }" :style="{ width: `${prayerList.percentage_completed}%` }">
                            </div>
                        </div>
                    </div>

                    <!-- Prayer Status -->
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-textSecondary-light dark:text-textSecondary-dark">
                            You prayed for {{ prayerList.num_prayed }} out of {{ prayerList.num_requests }} requests
                        </span>
                    </div>
                </div>
            </div>
        </NuxtLink>
    </li>
</template>

<style scoped></style>