// ==================== SYNTAX VALIDATION MODULE ====================
// Validates basic CSS syntax: brackets, comments, strings, selectors
// Lines 438-620 from original css-editor.js

/**
 * Validates basic CSS syntax
 * @param {string} code - CSS code to validate
 * @param {string[]} lines - Code split into lines
 * @returns {Object} - { errors: string[], warnings: string[] }
 */
function validateSyntax(code, lines) {
    const errors = [];
    const warnings = [];

    // Check for mismatched brackets
    const openBrackets = (code.match(/{/g) || []).length;
    const closeBrackets = (code.match(/}/g) || []).length;
    if (openBrackets !== closeBrackets) {
        errors.push(`Mismatched brackets: ${openBrackets} opening, ${closeBrackets} closing`);
    }

    // Check for unclosed comments
    const openComments = (code.match(/\/\*/g) || []).length;
    const closeComments = (code.match(/\*\//g) || []).length;
    if (openComments !== closeComments) {
        if (openComments > closeComments) {
            errors.push(`Unclosed comment - missing ${openComments - closeComments} closing "*/" tag(s)`);
        } else {
            errors.push(`Comment closing "*/" without opening "/*" tag`);
        }
    }

    // Check for stray closing comment tags
    lines.forEach((line, index) => {
        if (line.includes('*/') && !line.includes('/*')) {
            const beforeStar = line.substring(0, line.indexOf('*/'));
            if (beforeStar.trim().length > 0 && !beforeStar.trim().startsWith('*')) {
                const hasOpenCommentBefore = code.substring(0, code.split('\n').slice(0, index).join('\n').length).includes('/*');
                if (!hasOpenCommentBefore) {
                    errors.push(`Line ${index + 1}: Closing comment tag "*/" without opening "/*"`);
                }
            }
        }
    });

    // Check for missing opening brackets after selectors
    let inBlock = false;
    let lastSelectorLine = -1;
    let lastSelectorContent = '';

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*') || trimmedLine.endsWith('*/')) {
            return;
        }

        // Check for opening bracket
        if (trimmedLine.includes('{')) {
            inBlock = true;
            lastSelectorLine = -1;
        }

        // Check for closing bracket
        if (trimmedLine.includes('}')) {
            inBlock = false;
            lastSelectorLine = -1;
        }

        // Detect potential selector lines
        const looksLikeSelector = /^[\w\s\.\#\[\]\:\(\)\,\>\+\~\*\-]+$/.test(trimmedLine) &&
                                   !trimmedLine.includes(':') &&
                                   !trimmedLine.includes(';') &&
                                   !trimmedLine.includes('{') &&
                                   !trimmedLine.includes('}');

        if (looksLikeSelector && !inBlock) {
            lastSelectorLine = index;
            lastSelectorContent = trimmedLine;
        }

        // Check if we have a property declaration without being in a block
        const hasPropertyDeclaration = /^[a-z\-]+\s*:\s*.+/i.test(trimmedLine);

        if (hasPropertyDeclaration && !inBlock && lastSelectorLine !== -1) {
            errors.push(`Line ${lastSelectorLine + 1}: Missing opening bracket "{" after selector "${lastSelectorContent}"`);
            lastSelectorLine = -1;
        }
    });

    // Check for unclosed strings
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Skip comments
        if (trimmedLine.startsWith('/*')) {
            return;
        }

        // Count quotes that are not escaped
        let doubleQuoteCount = 0;
        let singleQuoteCount = 0;
        let isEscaped = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (isEscaped) {
                isEscaped = false;
                continue;
            }

            if (char === '\\') {
                isEscaped = true;
                continue;
            }

            if (char === '"') {
                doubleQuoteCount++;
            }

            if (char === "'") {
                singleQuoteCount++;
            }
        }

        // Odd number of quotes means unclosed string
        if (doubleQuoteCount % 2 !== 0) {
            errors.push(`Line ${index + 1}: Unclosed double-quote string`);
        }

        if (singleQuoteCount % 2 !== 0) {
            errors.push(`Line ${index + 1}: Unclosed single-quote string`);
        }
    });

    // Check for duplicate properties and invalid selectors
    const blockPattern = /([^{]+)\{([^}]+)\}/g;
    let blockMatch;
    let blockIndex = 0;

    while ((blockMatch = blockPattern.exec(code)) !== null) {
        const selector = blockMatch[1].trim();
        const blockContent = blockMatch[2];
        blockIndex++;

        // Check for invalid selector syntax - double dots (..)
        if (/\.\./.test(selector)) {
            errors.push(`Invalid selector "${selector.substring(0, 30)}..." - double dots (..)`);
        }

        // Check for double hashes (##)
        if (/##/.test(selector)) {
            errors.push(`Invalid selector "${selector.substring(0, 30)}..." - double hashes (##)`);
        }

        // Check for space after . or # at start
        if (/^\.\s+[a-z]/i.test(selector) || /^#\s+[a-z]/i.test(selector)) {
            errors.push(`Invalid selector "${selector.substring(0, 30)}..." - space after . or #`);
        }

        // Check for duplicate properties within this block
        const properties = {};
        const propertyLines = blockContent.split(';');

        propertyLines.forEach((propLine) => {
            const propMatch = propLine.trim().match(/^([a-z\-]+)\s*:/i);
            if (propMatch) {
                const propName = propMatch[1].toLowerCase();

                if (properties[propName]) {
                    properties[propName]++;
                } else {
                    properties[propName] = 1;
                }
            }
        });

        // Report duplicates as warnings
        Object.keys(properties).forEach((propName) => {
            if (properties[propName] > 1) {
                warnings.push(`Duplicate property "${propName}" defined ${properties[propName]} times in selector block ${blockIndex}`);
            }
        });
    }

    return { errors, warnings };
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateSyntax };
}
