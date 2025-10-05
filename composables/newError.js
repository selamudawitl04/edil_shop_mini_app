const thereIsAnError = ref(false);
let error = null;
export default (_error) => {
  console.error("Error Sleamu:", _error);
  if (_error) {
    thereIsAnError.value = true;
    error = _error;
    console.error("Error:", error);
  } else {
    thereIsAnError.value = false;
  }
};

watch(thereIsAnError, (newValue) => {
  if (newValue) {
    console.log("Throwinfbbbbbbbbbbbbbbb");
    // Handle the error display logic here, e.g., show a modal or toast
    // Show the error to the user
    throw error;
  }
});
