import { defineApolloClient } from "@nuxtjs/apollo";

export default defineApolloClient({
  httpEndpoint: process.env.VITE_ENTSLY_GRAPH_URL,
  browserHttpEndpoint: process.env.VITE_ENTSLY_GRAPH_URL,
  tokenName: "dev_entsely_access_token",
  tokenStorage: "cookie",
  httpLinkOptions: {},
  websocketsOnly: false,
  defaultOptions: {},
  inMemoryCacheOptions: {},
});
