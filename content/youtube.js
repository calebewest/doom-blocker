(function () {
  let enabled = true;
  let observer = null;

  const hide = (selector) => {
    document.querySelectorAll(selector).forEach(el => {
      try { el.style.display = 'none'; } catch (e) {}
    });
  };

  const show = (selector) => {
    document.querySelectorAll(selector).forEach(el => {
      try { el.style.display = ''; } catch (e) {}
    });
  };

  function hideDistractions() {
    if (!enabled) return;

    // Hide sidebars / recommendation panels
    hide('#secondary');
    hide('#secondary-inner');
    hide('ytd-watch-next-secondary-results-renderer');
    hide('ytd-reel-shelf-renderer');
    hide('ytd-rich-shelf-renderer');
    hide('#related');

    // Expand main video
    const primary = document.querySelector('#primary');
    if (primary) {
      primary.style.width = '100%';
      primary.style.maxWidth = '100%';
    }

    // Hide Shorts player and related elements
    if (window.location.pathname.startsWith('/shorts/')) {
      hide('#player');
      hide('ytd-player');
      hide('#below');
      hide('ytd-reel-player-renderer');
    }
  }

  function showDistractions() {
    // Restore hidden elements
    show('#secondary');
    show('#secondary-inner');
    show('ytd-watch-next-secondary-results-renderer');
    show('ytd-reel-shelf-renderer');
    show('ytd-rich-shelf-renderer');
    show('#related');
    show('#player');
    show('ytd-player');
    show('#below');
    show('ytd-reel-player-renderer');

    // Restore main video layout
    const primary = document.querySelector('#primary');
    if (primary) {
      primary.style.width = '';
      primary.style.maxWidth = '';
    }
  }

  function applyState() {
    if (enabled) {
      hideDistractions();

      if (!observer) {
        observer = new MutationObserver(hideDistractions);
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('yt-navigate-finish', hideDistractions);
      }
    } else {
      showDistractions();

      if (observer) {
        observer.disconnect();
        observer = null;
      }
      window.removeEventListener('yt-navigate-finish', hideDistractions);
    }
  }

  // Load saved state on page load
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
