<template>
  <section
    class="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white px-6 relative overflow-hidden"
  >
    <!-- Background floating circles -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -top-10 -left-10 animate-pulse-slow"
      ></div>
      <div
        class="absolute w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl bottom-0 right-0 animate-pulse-slower"
      ></div>
    </div>

    <div class="text-center space-y-10 relative z-10">
      <!-- Floating Logo -->
      <div class="flex justify-center">
        <img
          src="/logo-192.png"
          alt="Edil Shop"
          class="w-28 h-28 rounded-full shadow-xl border border-white/30 animate-float"
        />
      </div>

      <!-- Animated spinner -->
      <div class="relative flex justify-center items-center">
        <div
          class="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin-smooth"
        ></div>
        <div
          class="absolute inset-0 w-14 h-14 rounded-full bg-white/5 blur-xl animate-ping-slow"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import loginMutation from "@/graphql/auth/login.gql";
const config = useRuntimeConfig();

const router = useRouter();
const { onLogin } = useApollo();

const { mutate, onDone, onError } = mutator(loginMutation, {
  clientId: "default",
  showError: false,
});

const openBot = () => {
  const edilShopBotUrl =
    config.public.edilShopBotUrl || "https://t.me/EdilShopBot";
  window.location.href = edilShopBotUrl;
  // close the telegram app
  const tg = window?.Telegram?.WebApp;
  tg?.close();
};

const login = (initData) => {
  if (!initData || typeof initData !== "string" || initData.trim() === "") {
    console.warn("⚠️ የተፈቀደ የመጀመሪያ ውሂብ አልተገኘም።");
    alert(
      "እባክዎን መተግበሪያውን ከ Telegram ቦቱ ድጋሚ ይክፈቱ። የማይሰራ ከሆነ Chat History አጥፉ እና እንደገና ጀምሩ። ከላይ ያለውን ⋮ ይጫኑ እና “Clear History” ቁልፍ ይምረጡ። yesy"
    );

    openBot();
    return;
  }
  mutate({ initData });
};

onDone(async (result) => {
  const loginData = result.data?.mini_app_login;
  if (loginData) {
    onLogin(loginData.token, "auth");
    useCookie("userData").value = loginData.user;
    useCookie("accessToken").value = loginData.token;
    setTimeout(() => router.replace("/lotteries"), 800);
  }
});

onError((error) => {
  const errorMessage = error?.message || "";

  if (errorMessage.includes("Unauthorized")) {
    alert(
      "እባክዎን መተግበሪያውን ከ Telegram ቦቱ ድጋሚ ይክፈቱ። የማይሰራ ከሆነ Chat History አጥፉ እና እንደገና ጀምሩ። ከላይ ያለውን ⋮ ይጫኑ እና “Clear History” ቁልፍ ይምረጡ።"
    );

    openBot();
  } else if (errorMessage.includes("Phone not found")) {
    alert(
      "እባክዎን ስልክ ቁጥሮን ከ Telegram ቦት ጋር ያጋሩ።  ካልታየ የስልክ አጋራ ቁልፍ፣ እባክዎን 'hi' ብለው ይላኩልን።"
    );

    openBot();
  } else if (errorMessage.includes("account_not_active")) {
    alert(
      "Your account is not active. Please contact the administrator to activate your account."
    );
    openBot();
  } else {
    alert(
      "እባክዎን መተግበሪያውን ከ Telegram ቦቱ ድጋሚ ይክፈቱ። የማይሰራ ከሆነ Chat History አጥፉ እና እንደገና ጀምሩ። ከላይ ያለውን ⋮ ይጫኑ እና “Clear History” ቁልፍ ይምረጡ።"
    );

    openBot();
  }
});

const decodedString = ref(null);

onMounted(() => {
  // const initData =
  //   'user={"id":8496110446,"first_name":"Selamu","last_name":"Dawit","language_code":"en","allows_write_to_pm":true,"photo_url":"https://t.me/i/userpic/320/QN8RaNPVYRBreMin37eXbNNWj-Jz3omtv-xQVH6SPZUKLA42IL1bwCOhZMMAo1T9.svg"}&chat_instance=-2493485298927068994&chat_type=sender&auth_date=1761885203&signature=NKrC3xo6Ny-JlRUyZNTclhN8ySce0ZA_aAw_H7333xPgjwQEv622wRwGnB1Tgb9_9e5TliSNz_mFHS-8b2KpDA&hash=e50746d6c2d9f030e87d6d2187dcdcce9fae4783fb58267ce1c93377a5c3d0dd';
  // login(initData);

  // login(initData);

  // ከቴሌግራም የመጀመሪያ ውሂብ ያግኙ
  const tg = window?.Telegram?.WebApp;
  const initData = tg?.initData || "";

  if (initData) {
    alert(initData);
    try {
      decodedString.value = decodeURIComponent(initData);

      // copy to clipboard

      alert(decodedString.value + " copied to clipboard");
      login(decodedString.value);
    } catch (error) {
      console.warn("የመጀመሪያ ውሂብ ትክክል አይደለም።");
      alert("እባክዎን መተግበሪያውን ከ Telegram ቦት ድጋሚ ይክፈቱ።");
      openBot();
    }
  } else {
    openBot();
  }
});
</script>

<style scoped>
/* Smooth floating logo animation */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Slow glowing background pulses */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
@keyframes pulse-slower {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.3);
  }
}

/* Custom spin animation for smoother look */
@keyframes spin-smooth {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Ping-like soft glow animation */
@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  75% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}
.animate-pulse-slower {
  animation: pulse-slower 10s ease-in-out infinite;
}
.animate-spin-smooth {
  animation: spin-smooth 1.8s linear infinite;
}
.animate-ping-slow {
  animation: ping-slow 2.5s ease-out infinite;
}
</style>
