// Function to set the selected language in session storage
function setLanguageInStorage(language) {
  console.log("Setting language in session storage:", language);
  sessionStorage.setItem("selectedLanguage", language);
}

// Load translations based on selected language
function loadTranslations(language) {
  console.log("Loading translations for language:", language);
  fetch("/static/json/" + language + ".json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Translations data:", data);
      // Apply translations to elements
      Object.keys(data).forEach((key) => {
        const element = document.getElementById(key);
        if (element) {
          element.textContent = data[key];
          console.log("Element updated for key:", key);
        } else {
          console.log("Element not found for key:", key);
        }
      });
    })
    .catch((error) => console.error("Error loading translations:", error));
}

document.getElementById("language").addEventListener("change", function () {
  const selectedLanguage = this.value;
  console.log("Selected language:", selectedLanguage);
  loadTranslations(selectedLanguage);
  // Store the selected language in session storage
  setLanguageInStorage(selectedLanguage);

  // Create a JSON object with the selected language
  const languageData = { language: selectedLanguage };
  console.log("Language data to send:", languageData);

  // Send a POST request to the server to update the language
  fetch("/set_language", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(languageData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the server
      console.log("Response from server:", data);
      // Optionally, you can perform additional actions based on the response
    })
    .catch((error) => console.error("Error:", error));
});

// On page load, check if a language is stored in session storage and load translations accordingly
document.addEventListener("DOMContentLoaded", function () {
  const selectedLanguage = sessionStorage.getItem("selectedLanguage");
  if (selectedLanguage) {
    // Load translations for the stored language
    loadTranslations(selectedLanguage);
    // Set the language selector dropdown to the stored language
    document.getElementById("language").value = selectedLanguage;
  }
});
