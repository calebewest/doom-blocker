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
  browser.storage.sync.get('enabled').then(result => {
    enabled = result.enabled !== false;
    applyState();
  });

  // React live when popup toggle changes
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.enabled) {
      enabled = changes.enabled.newValue !== false;
      console.log('Feed Hider enabled:', enabled);
      applyState();
    }
  });

})();
