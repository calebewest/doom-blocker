// LinkedIn Feed Remover v2 - based on mainFeed
(function () {
  'use strict';

  if (window.__LI_FEED_REMOVER__) return;
  window.__LI_FEED_REMOVER__ = true;

  function removeMainFeed() {
    const feed = document.querySelector('[data-testid="mainFeed"]');
    if (feed) {
      feed.remove();
      console.debug('[LI Feed Remover] mainFeed container removed');
    }
  }

  // Initial removal
  removeMainFeed();

  // Observe DOM mutations in case React re-adds the feed
  const observer = new MutationObserver(() => {
    removeMainFeed();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

})();
