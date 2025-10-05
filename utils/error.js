// import i18n from "@/plugins/i18n";
export default function () {
  //   const t = i18n.global.t;
  // const response = {
  //   invalid_username_or_password: {
  //     title: "invalid_username_or_password",
  //     description: "please_try_again_with_correct_credentials",
  //     cardClass: "bg-red-100",
  //   },
  //   user_not_found: {
  //     title: t("user_not_found"),
  //     description: t("user_not_found_description"),
  //     cardClass: "bg-red-100",
  //   },
  //   invalid_old_password: {
  //     title: t("invalid_password"),
  //     description: t("invalid_old_password"),
  //     cardClass: "bg-red-100",
  //   },
  //   "invalid-jwt": {
  //     title: t("jwt_expired"),
  //     description: t("session_expired_description"),
  //     cardClass: "bg-red-100",
  //   },
  //   email_or_phone_required: {
  //     title: t("email_or_phone_required"),
  //     description: t("email_or_phone_to_recover"),
  //     cardClass: "bg-red-100",
  //   },
  // };

  const extract = (err) => {
    let msg_compilation = "";

    Object.keys(err).forEach((key) => {
      console.log(err.graphQLErrors);
    });

    // ApolloError present
    if (err.graphQLErrors?.length > 0) {
      const errObject = err.graphQLErrors[0];
      const internal = errObject?.extensions?.internal;

      if (internal?.response?.body) {
        // Try 'message' or fallback to 'error'
        msg_compilation =
          internal.response.body.message ||
          internal.response.body.error ||
          "Unexpected error from action response.";
      } else {
        // Fallback to top-level message + code if present
        msg_compilation = errObject.message || "ApolloError without message.";
        if (errObject.extensions?.code) {
          msg_compilation += ` (${errObject.extensions.code})`;
        }
      }
    }

    // Vee-validate or general errors
    else if (err?.errors?.length > 0) {
      msg_compilation = err.errors[0].message;
    }

    // Simple string errors
    else if (typeof err === "string") {
      msg_compilation = err;
    }

    // Default fallback
    else {
      msg_compilation = "Unknown error format";
    }

    return msg_compilation;
  };

  const parse = (err) => {
    let item = {};

    // const msg = extract(err);

    // Object.keys(response).forEach((key) => {
    //   if (msg.includes(key)) {
    //     item = {
    //       ...response[key],
    //       key,mes
    //     };
    //   }
    // });

    // if (Object.keys(item).length === 0 && msg) {
    //   item = {
    //     title: msg,
    //     key: null,
    //   };
    // }
    return item;
  };

  return {
    parse,
    extract,
  };
}
