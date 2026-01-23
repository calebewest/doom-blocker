// Base utilities for infinite scroll blocking
(function() {
  'use strict';

  // Cross-browser storage API
  const storage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : browser.storage;

  // Site identifier - will be set by site-specific scripts
  window.DOOM_BLOCKER_SITE = window.DOOM_BLOCKER_SITE || null;

  /**
   * Get the enabled state for the current site
   */
  async function isEnabled() {
    if (!window.DOOM_BLOCKER_SITE) return false;
    
    return new Promise((resolve) => {
      storage.sync.get(['enabled'], (result) => {
        const enabled = result.enabled || {};
        resolve(enabled[window.DOOM_BLOCKER_SITE] !== false);
      });
    });
  }

  /**
   * Block scroll event listeners on elements
   */
  function blockScrollListeners() {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (type === 'scroll' || type === 'wheel') {
        // Check if this is a scroll-related listener
        const element = this;
        if (element && (element === window || element === document || element === document.documentElement || 
            element.scrollHeight > element.clientHeight)) {
          // Block scroll listeners that might trigger infinite scroll
          return;
        }
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  /**
   * Block IntersectionObserver instances that trigger loading
   */
  function blockIntersectionObservers() {
    const OriginalIntersectionObserver = window.IntersectionObserver;
    
    window.IntersectionObserver = function(callback, options) {
      const wrappedCallback = function(entries, observer) {
        // Only block if the entry is intersecting (triggering load)
        const shouldBlock = entries.some(entry => entry.isIntersecting);
        if (shouldBlock) {
          // Check if this observer is likely for infinite scroll
          const target = entries[0]?.target;
          if (target && (target.classList.contains('loading') || 
              target.getAttribute('data-loading') === 'true' ||
              target.id?.includes('loading') ||
              target.className?.includes('infinite'))) {
            return; // Block the callback
          }
        }
        return callback.call(this, entries, observer);
      };
      
      return new OriginalIntersectionObserver(wrappedCallback, options);
    };
    
    // Copy static methods
    Object.setPrototypeOf(window.IntersectionObserver, OriginalIntersectionObserver);
    window.IntersectionObserver.prototype = OriginalIntersectionObserver.prototype;
  }

  /**
   * Block fetch requests that match patterns
   */
  function blockFetchRequests(patterns) {
    if (!patterns || patterns.length === 0) return;
    
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
      
      // Check if URL matches any blocking pattern
      const shouldBlock = patterns.some(pattern => {
        if (typeof pattern === 'string') {
          return url.includes(pattern);
        } else if (pattern instanceof RegExp) {
          return pattern.test(url);
        }
        return false;
      });
      
      if (shouldBlock) {
        // Return a rejected promise to block the request
        return Promise.reject(new Error('Blocked by Doom Blocker'));
      }
      
      return originalFetch.apply(this, args);
    };
  }

  /**
   * Block XMLHttpRequest that match patterns
   */
  function blockXHRRequests(patterns) {
    if (!patterns || patterns.length === 0) return;
    
    const originalOpen = XMLHttpRequest.prototype.open;
    
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      const shouldBlock = patterns.some(pattern => {
        if (typeof pattern === 'string') {
          return url.includes(pattern);
        } else if (pattern instanceof RegExp) {
          return pattern.test(url);
        }
        return false;
      });
      
      if (shouldBlock) {
        // Override send to prevent request
        this.send = function() {
          // Block the request
        };
      }
      
      return originalOpen.call(this, method, url, ...rest);
    };
  }

  /**
   * Watch for dynamically added scroll listeners
   */
  function watchForDynamicListeners() {
    const observer = new MutationObserver((mutations) => {
      // Re-apply blocking if new elements are added
      // This is handled by the site-specific scripts
    });
    
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Initialize blocking based on enabled state
   */
  async function initBlocking(apiPatterns = []) {
    const enabled = await isEnabled();
    
    if (!enabled) {
      return; // Don't block if disabled
    }
    
    // Apply blocking mechanisms
    blockScrollListeners();
    blockIntersectionObservers();
    
    if (apiPatterns.length > 0) {
      blockFetchRequests(apiPatterns);
      blockXHRRequests(apiPatterns);
    }
    
    // Start watching for dynamic content
    if (document.body) {
      watchForDynamicListeners();
    } else {
      document.addEventListener('DOMContentLoaded', watchForDynamicListeners);
    }
  }

  // Export utilities to window for site-specific scripts
  window.DOOM_BLOCKER = {
    isEnabled,
    initBlocking,
    blockScrollListeners,
    blockIntersectionObservers,
    blockFetchRequests,
    blockXHRRequests,
    storage
  };

})();
