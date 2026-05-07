/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

(function () {
  'use strict';

  // --- DOM ELEMENTS ---
  const reservationForm = document.getElementById('reservationForm');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const guestsSelect = document.getElementById('guests');
  const seatingSelect = document.getElementById('seating');
  const requestsInput = document.getElementById('requests');

  const bookingDialog = document.getElementById('bookingDialog');
  const modalDetails = document.getElementById('modalDetails');
  const closeDialogBtn = document.getElementById('closeDialogBtn');

  // Helper to show error
  function showError(input, show) {
    const errorMsg = input.parentNode.querySelector('.error-msg');
    if (show) {
      input.classList.add('invalid');
      if (errorMsg) errorMsg.style.display = 'block';
    } else {
      input.classList.remove('invalid');
      if (errorMsg) errorMsg.style.display = 'none';
    }
  }

  // Validate form fields
  function validateForm() {
    let isValid = true;

    // 1. Name validation
    const nameVal = nameInput.value.trim();
    if (!nameVal || nameVal.length < 2) {
      showError(nameInput, true);
      isValid = false;
    } else {
      showError(nameInput, false);
    }

    // 2. Phone validation (minimum 10 digits)
    const phoneVal = phoneInput.value.trim().replace(/\D/g, '');
    if (!phoneVal || phoneVal.length < 10) {
      showError(phoneInput, true);
      isValid = false;
    } else {
      showError(phoneInput, false);
    }

    // 3. Date validation (must be future date or today)
    const dateVal = dateInput.value;
    if (!dateVal) {
      showError(dateInput, true);
      isValid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(dateVal);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        showError(dateInput, true);
        isValid = false;
      } else {
        showError(dateInput, false);
      }
    }

    // 4. Time validation
    const timeVal = timeInput.value;
    if (!timeVal) {
      showError(timeInput, true);
      isValid = false;
    } else {
      showError(timeInput, false);
    }

    // 5. Guests validation
    const guestsVal = guestsSelect.value;
    if (!guestsVal) {
      showError(guestsSelect, true);
      isValid = false;
    } else {
      showError(guestsSelect, false);
    }

    return isValid;
  }

  // Listen for real-time input to clear errors
  [nameInput, phoneInput, dateInput, timeInput, guestsSelect].forEach(input => {
    input.addEventListener('input', () => {
      showError(input, false);
    });
  });

  // Handle submit
  reservationForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      if (e.agentInvoked && typeof e.respondWith === 'function') {
        e.respondWith(
          Promise.resolve({
            success: false,
            message: 'Validation failed. Please verify your details.'
          })
        );
      }
      return;
    }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const dateStr = dateInput.value;
    const time = timeInput.value;
    const guests = guestsSelect.value;
    const seating = seatingSelect.options[seatingSelect.selectedIndex].text;
    const requests = requestsInput.value.trim();

    // Populate modal details
    modalDetails.innerHTML = `Hello <strong>${name}</strong>,<br> We look forward to welcoming you on:<br><br> <strong>${dateStr}</strong> at <strong>${time}</strong><br> Party of <strong>${guests}</strong> &bull; ${seating}`;

    // Open booking dialog
    if (typeof bookingDialog.showModal === 'function') {
      bookingDialog.showModal();
    } else {
      bookingDialog.setAttribute('open', 'true');
    }

    // Intercept agent invocation
    if (e.agentInvoked && typeof e.respondWith === 'function') {
      e.respondWith(
        Promise.resolve({
          success: true,
          message: `Reservation successfully created for ${name} on ${dateStr} at ${time} for ${guests} guests.`
        })
      );
    }
  });

  // Close Dialog
  closeDialogBtn.addEventListener('click', () => {
    if (typeof bookingDialog.close === 'function') {
      bookingDialog.close();
    } else {
      bookingDialog.removeAttribute('open');
    }
    reservationForm.reset();
  });
})();
