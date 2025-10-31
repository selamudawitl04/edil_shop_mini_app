import sharePhoneNumber from "@/graphql/auth/share_phone.gql";

const openBot = (botUrl) => {
  alert(
    "እባክዎን ስልክ ቁጥሮን በTelegram Bot  ያጋሩ።  📱 ስልክ ቁጥርዬን አጋር የምለው ካልታየ 'hi' ብለው ይላኩልን።"
  );
  window.location.href = botUrl;
  // close the telegram app
  const tg = window?.Telegram?.WebApp;
  tg?.close();
};

export default function (userID, botUrl, openBotOnDone) {
  const { mutate, onDone, onError } = useMutation(sharePhoneNumber, () => ({
    fetchPolicy: "network-only",
    clientId: "auth",
    context: {
      headers: {
        "x-hasura-role": "user",
      },
    },
  }));

  mutate({
    input: {
      user_id: userID,
    },
  });

  onError((error) => {
    if (openBotOnDone) {
      openBot(botUrl);
    }
  });

  onDone((data) => {
    if (openBotOnDone) {
      openBot(botUrl);
    }
  });
}
