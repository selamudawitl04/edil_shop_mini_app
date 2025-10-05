const toDatetimeLocal = (utcString) => {
  const d = new Date(utcString); // parse UTC string
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
};
export { toDatetimeLocal };
