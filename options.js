// Options page logic
(function() {
  'use strict';

  const storage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : browser.storage;
  const sites = ['linkedin'];

  // Load saved settings
  function loadSettings() {
    storage.sync.get(['enabled'], (result) => {
      const enabled = result.enabled || {};
      
      sites.forEach(site => {
        const checkbox = document.querySelector(`input[data-site="${site}"]`);
        if (checkbox) {
          // Default to true if not set
          checkbox.checked = enabled[site] !== false;
        }
      });
    });
  }

  // Save settings
  function saveSettings() {
    const enabled = {};
    
    sites.forEach(site => {
      const checkbox = document.querySelector(`input[data-site="${site}"]`);
      if (checkbox) {
        enabled[site] = checkbox.checked;
      }
    });

    storage.sync.set({ enabled }, () => {
      // Show success message
      const message = document.getElementById('saveMessage');
      message.classList.add('show');
      
      setTimeout(() => {
        message.classList.remove('show');
      }, 2000);

      // Notify content scripts to reload settings
      // This will require a page refresh for the changes to take effect
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', saveSettings);

    // Auto-save on toggle change
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-site]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        // Small delay to allow the toggle animation
        setTimeout(saveSettings, 100);
      });
    });
  });

})();
