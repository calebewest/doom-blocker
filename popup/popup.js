const toggle = document.getElementById('toggle');

// Load saved state
browser.storage.sync.get('enabled').then(result => {
  toggle.checked = result.enabled !== false; // default = true
});

// Save when changed
toggle.addEventListener('change', () => {
  browser.storage.sync.set({ enabled: toggle.checked });
});
