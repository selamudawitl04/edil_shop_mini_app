import { ref } from "vue";

const enable = ref(true);
const client_ = ref("auth");
const user = useCookie("userData");

export default function (
  query,
  { id, enabled = enable, clientId = client_.value, role }
) {
  const variables = {
    id,
  };

  if (user.value) {
    variables.user_id = user.value.id;
  }

  const { onResult, onError, loading, refetch } = useQuery(
    query,
    () => ({
      ...variables,
    }),
    () => ({
      fetchPolicy: "no-cache",
      clientId: clientId,
      context: {
        headers: {
          "x-hasura-role": role || "user",
        },
      },
      enabled: enabled.value,
    })
  );
  onError((error) => {
    if (error.message.includes("Could not verify JWT")) {
      onLogout();
      navigateTo("/");
      useCookie("userData").value = null;
      useCookie("accessToken").value = null;
      useCookie("refreshToken").value = null;
    }
  });
  return {
    onResult,
    loading,
    refetch,
    onError,
  };
}
