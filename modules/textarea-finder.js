// ==================== TEXTAREA FINDER MODULE ====================
// This module finds and enhances CSS textareas on the page
// Lines 2010-2023 from original css-editor.js

/**
 * Finds all textareas with "MiscellaneousStyles" in their ID and enhances them
 * Skips textareas that have already been enhanced
 *
 * @param {Function} initializeEditor - Function to initialize editor for a textarea
 */
function findAndEnhanceTextareas(initializeEditor) {
    const textareas = document.querySelectorAll('textarea[id*="MiscellaneousStyles"]');

    console.log('[CivicPlus CSS Editor] Found ' + textareas.length + ' textarea(s) with MiscellaneousStyles in ID');

    textareas.forEach(textarea => {
        const isWrapped = textarea.parentElement && textarea.parentElement.classList.contains('css-editor-content');

        if (!isWrapped) {
            console.log('[CivicPlus CSS Editor] Enhancing textarea: #' + textarea.id);
            initializeEditor(textarea);
        }
    });
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { findAndEnhanceTextareas };
}
