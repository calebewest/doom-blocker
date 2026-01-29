document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  let isLocked = false;
  let countdownInterval = null;
  let unblockCountdownInterval = null;

  console.log("Popup script loaded");

  // Update button text and appearance
  function updateButtonState(isActive, unblockTimer = null) {
    if (unblockTimer !== null && unblockTimer > 0) {
      toggleBtn.textContent = unblockTimer + 's';
      toggleBtn.classList.add('active');
    } else {
      toggleBtn.textContent = isActive ? 'On' : 'Off';
      toggleBtn.classList.toggle('active', isActive);
    }
  }

  // Lock button UI with countdown
  function lockButton(seconds) {
    isLocked = true;
    toggleBtn.disabled = true;
    toggleBtn.style.opacity = '0.6';
    toggleBtn.style.cursor = 'not-allowed';

    let remaining = seconds;

    countdownInterval = setInterval(() => {
      remaining--;

      if (remaining <= 0) {
        clearInterval(countdownInterval);
        isLocked = false;
        toggleBtn.disabled = false;
        toggleBtn.style.opacity = '1';
        toggleBtn.style.cursor = 'pointer';
      }
    }, 1000);
  }

  // Start unblock countdown
  function startUnblockCountdown(seconds) {
    const startTime = Date.now();
    const endTime = startTime + (seconds * 1000);

    browser.storage.sync.set({ 
      unblockTimer: seconds,
      unblockStartTime: startTime
    });

    let remaining = seconds;
    updateButtonState(false, remaining);

    unblockCountdownInterval = setInterval(() => {
      remaining--;
      updateButtonState(false, remaining);

      if (remaining <= 0) {
        clearInterval(unblockCountdownInterval);
        browser.storage.sync.set({ 
          enabled: false,
          unblockTimer: null,
          unblockStartTime: null
        });
        updateButtonState(false);
      }
    }, 1000);
  }

  // Load saved state
  browser.storage.sync.get(['enabled', 'unblockTimer', 'unblockStartTime']).then(result => {
    const enabled = result.enabled !== false;
    const unblockTimer = result.unblockTimer;
    const startTime = result.unblockStartTime;

    // Check if unblock timer is still active
    if (unblockTimer && startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, unblockTimer - elapsed);

      if (remaining > 0) {
        // Resume countdown
        let current = remaining;
        updateButtonState(enabled, current);
        
        unblockCountdownInterval = setInterval(() => {
          current--;
          updateButtonState(enabled, current);

          if (current <= 0) {
            clearInterval(unblockCountdownInterval);
            browser.storage.sync.set({ 
              enabled: false,
              unblockTimer: null,
              unblockStartTime: null
            });
            updateButtonState(false);
          }
        }, 1000);
      } else {
        // Timer expired, clean up
        browser.storage.sync.set({ 
          enabled: false,
          unblockTimer: null,
          unblockStartTime: null
        });
        updateButtonState(false);
      }
    } else {
      updateButtonState(enabled);
    }
  });

  // Handle button click
  toggleBtn.addEventListener('click', () => {
    browser.storage.sync.get(['enabled', 'unblockTimer']).then(result => {
      const currentEnabled = result.enabled !== false;
      const hasUnblockTimer = result.unblockTimer;

      if (currentEnabled) {
        // User is turning OFF - start unblock countdown
        clearInterval(unblockCountdownInterval);
        console.log('Feed blocker disabled - 15 second countdown to unblock started');
        startUnblockCountdown(15);
      } else if (hasUnblockTimer) {
        // User is cancelling the unblock countdown - turn back ON
        clearInterval(unblockCountdownInterval);
        browser.storage.sync.set({ 
          enabled: true,
          unblockTimer: null,
          unblockStartTime: null
        }).then(() => {
          console.log('Unblock countdown cancelled - Feed blocker re-enabled');
          updateButtonState(true);
        });
      } else {
        // Blocker is OFF with no countdown - turn it back ON
        browser.storage.sync.set({ 
          enabled: true
        }).then(() => {
          console.log('Feed blocker re-enabled');
          updateButtonState(true);
        });
      }
    });
  });
});
