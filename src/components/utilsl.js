// utils.js
import flatpickr from "flatpickr";
import '../styles/styles.css';


export const initializeDatePicker = (selector) => {
  flatpickr(selector, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
  });
};

export const initializeAutocomplete = (inputId) => {
  const input = document.getElementById(inputId);
  if (input) {
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.setComponentRestrictions({ country: ["us"] });

    window.google.maps.event.addDomListener(input, 'keydown', (event) => {
      if (event.keyCode === 13) event.preventDefault();
    });
  }
};
