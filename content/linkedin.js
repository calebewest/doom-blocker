(function () {
  let enabled = true;
  let observer = null;

  function hideFeed() {
    if (!enabled) return;

    const feed = document.querySelector('[data-testid="mainFeed"]');
    if (feed) {
      feed.style.display = 'none';
      console.log('LinkedIn feed hidden');
    }
  }

  function showFeed() {
    const feed = document.querySelector('[data-testid="mainFeed"]');
    if (feed) {
      feed.style.display = '';
      console.log('LinkedIn feed shown');
    }
  }

  function applyState() {
    if (enabled) {
      hideFeed();

      if (!observer) {
        observer = new MutationObserver(hideFeed);
        observer.observe(document.body, { childList: true, subtree: true });
      }
    } else {
      showFeed();

      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  }

  // Load saved state when page opens
  browser.storage.sync.get(['enabled', 'unblockTimer', 'unblockStartTime']).then(result => {
    const enabled_val = result.enabled !== false;
    const unblockTimer = result.unblockTimer;
    const startTime = result.unblockStartTime;

    // Check if unblock timer is still active
    if (unblockTimer && startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, unblockTimer - elapsed);

      if (remaining > 0) {
        // Timer still counting - keep blocking
        enabled = true;
        console.log('Unblock countdown active (' + remaining + 's remaining) - keeping feed blocked');
      } else {
        // Timer expired - unblock
        enabled = false;
        browser.storage.sync.set({ 
          unblockTimer: null,
          unblockStartTime: null
        });
        console.log('Unblock countdown expired - feed unlocked');
      }
    } else {
      enabled = enabled_val;
    }
    
    applyState();
  });

  // React live when popup toggle changes
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.enabled) {
        enabled = changes.enabled.newValue !== false;
        console.log('Feed Hider enabled:', enabled);
        applyState();
      }
      
      if (changes.unblockTimer) {
        const unblockTimer = changes.unblockTimer.newValue;
        const startTime = changes.unblockStartTime ? changes.unblockStartTime.newValue : null;
        
        if (unblockTimer && startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const remaining = Math.max(0, unblockTimer - elapsed);
          
          if (remaining > 0) {
            enabled = true;
            console.log('Unblock countdown started - keeping feed blocked');
            applyState();
          }
        } else if (!unblockTimer) {
          enabled = changes.enabled ? changes.enabled.newValue !== false : false;
          applyState();
        }
      }
    }
  });

})();
