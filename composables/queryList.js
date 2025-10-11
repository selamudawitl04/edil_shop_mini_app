import { ref } from "vue";

const enable = ref(true);
const offset_ = ref(0);
const limit_ = ref(100);
const filter_ = ref({});
const client_ = ref("auth");
const pollInterval_ = ref(null);
const user = useCookie("userData");
const { onLogout } = useApollo();

export default function (
  query,
  {
    filter = filter_,
    order,
    limit = limit_,
    offset = offset_,
    enabled = enable,
    clientId = client_.value,
    pollInterval = pollInterval_,
    role,
  }
) {
  const { onResult, onError, loading, refetch, fetchMore } = useQuery(
    query,
    () => ({
      limit: limit && limit?.value ? limit.value : undefined,
      filter: filter && filter.value ? filter.value : {},
      order: order && order?.value.length ? order.value : undefined,
      offset: offset && offset?.value ? offset.value : undefined,
      user_id: user.value?.id || null,
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
      pollInterval:
        pollInterval && pollInterval?.value ? pollInterval.value : undefined,
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
    fetchMore,
  };
}
