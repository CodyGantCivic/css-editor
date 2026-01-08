// ==================== SKIN NUMBER REPLACEMENT MODULE ====================
// This module handles automatic replacement of .skin class numbers
// Lines 1793-1802 from original css-editor.js

/**
 * Gets the current skin ID from the hidden field on the page
 * @returns {string|null} - The skin ID or null if not found
 */
function getSkinId() {
    const skinIdInput = document.getElementById('hdnSkinID');
    return skinIdInput ? skinIdInput.value : null;
}

/**
 * Replaces all .skinX class references with the specified skin ID
 * Example: If skinId is "123", replaces ".skin456" with ".skin123"
 *
 * @param {string} text - CSS text containing .skinX references
 * @param {string} skinId - The skin ID to replace with
 * @returns {string} - Text with replaced skin numbers
 */
function replaceSkinNumbers(text, skinId) {
    if (!skinId || skinId === '-1') return text;
    return text.replace(/\.skin\d+/g, '.skin' + skinId);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getSkinId, replaceSkinNumbers };
}
