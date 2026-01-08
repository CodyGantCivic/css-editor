// ==================== SITE DETECTION MODULE ====================
// This module handles detection of CivicPlus websites and URL pattern matching
// Lines 18-38 from original css-editor.js

/**
 * Checks if the current site is a CivicPlus site by attempting to fetch a known CivicPlus resource
 * @returns {Promise<boolean>} - True if CivicPlus site detected, false otherwise
 */
async function isCivicPlusSite() {
    console.log('[CivicPlus CSS Editor] Detecting if this site is a CivicPlus site. If not, a 404 error below is normal.');
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', '/Assets/Mystique/Shared/Components/ModuleTiles/Templates/cp-Module-Tile.html');
        xhr.onload = function() {
            resolve(xhr.status === 200);
        };
        xhr.onerror = () => resolve(false);
        xhr.send();
    });
}

/**
 * Checks if the current page URL matches any of the provided patterns
 * @param {string[]} patterns - Array of URL patterns to match (supports wildcards with *)
 * @returns {boolean} - True if URL matches any pattern
 */
function pageMatches(patterns) {
    const url = window.location.href.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    return patterns.some(pattern => {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');
        return regex.test(url) || regex.test(pathname);
    });
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { isCivicPlusSite, pageMatches };
}
