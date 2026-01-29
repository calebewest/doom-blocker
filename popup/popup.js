document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');

  console.log("Popup script loaded");

  // Update button text and appearance
  function updateButtonState(isActive) {
    toggleBtn.textContent = isActive ? 'On' : 'Off';
    toggleBtn.classList.toggle('active', isActive);
  }

  // Load saved state
  browser.storage.sync.get('enabled').then(result => {
    const enabled = result.enabled !== false;
    updateButtonState(enabled);
  });

  // Handle button click
  toggleBtn.addEventListener('click', () => {
    const isActive = toggleBtn.classList.toggle('active');
    updateButtonState(isActive);
    console.log('Feed blocker:', isActive ? 'On' : 'Off');

    browser.storage.sync.set({ enabled: isActive });
  });
});
