import { defineApolloClient } from "@nuxtjs/apollo";

export default defineApolloClient({
  httpEndpoint: process.env.VITE_EDIL_SHOP_GRAPH_URL,
  browserHttpEndpoint: process.env.VITE_EDIL_SHOP_GRAPH_URL,
});

// ✅ Set your typePolicies here for fetchMore support
// inMemoryCacheOptions: {
//   typePolicies: {
//     Query: {
//       fields: {
//         prayer_requests: {
//           keyArgs: false,
//           // merge(existing = [], incoming) {
//           //   return [...(existing || []), ...incoming];
//           // },

//           merge(existing, incoming, { args: { offset = 0 } }) {
//             // Slicing is necessary because the existing data is
//             // immutable, and frozen in development.
//             const merged = existing ? existing.slice(0) : [];
//             for (let i = 0; i < incoming.length; ++i) {
//               merged[offset + i] = incoming[i];
//             }
//             return merged;
//           },
//         },
//       },
//     },
//   },
// },
// });
