import { ref } from "vue";

const type_ = ref("all");
const limit_ = ref(100);
const offset_ = ref(0);
const user = useCookie("userData");

export default function (
  query,
  { type = type_, limit = limit_, offset = offset_ }
) {
  const { onResult, onError, loading, refetch, fetchMore } = useQuery(
    query,
    () => ({
      type: type && type?.value ? type.value : undefined,
      user_id: user.value?.id || null,
      page_size: limit && limit?.value ? limit.value : undefined,
      page_offset: offset && offset?.value ? offset.value : undefined,
    }),
    () => ({
      fetchPolicy: "no-cache",
      clientId: "auth",
      context: {
        headers: {
          "x-hasura-role": "user",
        },
      },
    })
  );
  return {
    onResult,
    loading,
    refetch,
    onError,
    fetchMore,
  };
}
