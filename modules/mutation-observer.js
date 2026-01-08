// ==================== MUTATION OBSERVER MODULE ====================
// This module watches for DOM changes and auto-enhances new textareas
// Lines 2027-2036 from original css-editor.js

/**
 * Starts observing the DOM for changes to automatically enhance new textareas
 * Useful for modals and dynamically loaded content
 *
 * @param {Function} findAndEnhanceTextareas - Function to find and enhance textareas
 */
function startObserving(findAndEnhanceTextareas) {
    const observer = new MutationObserver(() => {
        findAndEnhanceTextareas();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[CivicPlus CSS Editor] Mutation observer started');

    // Also do initial scan
    findAndEnhanceTextareas();
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { startObserving };
}
