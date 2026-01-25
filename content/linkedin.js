(function () {
  function hideFeed() {
    const feed = document.querySelector('[data-testid="mainFeed"]');
    if (feed) {
      feed.style.display = 'none';
      console.log('LinkedIn feed hidden');
    }
  }

  // Run once
  hideFeed();

  // LinkedIn dynamically reloads content, so watch for changes
  const observer = new MutationObserver(hideFeed);
  observer.observe(document.body, { childList: true, subtree: true });
})();
