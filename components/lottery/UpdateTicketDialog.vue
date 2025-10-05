<script setup>
import updateTicket from "@/graphql/lottery/update_ticket.gql";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  ticket: {
    type: Object,
    required: true, // The ticket being reviewed
  },
});

const refetchLottery = inject("refetchLottery");
const refetchLotteries = inject("refetchLotteries");

// Open state
const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const { mutate, onDone, loading } = mutator(updateTicket, {
  clientId: "auth",
  showError: false,
});

// Update status handler
const updateStatus = (status) => {
  mutate({
    id: props.ticket.id,
    input: {
      status,
    },
  });
};

onDone(({ data }) => {
  if (data?.update_tickets_by_pk?.id) {
    if (data.update_tickets_by_pk.status === "verified") {
      toast.success("ትኬቱ ተመስግብዋል", {
        position: "top-right",
      });
    } else {
      toast.error("ትኬቱ አልተመዘግበም ", {
        position: "top-right",
      });
    }

    if (typeof refetchLotteries === "function") refetchLotteries();
    if (typeof refetchLottery === "function") refetchLottery();

    open.value = false;
  } else {
    toast.error("ትኬት ማስተካከል አልተሳካም!", {
      position: "top-right",
    });
  }
});
</script>

<template>
  <BaseDialog
    v-model="open"
    title="🎟️ የትኬት ግምገማ"
    :autoClose="false"
    bodyClass="max-w-xl"
  >
    <template #content>
      <div class="max-w-xl mx-auto space-y-6">
        <!-- Ticket Info -->
        <div
          class="bg-gradient-to-r from-primary-light to-primary-dark text-white rounded-lg p-4 text-center shadow-md"
        >
          <h3 class="text-lg font-bold mb-1 text-white">የተመረጠው ትኬት</h3>
          <p class="text-3xl font-extrabold tracking-widest text-white">
            #{{ ticket.ticket_number }}
          </p>
        </div>

        <!-- Buyer/User Info -->
        <div
          class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm space-y-4"
        >
          <div class="flex items-center gap-3">
            <BaseAvatar
              :src="ticket.user?.profile_image"
              :name="ticket.user?.name"
              size="34"
            />
            <div>
              <p
                class="font-semibold text-textPrimary-light dark:text-textPrimary-dark"
              >
                {{ ticket.user?.name || "—" }}
              </p>
              <p
                class="text-sm text-textSecondary-light dark:text-textSecondary-dark"
              >
                📞
                {{
                  ticket.user?.phone?.replace(",", "") ||
                  ticket.phone_number?.replace(",", "")
                }}
              </p>
            </div>
          </div>

          <div class="flex justify-between text-sm">
            <span class="text-textSecondary-light dark:text-textSecondary-dark">
              የተፈጠረበት ቀን:
            </span>
            <span class="font-medium">
              {{ new Date(ticket.created_at).toLocaleString() }}
            </span>
          </div>
        </div>

        <!-- Receipt Image -->
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4">
          <h4
            class="text-sm font-semibold mb-2 text-textPrimary-light dark:text-textPrimary-dark"
          >
            የክፍያ ደረሰኝ
          </h4>
          <img
            v-if="ticket.receipt_url"
            :src="ticket.receipt_url"
            alt="Receipt"
            class="rounded-lg max-h-80 w-full object-contain"
          />
          <p v-else>የክፍያ ደረሰኝ የለም</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <BaseButton
            type="button"
            :full="true"
            size="lg"
            class="bg-red-600 hover:bg-red-700 text-white"
            :loading="loading"
            :disabled="loading"
            @click="updateStatus('rejected')"
          >
            ❌ ክፊያው አልደረሰኝም
          </BaseButton>
          <BaseButton
            type="button"
            :full="true"
            size="lg"
            class="bg-green-600 hover:bg-green-700 text-white"
            :loading="loading"
            :disabled="loading"
            @click="updateStatus('verified')"
          >
            ✅ ክፊያው ደርሶኛል
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
