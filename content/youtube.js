(function () {
  function hideDistractions() {
    const hide = (selector) => {
      document.querySelectorAll(selector).forEach(el => {
        try { el.style.display = 'none'; } catch (e) {}
      });
    };

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

    // Hide Shorts player and related elements on /shorts/ URLs
    if (window.location.pathname.startsWith('/shorts/')) {
      hide('#player');
      hide('ytd-player');
      hide('#below');
      hide('ytd-reel-player-renderer');
    }
  }

  // Run once
  hideDistractions();

  // Watch for dynamic updates (YouTube SPA)
  const observer = new MutationObserver(hideDistractions);
  observer.observe(document.body, { childList: true, subtree: true });

  // Run after internal navigation
  window.addEventListener('yt-navigate-finish', hideDistractions);
})();
