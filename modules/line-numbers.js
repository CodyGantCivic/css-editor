// ==================== LINE NUMBERS MODULE ====================
// This module handles the generation and synchronization of line numbers
// Lines 303-338 from original css-editor.js

/**
 * Updates the line numbers display based on the textarea content
 * Handles wrapped lines by showing grayed-out placeholders
 *
 * @param {HTMLTextAreaElement} textarea - The textarea element
 * @param {HTMLElement} lineNumbersDiv - The div containing line numbers
 * @param {HTMLElement} backdrop - The backdrop element with syntax-highlighted code
 */
function updateLineNumbers(textarea, lineNumbersDiv, backdrop) {
    const value = textarea.value;

    // If empty, just show line 1
    if (value.length === 0) {
        lineNumbersDiv.innerHTML = '<div>1</div>';
        return;
    }

    // Get the computed line height
    const style = window.getComputedStyle(backdrop);
    let lineHeight = parseFloat(style.lineHeight);

    // Fallback if lineHeight is not set or invalid
    if (isNaN(lineHeight) || lineHeight === 0) {
        const fs = parseFloat(style.fontSize) || 13;
        lineHeight = fs * 1.5;
    }

    // Get all code lines from the backdrop
    const codeLines = backdrop.querySelectorAll('.code-line');

    let html = '';
    let logicalIndex = 1;

    // For each logical line, determine how many visual lines it takes
    codeLines.forEach((el) => {
        const h = el.getBoundingClientRect().height || el.offsetHeight || lineHeight;
        const visualLinesForThisLogical = Math.max(1, Math.round(h / lineHeight));

        // First visual line gets the line number
        html += `<div>${logicalIndex}</div>`;

        // Additional visual lines (wrapped portions) get blank placeholders
        for (let i = 1; i < visualLinesForThisLogical; i++) {
            html += `<div class="wrapped-line"></div>`;
        }

        logicalIndex++;
    });

    lineNumbersDiv.innerHTML = html;
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateLineNumbers };
}
