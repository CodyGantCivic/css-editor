// ==================== MAIN INITIALIZATION MODULE ====================
// This is the main entry point that orchestrates all modules
// Lines 2039-2057 from original css-editor.js

/**
 * Main initialization function
 * Orchestrates the entire CSS editor enhancement process:
 * 1. Checks if site is CivicPlus
 * 2. Injects CSS styles
 * 3. Enforces text limits
 * 4. Starts observing for textareas
 *
 * @param {Object} modules - All required module functions
 *   - modules.isCivicPlusSite
 *   - modules.injectStyles
 *   - modules.enforceTextLimits
 *   - modules.pageMatches
 *   - modules.startObserving
 *   - modules.findAndEnhanceTextareas
 *   - modules.initializeEditor (wrapped with dependencies)
 */
async function initialize(modules) {
    console.log('[CivicPlus CSS Editor] Starting initialization...');

    // Check if this is a CivicPlus site
    const isCivicPlus = await modules.isCivicPlusSite();
    if (!isCivicPlus) {
        console.log('[CivicPlus CSS Editor] Not a CivicPlus site. Script will not run.');
        return;
    }

    console.log('[CivicPlus CSS Editor] CivicPlus site detected! Initializing CSS editor enhancement...');

    // Inject CSS styles for the editor
    modules.injectStyles();

    // Enforce text limits on Theme/Widget managers
    modules.enforceTextLimits(modules.pageMatches);

    // Start observing DOM for new textareas
    modules.startObserving(() => {
        modules.findAndEnhanceTextareas(modules.initializeEditor);
    });
}

/**
 * Bootstrap function to start initialization when DOM is ready
 * @param {Object} modules - All required module functions
 */
function bootstrap(modules) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initialize(modules));
    } else {
        initialize(modules);
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initialize, bootstrap };
}
