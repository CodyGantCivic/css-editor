// ==================== SYNTAX HIGHLIGHTER MODULE ====================
// This module handles CSS syntax highlighting with VS Code Light theme colors
// Lines 226-301 from original css-editor.js

/**
 * Highlights CSS code with syntax colors and inline color previews
 * @param {string} code - Raw CSS code to highlight
 * @returns {string} - HTML string with syntax highlighting spans
 *
 * Highlights:
 * - Comments (/* */) in green
 * - Strings ("text" or 'text') in red
 * - .skin classes in teal
 * - !important in purple
 * - Properties in blue
 * - Values in red
 * - Numbers and units in green
 * - Hex colors with inline preview boxes
 * - RGB/RGBA colors with inline preview boxes
 * - Brackets {} in blue
 */
function highlightCSS(code) {
    // Escape HTML special characters
    code = code.replace(/[<>&]/g, (char) => {
        const escapeMap = { '<': '&lt;', '>': '&gt;', '&': '&amp;' };
        return escapeMap[char];
    });

    let tmp = code;

    // Highlight comments first
    tmp = tmp.replace(/\/\*[\s\S]*?\*\//g, (match) => `<span class="css-comment">${match}</span>`);

    // Highlight strings
    tmp = tmp.replace(/(['"])(?:(?=(\\?))\2.)*?\1/g, (match) => `<span class="css-string">${match}</span>`);

    // Highlight .skin classes
    tmp = tmp.replace(/\.skin\d+/g, (match) => `<span class="css-skin-class">${match}</span>`);

    // Highlight !important
    tmp = tmp.replace(/!important/g, '<span class="css-important">!important</span>');

    const logicalLines = tmp.split('\n');

    /**
     * Highlights CSS properties and their values in a line
     * @param {string} line - Single line of CSS code
     * @returns {string} - Line with highlighted properties and values
     */
    function highlightProperties(line) {
        return line.replace(/([a-z-]+)(\s*)(:)(\s*)([^;}\n]+)(;?)/gi, (match, prop, space1, colon, space2, value, semicolon) => {
            // Skip if this is part of a comment or string
            if (match.includes('/*') || match.includes('*/') || match.includes('"') || match.includes("'")) {
                return match;
            }
            // Skip if this looks like a selector with a bracket
            if (value.includes('{')) {
                return match;
            }

            let highlightedValue = value;

            // First, temporarily replace hex colors with placeholders to prevent double-matching
            const hexMatches = [];
            highlightedValue = highlightedValue.replace(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g, (colorMatch) => {
                const index = hexMatches.length;
                hexMatches.push(colorMatch);
                return `__HEX_${index}__`;
            });

            // Temporarily replace rgb/rgba functions with placeholders to prevent nested highlighting
            const rgbaMatches = [];
            highlightedValue = highlightedValue.replace(/rgba?\([^)]+\)/gi, (colorMatch) => {
                const index = rgbaMatches.length;
                rgbaMatches.push(colorMatch);
                return `__RGBA_${index}__`;
            });

            // Now highlight numbers and units (won't affect color placeholders)
            highlightedValue = highlightedValue.replace(/\b(\d+\.?\d*)([a-z%]+)\b/gi, (numMatch, num, unit) => {
                return `<span class="css-number">${num}${unit}</span>`;
            });

            highlightedValue = highlightedValue.replace(/\b(\d+\.?\d*)\b/g, (numMatch) => {
                if (numMatch.includes('span')) return numMatch;
                return `<span class="css-number">${numMatch}</span>`;
            });

            // Restore hex colors with proper highlighting and color preview
            highlightedValue = highlightedValue.replace(/__HEX_(\d+)__/g, (match, index) => {
                const colorMatch = hexMatches[parseInt(index)];
                return `<span class="css-color">${colorMatch}</span><span class="css-color-preview" style="background:${colorMatch}"></span>`;
            });

            // Finally, restore rgba functions with proper highlighting and color preview
            highlightedValue = highlightedValue.replace(/__RGBA_(\d+)__/g, (match, index) => {
                const colorMatch = rgbaMatches[parseInt(index)];
                return `<span class="css-color">${colorMatch}</span><span class="css-color-preview" style="background:${colorMatch}"></span>`;
            });

            highlightedValue = `<span class="css-value">${highlightedValue}</span>`;

            return `<span class="css-property">${prop}</span>${space1}<span class="css-colon">:</span>${space2}${highlightedValue}${semicolon ? '<span class="css-semicolon">;</span>' : ''}`;
        });
    }

    const linesHtml = logicalLines.map(line => {
        const processed = highlightProperties(line);
        return `<div class="code-line">${processed || '&nbsp;'}</div>`;
    }).join('');

    // Highlight brackets
    return linesHtml.replace(/[{}]/g, (match) => `<span class="css-bracket">${match}</span>`);
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { highlightCSS };
}
