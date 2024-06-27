document.addEventListener("DOMContentLoaded", (event) => {
  // Function to fetch rides based on the selected date
  function fetchRides(url, containerId) {
    const datePicker = document.getElementById("date-picker");
    if (datePicker) {
      datePicker.addEventListener("change", function () {
        const selectedDate = this.value;
        fetch(`${url}?date=${selectedDate}`)
          .then((response) => response.json())
          .then((data) => {
            const ridesContainer = document.getElementById(containerId);
            ridesContainer.innerHTML = data.html;
          })
          .catch((error) => console.error("Error fetching data:", error));
      });
    }
  }

  // Call the fetchRides function for both tabs
  fetchRides("/filter_offered_rides", "rides-container-offers");
  fetchRides("/filter_requested_rides", "rides-container-requests");

  fetchRides("/filter_my_rides_driver", "my-rides-container-offers");
  fetchRides("/filter_my_rides_rider", "my-rides-container-requests");
});
