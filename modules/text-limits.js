// ==================== TEXT LIMIT ENFORCEMENT MODULE ====================
// This module enforces character limits on textareas in Theme and Widget managers
// Lines 1966-2007 from original css-editor.js

/**
 * Enforces text limits by injecting JavaScript that hooks into CivicPlus functions
 * - Theme Manager: 1000 character limit
 * - Widget Manager: 255 character limit
 *
 * @param {Function} pageMatches - Function to check if URL matches patterns
 */
function enforceTextLimits(pageMatches) {
    const isThemeManager = pageMatches(['/designcenter/themes/']);
    const isWidgetManager = pageMatches(['/designcenter/widgets/']);

    if (!isThemeManager && !isWidgetManager) return;

    console.log('[CivicPlus CSS Editor] Enforcing text limits...');

    const helperCode = `
        (function() {
            ${isThemeManager ? `
                if (typeof window.initializePopovers !== 'undefined') {
                    var originalInitializePopovers = window.initializePopovers;
                    window.initializePopovers = function() {
                        originalInitializePopovers();
                        var textAreas = $(".cpPopOver textarea");
                        textAreas.each(function() {
                            $(this).attr("maxlength", 1000);
                        });
                        console.log("[CP Toolkit] Text limit enforced (Theme Manager: 1000 chars)");
                    };
                }
            ` : ''}

            ${isWidgetManager ? `
                if (typeof window.InitializeWidgetOptionsModal !== 'undefined') {
                    var oldInitOptionsModal = window.InitializeWidgetOptionsModal;
                    window.InitializeWidgetOptionsModal = function() {
                        oldInitOptionsModal();
                        $("#MiscAdvStyles").attr("maxlength", 255);
                        console.log("[CP Toolkit] Text limit enforced (Widget Manager: 255 chars)");
                    };
                }
            ` : ''}
        })();
    `;

    const script = document.createElement('script');
    script.textContent = helperCode;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { enforceTextLimits };
}
