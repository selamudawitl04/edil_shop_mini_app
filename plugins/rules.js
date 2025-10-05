import { defineRule } from "vee-validate";

export default defineNuxtPlugin((vueApp) => {
  defineRule("onerequired", (value) => {
    return !!value || value?.length || "ቢያንስ አንድ ምርጫ ያስፈልጋል";
  }),
    defineRule("required", (value) => {
      return !!value || value?.length || "ይህ መስክ አስፈላጊ ነው";
    }),
    defineRule("payment_options_required", (value) => {
      console.log("payment_options_required", value);
      return value?.length || "ብያንስ አንድ ይምርጡ";
    }),
    defineRule("boolReq", (value) => {
      return typeof value == "boolean" || "ይህ መስክ አስፈላጊ ነው";
    }),
    defineRule("fayda", (value) => {
      return !value || value.length == 10 || "የፋይዳ መታወቂያ ቁጥር 10 ቁጥር መሆን አለበት";
    }),
    defineRule("verify_fayda", (value) => {
      return value || "መታወቂያዎን ያረጋግጡ";
    }),
    defineRule("array_object_required", (value) => {
      return value?.length || "ይህ መስክ አስፈላጊ ነው";
    }),
    defineRule("yes_or_no", (value) => {
      return value?.length || "ይህ መስክ አስፈላጊ ነው";
    }),
    defineRule("dyarrayrequired", (value, [], ctx) => {
      return (
        ctx.rule.params[0]?.includes("No_savings") ||
        value?.length ||
        "ይህ መስክ አስፈላጊ ነው"
      );
    }),
    defineRule("dyrequired", (value, [], ctx) => {
      return (
        ctx.rule.params[0] == "no" ||
        ctx.rule.params[0] == "No" ||
        ctx.rule.params[0] == undefined ||
        ctx.rule.params[0] == "sole_proprietorship" ||
        (typeof ctx.rule.params[0] == "boolean" &&
          ctx.rule.params[0] == false) ||
        !!value ||
        value?.length ||
        "ይህ መስክ አስፈላጊ ነው"
      );
    }),
    defineRule("arrya_object_dyrequired", (value, [], ctx) => {
      return (
        ctx.rule.params[0] == "no" ||
        ctx.rule.params[0] == "No" ||
        ctx.rule.params[0] == undefined ||
        value?.length ||
        "ይህ መስክ አስፈላጊ ነው"
      );
    }),
    defineRule("dyrequirednot", (value, [], ctx) => {
      return (
        ctx.rule.params[0] == "yes" ||
        ctx.rule.params[0] == "Yes" ||
        ctx.rule.params[0] == undefined ||
        ctx.rule.params[0] == "sole_proprietorship" ||
        !!value ||
        value?.length ||
        "ይህ መስክ አስፈላጊ ነው"
      );
    }),
    defineRule("number", (value) => {
      return !value || /^[0-9]+$/.test(value) || "ቁጥር ብቻ መሆን አለበት";
    }),
    defineRule("user_name", (value) => {
      if (!value) return "የተጠቃሚ ስም አስፈላጊ ነው";
      if (!/^[a-zA-Z0-9_]+$/.test(value))
        return "የተጠቃሚ ስም ፊደላት፣ ቁጥሮች እና ንዴት (_) ብቻ መይዝ አለበት";
      if (value.length < 3) return "የተጠቃሚ ስም ቢያንስ 3 ቁምፊ መሆን አለበት";
      if (value.length > 30) return "የተጠቃሚ ስም ከ30 ቁምፊ በላይ ሊሆን አይችልም";
      return true;
    });

  defineRule("numberFromZero", (value) => {
    return /^(?:0|[1-9]\d*)$/.test(value) || "ቁጥር ብቻ መሆን አለበት";
  }),
    defineRule("numrange", (value) => {
      return !value || /^[0-9-]+$/.test(value) || "ቁጥር ብቻ መሆን አለበት";
    }),
    defineRule("email", (value) => {
      return (
        !value ||
        /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
          value
        ) ||
        "ኢሜይል ትክክል አይደለም"
      );
    }),
    defineRule("world_phone", (value) => {
      return (
        !value ||
        /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ||
        "ስልክ ቁጥር ትክክል አይደለም"
      );
    }),
    defineRule("min", (value, [], context) => {
      if (value.length >= context.rule.params[0]) {
        return true;
      } else {
        return `${context.field} ከ${context.rule.params[0]} ቁምፊ ቢያንስ መሆን አለበት`;
      }
    }),
    defineRule("max", (value, [], context) => {
      if (value.length <= context.rule.params[0]) {
        return true;
      } else {
        return `${context.field} ከ${context.rule.params[0]} ቁምፊ በላይ አይሆንም`;
      }
    }),
    defineRule("length", (value, [], context) => {
      if (value.length == context.rule.params[0]) {
        return true;
      } else {
        return `${context.field} ትክክል የሆነው በ${context.rule.params[0]} ቁምፊ መሆን አለበት`;
      }
    }),
    defineRule("ethio_phone", (value) => {
      return !value || /^(7|9)\d{8}$/.test(value) || "ስልክ ቁጥር ትክክል አይደለም";
    }),
    defineRule("password", (value) => {
      return !value || value.length >= 8 || "የይለፍ ቃል ቢያንስ 8 ቁምፊ መሆን አለበት";
    }),
    defineRule("confirmed", (value, [other]) => {
      return !value || value === other || "የይለፍ ቃል ተመሳሳይ አይደለም";
    });
});
