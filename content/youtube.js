(function () {
  function hideSidebar() {
    const sidebar = document.querySelector('#secondary-inner');
    if (sidebar) {
      sidebar.style.display = 'none';
      console.log('YouTube sidebar hidden');
    }

    const primary = document.querySelector('#primary');
    if (primary) {
      primary.style.width = '100%';
      primary.style.maxWidth = '100%';
    }
  }

  // Run immediately
  hideSidebar();

  // Re-run when YouTube dynamically updates
  const observer = new MutationObserver(hideSidebar);
  observer.observe(document.body, { childList: true, subtree: true });
})();
