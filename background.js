// Service worker for Doom Blocker extension
(function() {
  'use strict';

  const storage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : browser.storage;
  const runtime = typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime : browser.runtime;

  
  // Default settings - all sites enabled by default
  const defaultSettings = {
    enabled: {
      linkedin: true,
    }
  };

  // Initialize extension on install
  runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      // Set default settings on first install
      storage.sync.set(defaultSettings, () => {
        console.log('Doom Blocker: Default settings initialized');
      });
    } else if (details.reason === 'update') {
      // On update, merge with existing settings
      storage.sync.get(['enabled'], (result) => {
        const existing = result.enabled || {};
        const merged = { ...defaultSettings.enabled, ...existing };
        storage.sync.set({ enabled: merged }, () => {
          console.log('Doom Blocker: Settings updated');
        });
      });
    }
  });

  // Optional: Handle messages from content scripts
  runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
      storage.sync.get(['enabled'], (result) => {
        sendResponse({ enabled: result.enabled || defaultSettings.enabled });
      });
      return true; // Indicates we will send a response asynchronously
    }
  });

})();
