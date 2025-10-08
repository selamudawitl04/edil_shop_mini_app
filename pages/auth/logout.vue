<template>
  <section
    class="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 py-12"
  >
    <div
      class="text-center text-textPrimary-light dark:text-textPrimary-dark text-lg font-medium"
    >
      በሂደት ላይ ነው… እባክዎን ትንሽ ይጠ patiently ይጠብቁ
    </div>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

const router = useRouter();
const toast = useToast();

// ከማሳወቂያ ጋር ያሉትን መረጃዎች አጥፋ
const tokenCookie = useCookie("auth_token");
const userCookie = useCookie("userData");

tokenCookie.value = null;
userCookie.value = null;

// እንዲሁም onLogout() የApollo ሂደትን ካስተዳደሩ
const { onLogout } = useApollo();
onLogout?.();

// Toast መልእክት ማሳያ
toast.success("በትክክል ውጡት።", { position: "top-right" });

// ከአንድ ሰከንድ በኋላ ወደ ግባ ገፅ አስመለከት
setTimeout(() => {
  router.replace("/");
}, 1000);
</script>
