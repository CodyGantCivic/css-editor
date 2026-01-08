// ==================== COMPLETE VALIDATION MODULE ====================
// Full CSS validation module extracted from css-editor.js lines 340-1791
// This is the complete 1450+ line validation function with 100+ checks
//
// NOTE: This can be further split into:
// - validation/syntax.js (DONE - basic module created)
// - validation/properties.js
// - validation/colors.js
// - validation/functions.js (calc, url, var)  
// - validation/advanced.js (grid, flexbox, transforms)
// - validation/at-rules.js (@media, @keyframes, etc.)


/**
 * Complete CSS validation function with 100+ validation checks
 * @param {string} code - CSS code to validate
 * @returns {Object} - { isValid: boolean, hasWarnings: boolean, errors: string[], warnings: string[] }
 */
    function validateCSS(code) {
        const errors = [];
        const warnings = [];

        // Common CSS property typos mapped to correct property names
const commonTypos = {
    // Border typos
    'bordr': 'border',
    'bordre': 'border',
    'boder': 'border',
    'broder': 'border',
    'border-raduis': 'border-radius',
    'border-raius': 'border-radius',
    'border-radiius': 'border-radius',
    'broder-radius': 'border-radius',

    // Color typos
    'collor': 'color',
    'colr': 'color',
    'clor': 'color',
    'colour': 'color',
    'backgroud': 'background',
    'backgrund': 'background',
    'bakground': 'background',
    'background-collor': 'background-color',
    'backgorund-color': 'background-color',

    // Display typos
    'dispaly': 'display',
    'dislay': 'display',
    'dsiplay': 'display',
    'displya': 'display',

    // Margin/Padding typos
    'margn': 'margin',
    'marign': 'margin',
    'maring': 'margin',
    'margim': 'margin',
    'paddin': 'padding',
    'paading': 'padding',
    'paddng': 'padding',

    // Width/Height typos
    'widht': 'width',
    'wdith': 'width',
    'witdh': 'width',
    'hieght': 'height',
    'heigth': 'height',
    'heght': 'height',
    'max-widht': 'max-width',
    'min-widht': 'min-width',
    'max-hieght': 'max-height',
    'min-hieght': 'min-height',

    // Position typos
    'postion': 'position',
    'positon': 'position',
    'psition': 'position',

    // Font typos
    'font-szie': 'font-size',
    'font-famly': 'font-family',
    'font-wieght': 'font-weight',
    'font-weigth': 'font-weight',

    // Text typos
    'txt-align': 'text-align',
    'text-decoraton': 'text-decoration',
    'text-trasform': 'text-transform',

    // Float typos
    'flot': 'float',
    'flaot': 'float',

    // Overflow typos
    'overlow': 'overflow',
    'overfow': 'overflow',

    // Z-index typos
    'zindex': 'z-index',
    'z-indx': 'z-index',

    // Opacity typos
    'opactiy': 'opacity',
    'opacty': 'opacity',

    // Transition typos
    'transistion': 'transition',
    'trasition': 'transition',
    'tranistion': 'transition',

    // Transform typos
    'tranform': 'transform',
    'trasform': 'transform',
    'transfrom': 'transform'
};

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

        // Check for comments that start improperly (text before /*)
        const lines = code.split('\n');
        lines.forEach((line, index) => {
            // Check for */ without /* on the same line or before
            if (line.includes('*/') && !line.includes('/*')) {
                // This might be a multi-line comment, but check if it looks like stray */
                const beforeStar = line.substring(0, line.indexOf('*/'));
                if (beforeStar.trim().length > 0 && !beforeStar.trim().startsWith('*')) {
                    // There's content before */ that doesn't look like continuation
                    const hasOpenCommentBefore = code.substring(0, code.split('\n').slice(0, index).join('\n').length).includes('/*');
                    if (!hasOpenCommentBefore) {
                        errors.push(`Line ${index + 1}: Closing comment tag "*/" without opening "/*"`);
                    }
                }
            }
        });

        // Check for unclosed strings (double quotes and single quotes)

        // Check for missing opening brackets
        // Pattern: selector followed by properties without opening bracket
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

            // Detect potential selector lines (lines that look like selectors)
            // Selectors typically contain: .class, #id, element, or combinators
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
                lastSelectorLine = -1; // Reset to avoid duplicate errors
            }
        });
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            // Skip comments
            if (trimmedLine.startsWith('/*')) {
                return;
            }

            // Check for unclosed double-quote strings
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
        // Parse CSS blocks to find duplicate properties
        const blockPattern = /([^{]+)\{([^}]+)\}/g;
        let blockMatch;
        let blockIndex = 0;

        while ((blockMatch = blockPattern.exec(code)) !== null) {
            const selector = blockMatch[1].trim();
            const blockContent = blockMatch[2];
            blockIndex++;

            // Check for invalid selector syntax
            // Check for double dots (..)
            if (/\.\./.test(selector)) {
                errors.push(`Invalid selector "${selector.substring(0, 30)}..." - double dots (..)`);
            }

            // Check for double hashes (##)
            if (/##/.test(selector)) {
                errors.push(`Invalid selector "${selector.substring(0, 30)}..." - double hashes (##)`);
            }

            // Check for space before class/id in compound selector
            if (/\s+\.[a-z]/i.test(selector) || /\s+#[a-z]/i.test(selector)) {
                // This could be a descendant selector, which is valid, so only flag if it looks wrong
                // e.g., "div .class" is valid, but ". class" is not
                if (/^\.\s+[a-z]/i.test(selector) || /^#\s+[a-z]/i.test(selector)) {
                    errors.push(`Invalid selector "${selector.substring(0, 30)}..." - space after . or #`);
                }
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

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            // Skip empty lines, comments, and lines with only brackets
            if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine === '{' || trimmedLine === '}') {
                return;
            }

            // Skip selector lines (lines that end with { or contain pseudo-classes/elements)
            if (trimmedLine.endsWith('{') || /^[\w\s\.\#\[\]\:\(\)\,\>\+\~\*\-]+\{?$/.test(trimmedLine)) {
                return;
            }

            // Check for missing colon - property line without colon
            // Look for lines that have alphanumeric content and a value-like pattern but no colon
            if (!trimmedLine.includes(':') && !trimmedLine.startsWith('}') && !trimmedLine.endsWith('}')) {
                // Check if it looks like a property declaration (word followed by space/value)
                // Examples: "border-radius 10px", "color red", "display block"
                const possibleProperty = /^([a-z\-]+)\s+([^\s;]+)/i.test(trimmedLine);
                if (possibleProperty) {
                    errors.push(`Line ${index + 1}: Missing colon after property name`);
                }
            }

            // Check for missing property values
            // Pattern: property: ; or property:; (colon with no value before semicolon)
            if (trimmedLine.includes(':')) {
                // Match pattern like "color: ;" or "color:;" or "color:" at end of line
                const emptyValuePattern = /^([a-z\-]+)\s*:\s*;?\s*$/i;
                const match = trimmedLine.match(emptyValuePattern);
                if (match) {
                    errors.push(`Line ${index + 1}: Missing value for property "${match[1]}"`);
                }

                // Check for common property name typos
                const propertyMatch = trimmedLine.match(/^([a-z\-]+)\s*:/i);
                if (propertyMatch) {
                    const propertyName = propertyMatch[1].toLowerCase();
                    if (commonTypos[propertyName]) {
                        errors.push(`Line ${index + 1}: Invalid property "${propertyName}" - did you mean "${commonTypos[propertyName]}"?`);
                    }
                }

                // Check for invalid units
                // Valid CSS units: px, em, rem, %, vh, vw, vmin, vmax, pt, pc, in, cm, mm, ex, ch, s, ms, deg, rad, grad, turn, fr
                const validUnits = ['px', 'em', 'rem', '%', 'vh', 'vw', 'vmin', 'vmax', 'pt', 'pc', 'in', 'cm', 'mm', 'ex', 'ch', 's', 'ms', 'deg', 'rad', 'grad', 'turn', 'fr', 'q', 'dpi', 'dpcm', 'dppx', 'hz', 'khz'];

                // Match numbers followed by units (e.g., 10px, 1.5em, 100%, etc.)
                // Only match if the value actually contains units, not CSS keywords
                const unitMatches = trimmedLine.matchAll(/(\d+\.?\d*)(px|em|rem|%|vh|vw|vmin|vmax|pt|pc|in|cm|mm|ex|ch|s|ms|deg|rad|grad|turn|fr|q|dpi|dpcm|dppx|hz|khz|[a-z]{1,4})\b/gi);

                for (const match of unitMatches) {
                    const unit = match[2].toLowerCase();

                    // Skip if this looks like it's part of a CSS keyword/function
                    // Check if the unit is followed by more letters (indicating it's a word, not a unit)
                    const fullMatch = match[0];
                    const afterMatch = trimmedLine.substring(trimmedLine.indexOf(fullMatch) + fullMatch.length, trimmedLine.indexOf(fullMatch) + fullMatch.length + 1);
                    if (/[a-z]/i.test(afterMatch)) {
                        continue; // This is part of a longer word, skip it
                    }

                    // Check if it's a valid unit or a common typo
                    if (!validUnits.includes(unit)) {
                        // Common unit typos
                        const unitTypos = {
                            'pxx': 'px',
                            'pz': 'px',
                            'emm': 'em',
                            'rrem': 'rem',
                            'pct': '%',
                            'vhh': 'vh',
                            'vww': 'vw'
                        };

                        if (unitTypos[unit]) {
                            errors.push(`Line ${index + 1}: Invalid unit "${unit}" - did you mean "${unitTypos[unit]}"?`);
                        } else if (/^px+$/.test(unit) && unit !== 'px') {
                            // Catches pxxx, pxxxx, etc.
                            errors.push(`Line ${index + 1}: Invalid unit "${unit}" - did you mean "px"?`);
                        } else if (/^em+$/.test(unit) && unit !== 'em') {
                            // Catches emmm, emmmm, etc.
                            errors.push(`Line ${index + 1}: Invalid unit "${unit}" - did you mean "em"?`);
                        } else if (/^rem+$/.test(unit) && unit !== 'rem') {
                            // Catches remmm, remmmm, etc.
                            errors.push(`Line ${index + 1}: Invalid unit "${unit}" - did you mean "rem"?`);
                        } else if (/^vh+$/.test(unit) && unit !== 'vh') {
                            // Catches vhhh, vhhhh, etc.
                            errors.push(`Line ${index + 1}: Invalid unit "${unit}" - did you mean "vh"?`);
                        } else if (/^vw+$/.test(unit) && unit !== 'vw') {
                            // Catches vwww, vwwww, etc.
                            errors.push(`Line ${index + 1}: Invalid unit "${unit}" - did you mean "vw"?`);
                        } else if (/^[a-z]{2,}$/.test(unit)) {
                            // Unknown unit that looks like it could be a typo
                            errors.push(`Line ${index + 1}: Invalid or unknown unit "${unit}"`);
                        }
                    }
                }

                // Extract property name and value for multiple validations below
                const propValueMatch = trimmedLine.match(/^([a-z\-]+)\s*:\s*([^;]+)/i);

                // Check for invalid color values
                if (propValueMatch) {
                    const propertyName = propValueMatch[1].toLowerCase();
                    const propertyValue = propValueMatch[2].trim();

                    // Check if this is a color-related property
                    const colorProperties = ['color', 'background-color', 'border-color', 'outline-color', 'text-decoration-color', 'background'];

                    if (colorProperties.includes(propertyName) || propertyName.includes('color')) {
                        // Check for malformed hex colors
                        const hexMatches = propertyValue.matchAll(/#([0-9a-fA-F]*)/g);
                        for (const hexMatch of hexMatches) {
                            const hexValue = hexMatch[1];
                            const validHexLengths = [3, 4, 6, 8]; // #RGB, #RGBA, #RRGGBB, #RRGGBBAA

                            if (hexValue.length > 0 && !validHexLengths.includes(hexValue.length)) {
                                errors.push(`Line ${index + 1}: Invalid hex color "#${hexValue}" - hex colors must be 3, 4, 6, or 8 characters`);
                            }

                            // Check for invalid hex characters
                            if (hexValue.length > 0 && !/^[0-9a-fA-F]+$/.test(hexValue)) {
                                errors.push(`Line ${index + 1}: Invalid hex color "#${hexValue}" - contains invalid characters (only 0-9, A-F allowed)`);
                            }
                        }

                        // Check for invalid RGB/RGBA values
                        const rgbMatches = propertyValue.matchAll(/rgba?\(([^)]+)\)/gi);
                        for (const rgbMatch of rgbMatches) {
                            const rgbContent = rgbMatch[1].trim();
                            const values = rgbContent.split(',').map(v => v.trim());

                            // RGB should have 3 values, RGBA should have 4
                            const isRgba = rgbMatch[0].toLowerCase().startsWith('rgba');
                            const expectedLength = isRgba ? 4 : 3;

                            if (values.length !== expectedLength) {
                                errors.push(`Line ${index + 1}: Invalid ${isRgba ? 'rgba' : 'rgb'} - expected ${expectedLength} values, got ${values.length}`);
                            } else {
                                // Check RGB values (0-255)
                                for (let i = 0; i < 3; i++) {
                                    const val = parseInt(values[i]);
                                    if (isNaN(val) || val < 0 || val > 255) {
                                        errors.push(`Line ${index + 1}: Invalid ${isRgba ? 'rgba' : 'rgb'} - RGB values must be 0-255, got "${values[i]}"`);
                                        break;
                                    }
                                }

                                // Check alpha value (0-1) for RGBA
                                if (isRgba && values.length === 4) {
                                    const alpha = parseFloat(values[3]);
                                    if (isNaN(alpha) || alpha < 0 || alpha > 1) {
                                        errors.push(`Line ${index + 1}: Invalid rgba - alpha value must be 0-1, got "${values[3]}"`);
                                    }
                                }
                            }
                        }

                        // Check for common color name typos
                        const commonColorTypos = {
                            'reed': 'red',
                            'redd': 'red',
                            'blu': 'blue',
                            'bleu': 'blue',
                            'bule': 'blue',
                            'grean': 'green',
                            'gren': 'green',
                            'greeen': 'green',
                            'yellw': 'yellow',
                            'yello': 'yellow',
                            'yelow': 'yellow',
                            'ornge': 'orange',
                            'orage': 'orange',
                            'purpel': 'purple',
                            'purpl': 'purple',
                            'pruple': 'purple',
                            'pnk': 'pink',
                            'pnik': 'pink',
                            'blck': 'black',
                            'balck': 'black',
                            'blak': 'black',
                            'whte': 'white',
                            'wite': 'white',
                            'whitee': 'white',
                            'grey': 'gray',
                            'gry': 'gray',
                            'silve': 'silver',
                            'sliver': 'silver',
                            'brwn': 'brown',
                            'borwn': 'brown',
                            'bown': 'brown'
                        };

                        // Check if value is a simple word (potential color name)
                        const simpleWordMatch = propertyValue.match(/^([a-z]+)$/i);
                        if (simpleWordMatch) {
                            const word = simpleWordMatch[1].toLowerCase();
                            if (commonColorTypos[word]) {
                                errors.push(`Line ${index + 1}: Invalid color "${word}" - did you mean "${commonColorTypos[word]}"?`);
                            }
                        }
                    }
                }

                // Check for invalid property values (wrong value types)
                if (propValueMatch) {
                    const propertyName = propValueMatch[1].toLowerCase();
                    const propertyValue = propValueMatch[2].trim();

                    // Define expected value types for common properties
                    const propertyValueRules = {
                        'display': {
                            validValues: ['none', 'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'table-row', 'table-cell', 'list-item', 'run-in', 'contents', 'inherit', 'initial', 'unset'],
                            type: 'keyword',
                            message: 'must be a display keyword (block, inline, flex, grid, none, etc.)'
                        },
                        'position': {
                            validValues: ['static', 'relative', 'absolute', 'fixed', 'sticky', 'inherit', 'initial', 'unset'],
                            type: 'keyword',
                            message: 'must be a position keyword (static, relative, absolute, fixed, sticky)'
                        },
                        'float': {
                            validValues: ['none', 'left', 'right', 'inherit', 'initial', 'unset'],
                            type: 'keyword',
                            message: 'must be a float keyword (none, left, right)'
                        },
                        'clear': {
                            validValues: ['none', 'left', 'right', 'both', 'inherit', 'initial', 'unset'],
                            type: 'keyword',
                            message: 'must be a clear keyword (none, left, right, both)'
                        },
                        'overflow': {
                            validValues: ['visible', 'hidden', 'scroll', 'auto', 'inherit', 'initial', 'unset', 'clip'],
                            type: 'keyword',
                            message: 'must be an overflow keyword (visible, hidden, scroll, auto)'
                        },
                        'overflow-x': {
                            validValues: ['visible', 'hidden', 'scroll', 'auto', 'inherit', 'initial', 'unset', 'clip'],
                            type: 'keyword',
                            message: 'must be an overflow keyword (visible, hidden, scroll, auto)'
                        },
                        'overflow-y': {
                            validValues: ['visible', 'hidden', 'scroll', 'auto', 'inherit', 'initial', 'unset', 'clip'],
                            type: 'keyword',
                            message: 'must be an overflow keyword (visible, hidden, scroll, auto)'
                        },
                        'text-align': {
                            validValues: ['left', 'right', 'center', 'justify', 'start', 'end', 'inherit', 'initial', 'unset'],
                            type: 'keyword',
                            message: 'must be a text-align keyword (left, right, center, justify)'
                        },
                        'vertical-align': {
                            validValues: ['baseline', 'top', 'middle', 'bottom', 'sub', 'super', 'text-top', 'text-bottom', 'inherit', 'initial', 'unset'],
                            type: 'keyword-or-length',
                            message: 'must be a vertical-align keyword or length value'
                        },
                        'text-transform': {
                            validValues: ['none', 'capitalize', 'uppercase', 'lowercase', 'inherit', 'initial', 'unset'],
                            type: 'keyword',
                            message: 'must be a text-transform keyword (none, capitalize, uppercase, lowercase)'
                        },
                        'font-weight': {
                            validValues: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'inherit', 'initial', 'unset'],
                            type: 'keyword-or-number',
                            message: 'must be a font-weight keyword (normal, bold) or number (100-900)'
                        },
                        'font-style': {
                            validValues: ['normal', 'italic', 'oblique', 'inherit', 'initial', 'unset'],
                            type: 'keyword',
                            message: 'must be a font-style keyword (normal, italic, oblique)'
                        },
                        'text-decoration': {
                            validValues: ['none', 'underline', 'overline', 'line-through', 'inherit', 'initial', 'unset'],
                            type: 'keyword-or-multiple',
                            message: 'must be a text-decoration keyword (none, underline, overline, line-through)'
                        },
                        'cursor': {
                            validValues: ['auto', 'default', 'pointer', 'move', 'text', 'wait', 'help', 'crosshair', 'not-allowed', 'grab', 'grabbing', 'zoom-in', 'zoom-out', 'inherit', 'initial', 'unset'],
                            type: 'keyword-or-url',
                            message: 'must be a cursor keyword (pointer, default, move, text, etc.) or url()'
                        },
                        'visibility': {
                            validValues: ['visible', 'hidden', 'collapse', 'inherit', 'initial', 'unset'],
                            type: 'keyword',
                            message: 'must be a visibility keyword (visible, hidden, collapse)'
                        },
                        'z-index': {
                            validValues: ['auto', 'inherit', 'initial', 'unset'],
                            type: 'keyword-or-integer',
                            message: 'must be an integer or "auto"'
                        }
                    };

                    // Check if property has validation rules
                    if (propertyValueRules[propertyName]) {
                        const rule = propertyValueRules[propertyName];
                        const cleanValue = propertyValue.replace(/!important/i, '').trim();

                        // For strict keyword properties
                        if (rule.type === 'keyword') {
                            if (!rule.validValues.includes(cleanValue.toLowerCase())) {
                                // Check if it looks like a wrong type (e.g., numeric value for display)
                                if (/^\d+/.test(cleanValue)) {
                                    errors.push(`Line ${index + 1}: Invalid value "${cleanValue}" for property "${propertyName}" - ${rule.message}`);
                                } else if (!cleanValue.includes('var(') && !cleanValue.includes('calc(')) {
                                    // Only report if it's not a CSS variable or calc function
                                    errors.push(`Line ${index + 1}: Invalid value "${cleanValue}" for property "${propertyName}" - ${rule.message}`);
                                }
                            }
                        }

                        // For properties that accept keywords OR lengths
                        if (rule.type === 'keyword-or-length') {
                            const hasUnit = /^\d+\.?\d*(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch)$/i.test(cleanValue);
                            const isKeyword = rule.validValues.includes(cleanValue.toLowerCase());
                            if (!hasUnit && !isKeyword && !cleanValue.includes('var(') && !cleanValue.includes('calc(')) {
                                errors.push(`Line ${index + 1}: Invalid value "${cleanValue}" for property "${propertyName}" - ${rule.message}`);
                            }
                        }

                        // For properties that accept keywords OR numbers
                        if (rule.type === 'keyword-or-number') {
                            const isNumber = /^\d+$/.test(cleanValue);
                            const isKeyword = rule.validValues.includes(cleanValue.toLowerCase());
                            if (!isNumber && !isKeyword && !cleanValue.includes('var(')) {
                                errors.push(`Line ${index + 1}: Invalid value "${cleanValue}" for property "${propertyName}" - ${rule.message}`);
                            }
                        }

                        // For properties that accept keywords OR integers
                        if (rule.type === 'keyword-or-integer') {
                            const isInteger = /^-?\d+$/.test(cleanValue);
                            const isKeyword = rule.validValues.includes(cleanValue.toLowerCase());
                            if (!isInteger && !isKeyword && !cleanValue.includes('var(')) {
                                errors.push(`Line ${index + 1}: Invalid value "${cleanValue}" for property "${propertyName}" - ${rule.message}`);
                            }
                        }
                    }

                    // Check for properties that should NEVER have length values
                    const lengthIncompatibleProps = {
                        'display': true,
                        'position': true,
                        'float': true,
                        'clear': true,
                        'text-transform': true,
                        'font-style': true,
                        'visibility': true
                    };

                    if (lengthIncompatibleProps[propertyName]) {
                        // Check if value contains a length unit
                        if (/\d+\.?\d*(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch)/i.test(propertyValue)) {
                            errors.push(`Line ${index + 1}: Property "${propertyName}" does not accept length values`);
                        }
                    }

                    // Check for width/height with keyword values that don't make sense
                    if (['width', 'height', 'max-width', 'max-height', 'min-width', 'min-height'].includes(propertyName)) {
                        const invalidSizeKeywords = ['block', 'inline', 'flex', 'grid', 'left', 'right', 'center', 'top', 'bottom', 'absolute', 'relative', 'fixed'];
                        const cleanValue = propertyValue.replace(/!important/i, '').trim().toLowerCase();
                        if (invalidSizeKeywords.includes(cleanValue)) {
                            errors.push(`Line ${index + 1}: Invalid value "${cleanValue}" for property "${propertyName}" - must be a length, percentage, or valid keyword (auto, inherit, etc.)`);
                        }
                    }
                }

                // Check for calc() function errors
                const calcMatches = trimmedLine.matchAll(/calc\(([^)]+)\)/gi);
                for (const calcMatch of calcMatches) {
                    const calcContent = calcMatch[1];

                    // Check for missing spaces around operators (+, -, *, /)
                    // CSS calc() requires spaces around + and - operators
                    const plusMinusNoSpace = /\d(\+|-)\d/.test(calcContent) || /\)(\+|-)\d/.test(calcContent) || /\d(\+|-)\(/.test(calcContent);
                    if (plusMinusNoSpace) {
                        errors.push(`Line ${index + 1}: calc() requires spaces around + and - operators (e.g., "calc(100% - 20px)" not "calc(100%-20px)")`);
                    }

                    // Check for missing closing parenthesis (this would be caught by overall syntax, but let's be specific)
                    const openParens = (calcContent.match(/\(/g) || []).length;
                    const closeParens = (calcContent.match(/\)/g) || []).length;
                    if (openParens > closeParens) {
                        errors.push(`Line ${index + 1}: calc() has unclosed parenthesis`);
                    }

                    // Check for invalid expressions - numbers without units in certain contexts
                    // In calc(), plain numbers should have units when used with lengths (except for multiplication/division)
                    const parts = calcContent.split(/[\+\-\*\/]/).map(p => p.trim());

                    // Check if there are operators
                    const hasOperators = /[\+\-\*\/]/.test(calcContent);
                    if (hasOperators) {
                        // Look for patterns like: 100% + 20 (missing unit on 20)
                        // But allow: 100% * 2 (multiplying by unitless number is OK)
                        const addSubPattern = calcContent.match(/([\d\.]+)(px|em|rem|%|vh|vw|vmin|vmax|pt|pc|in|cm|mm|ex|ch)?\s*[\+\-]\s*([\d\.]+)(px|em|rem|%|vh|vw|vmin|vmax|pt|pc|in|cm|mm|ex|ch)?/i);
                        if (addSubPattern) {
                            const firstNum = addSubPattern[1];
                            const firstUnit = addSubPattern[2];
                            const secondNum = addSubPattern[3];
                            const secondUnit = addSubPattern[4];

                            // If first has unit but second doesn't (or vice versa), that's likely an error
                            if ((firstUnit && !secondUnit) || (!firstUnit && secondUnit)) {
                                errors.push(`Line ${index + 1}: calc() mixing units and unitless numbers in addition/subtraction (e.g., "100% + 20" should be "100% + 20px")`);
                            }
                        }
                    }

                    // Check for empty calc()
                    if (calcContent.trim() === '') {
                        errors.push(`Line ${index + 1}: Empty calc() function`);
                    }

                    // Check for division by zero
                    if (/\/\s*0(?:\s|$|\))/.test(calcContent)) {
                        errors.push(`Line ${index + 1}: calc() division by zero`);
                    }

                    // Check for consecutive operators
                    if (/[\+\-\*\/]\s*[\+\-\*\/]/.test(calcContent.replace(/\s+/g, ' '))) {
                        errors.push(`Line ${index + 1}: calc() has consecutive operators`);
                    }
                }

                // Check for URL() function errors
                const urlMatches = trimmedLine.matchAll(/url\(([^)]*)\)?/gi);
                for (const urlMatch of urlMatches) {
                    const urlContent = urlMatch[1];
                    const fullMatch = urlMatch[0];

                    // Check for unclosed url() parenthesis
                    if (!fullMatch.endsWith(')')) {
                        errors.push(`Line ${index + 1}: Unclosed url() function - missing closing parenthesis`);
                    }

                    // Check for empty url()
                    if (urlContent.trim() === '') {
                        errors.push(`Line ${index + 1}: Empty url() function`);
                    }

                    // Check for unquoted URLs with spaces (spaces require quotes)
                    if (urlContent.includes(' ') && !urlContent.match(/^['"].*['"]$/)) {
                        warnings.push(`Line ${index + 1}: URL with spaces should be quoted (e.g., url("path with spaces.jpg"))`);
                    }
                }

                // Check for multiple consecutive semicolons
                if (/;;+/.test(trimmedLine)) {
                    errors.push(`Line ${index + 1}: Multiple consecutive semicolons (;;)`);
                }

                // Check for space in property names
                // Property names should be single words with hyphens, not spaces
                const propertyWithSpace = trimmedLine.match(/^([a-z]+)\s+([a-z\-]+)\s*:/i);
                if (propertyWithSpace && !trimmedLine.startsWith('/*')) {
                    const possibleProperty = propertyWithSpace[1] + propertyWithSpace[2];
                    // Common properties that might be split
                    const commonSplitProperties = {
                        'background color': 'background-color',
                        'background image': 'background-image',
                        'border radius': 'border-radius',
                        'border color': 'border-color',
                        'border width': 'border-width',
                        'border style': 'border-style',
                        'font size': 'font-size',
                        'font family': 'font-family',
                        'font weight': 'font-weight',
                        'font style': 'font-style',
                        'text align': 'text-align',
                        'text decoration': 'text-decoration',
                        'text transform': 'text-transform',
                        'line height': 'line-height',
                        'letter spacing': 'letter-spacing',
                        'word spacing': 'word-spacing',
                        'max width': 'max-width',
                        'max height': 'max-height',
                        'min width': 'min-width',
                        'min height': 'min-height',
                        'z index': 'z-index',
                        'box shadow': 'box-shadow',
                        'text shadow': 'text-shadow'
                    };

                    const splitKey = (propertyWithSpace[1] + ' ' + propertyWithSpace[2]).toLowerCase();
                    if (commonSplitProperties[splitKey]) {
                        errors.push(`Line ${index + 1}: Property name cannot contain spaces - did you mean "${commonSplitProperties[splitKey]}"?`);
                    } else {
                        errors.push(`Line ${index + 1}: Property name cannot contain spaces`);
                    }
                }

                // Check for missing commas in multi-value properties
                if (propValueMatch) {
                    const propertyName = propValueMatch[1].toLowerCase();
                    const propertyValue = propValueMatch[2].trim();

                    // Properties that require commas between multiple values
                    const commaRequiredProps = ['font-family', 'font', 'transition', 'animation'];

                    if (commaRequiredProps.includes(propertyName)) {
                        // Check if value has multiple words that should be separated by commas
                        // font-family: Arial Helvetica sans-serif (WRONG)
                        // font-family: Arial, Helvetica, sans-serif (CORRECT)

                        if (propertyName === 'font-family' || propertyName === 'font') {
                            // Remove quoted strings first
                            const withoutQuotes = propertyValue.replace(/(['"])(?:(?=(\\?))\2.)*?\1/g, 'QUOTED');

                            // Check for multiple font names without commas
                            // Common fonts that should be separated
                            const commonFonts = ['arial', 'helvetica', 'times', 'courier', 'verdana', 'georgia', 'palatino', 'garamond', 'bookman', 'comic sans', 'trebuchet', 'impact', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];

                            let fontCount = 0;
                            let commaCount = (withoutQuotes.match(/,/g) || []).length;

                            commonFonts.forEach(font => {
                                if (new RegExp('\\b' + font + '\\b', 'i').test(withoutQuotes)) {
                                    fontCount++;
                                }
                            });

                            // If we have multiple fonts but no commas, that's likely an error
                            if (fontCount > 1 && commaCount === 0) {
                                warnings.push(`Line ${index + 1}: Multiple font names should be separated by commas (e.g., "Arial, Helvetica, sans-serif")`);
                            }
                        }
                    }
                }

                // Check for invalid !important usage
                if (trimmedLine.includes('!')) {
                    // Check for common !important typos
                    const importantTypos = [
                        { pattern: /!importnt\b/i, correct: '!important' },
                        { pattern: /!imprtant\b/i, correct: '!important' },
                        { pattern: /!imporant\b/i, correct: '!important' },
                        { pattern: /!importat\b/i, correct: '!important' },
                        { pattern: /!impotant\b/i, correct: '!important' },
                        { pattern: /!\s+important\b/i, correct: '!important' }
                    ];

                    importantTypos.forEach(typo => {
                        if (typo.pattern.test(trimmedLine)) {
                            errors.push(`Line ${index + 1}: Invalid !important syntax - did you mean "${typo.correct}"?`);
                        }
                    });

                    // Check for !important before the value (wrong position)
                    // e.g., "color: !important red;" should be "color: red !important;"
                    if (/:\s*!important\s+[^;]+/.test(trimmedLine)) {
                        errors.push(`Line ${index + 1}: !important should come after the value, not before`);
                    }
                }

                // Check for zero values with units (warning - optimization)
                if (propValueMatch) {
                    const propertyName = propValueMatch[1].toLowerCase();
                    const propertyValue = propValueMatch[2].trim();

                    // Check for 0 with units (e.g., 0px, 0em, 0%)
                    // BUT: Don't warn if inside calc() - units on zero are sometimes needed there
                    if (!propertyValue.includes('calc(')) {
                        const zeroWithUnit = propertyValue.match(/\b0(px|em|rem|%|vh|vw|vmin|vmax|pt|pc|in|cm|mm|ex|ch)\b/gi);
                        if (zeroWithUnit) {
                            zeroWithUnit.forEach(match => {
                                warnings.push(`Line ${index + 1}: Unnecessary unit on zero value "${match}" - can be simplified to "0"`);
                            });
                        }
                    }

                    // Check for negative values on properties that don't accept them
                    const noNegativeProps = {
                        'width': true,
                        'height': true,
                        'max-width': true,
                        'max-height': true,
                        'min-width': true,
                        'min-height': true,
                        'padding': true,
                        'padding-top': true,
                        'padding-right': true,
                        'padding-bottom': true,
                        'padding-left': true,
                        'border-width': true,
                        'border-top-width': true,
                        'border-right-width': true,
                        'border-bottom-width': true,
                        'border-left-width': true,
                        'outline-width': true,
                        'opacity': true
                    };

                    if (noNegativeProps[propertyName]) {
                        // Check for negative values
                        if (/-\d+/.test(propertyValue)) {
                            errors.push(`Line ${index + 1}: Property "${propertyName}" does not accept negative values`);
                        }
                    }

                    // Check for invalid percentage values on properties that don't accept them
                    const noPercentageProps = {
                        'z-index': true,
                        'opacity': true,
                        'font-weight': true,
                        'border-width': true,
                        'border-top-width': true,
                        'border-right-width': true,
                        'border-bottom-width': true,
                        'border-left-width': true,
                        'outline-width': true
                    };

                    if (noPercentageProps[propertyName]) {
                        if (/\d+%/.test(propertyValue)) {
                            errors.push(`Line ${index + 1}: Property "${propertyName}" does not accept percentage values`);
                        }
                    }

                    // Check for invalid shorthand property values
                    // Border shorthand: should be width style color (not color width style)
                    if (propertyName === 'border' || propertyName.startsWith('border-') && propertyName.match(/^border-(top|right|bottom|left)$/)) {
                        // Common mistake: putting color first
                        // e.g., "border: red 1px solid" instead of "border: 1px solid red"
                        // Valid border styles to exclude: none, hidden, dotted, dashed, solid, double, groove, ridge, inset, outset
                        const validBorderStyles = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit', 'unset'];

                        // Check if it starts with a color (hex or named color) followed by a number
                        const startsWithColor = /^(#[0-9a-f]{3,8}|rgb|rgba)\s+\d+/i.test(propertyValue);

                        // Check for named colors followed by numbers (but exclude border styles)
                        const words = propertyValue.split(/\s+/);
                        if (words.length >= 2 && !validBorderStyles.includes(words[0].toLowerCase())) {
                            const firstIsColor = /^[a-z]+$/i.test(words[0]) && /^\d+/.test(words[1]);
                            // Additional check: make sure it's not something like "0 solid"
                            if (firstIsColor && !/^\d+$/.test(words[0])) {
                                warnings.push(`Line ${index + 1}: Border shorthand typically follows order: width style color (e.g., "1px solid red" not "red 1px solid")`);
                            }
                        }

                        if (startsWithColor) {
                            warnings.push(`Line ${index + 1}: Border shorthand typically follows order: width style color (e.g., "1px solid red" not "red 1px solid")`);
                        }
                    }

                    // Margin/Padding shorthand: check for too many values
                    if (['margin', 'padding'].includes(propertyName)) {
                        const values = propertyValue.split(/\s+/).filter(v => v && !v.includes('!important'));
                        if (values.length > 4) {
                            errors.push(`Line ${index + 1}: "${propertyName}" shorthand accepts maximum 4 values, got ${values.length}`);
                        }
                    }

                    // Background shorthand: check for invalid order/values
                    if (propertyName === 'background') {
                        // Check for position values without size (e.g., "top" without "center" or coordinate)
                        const positionKeywords = ['top', 'bottom', 'left', 'right'];
                        const hasPositionKeyword = positionKeywords.some(kw =>
                            new RegExp('\\b' + kw + '\\b', 'i').test(propertyValue)
                        );

                        // If has position keyword, should have proper format
                        if (hasPositionKeyword) {
                            // This is complex to validate fully, so just check for obvious mistakes
                            const soloPosition = /^(top|bottom|left|right)$/i.test(propertyValue.trim());
                            if (soloPosition) {
                                warnings.push(`Line ${index + 1}: Background position keyword should typically be paired (e.g., "center top" not just "top")`);
                            }
                        }
                    }

                    // === GROUP 4: ADVANCED CSS FEATURES ===

                    // Check for invalid Grid/Flexbox values
                    const gridFlexProps = {
                        'display': {
                            gridFlexValues: ['flex', 'inline-flex', 'grid', 'inline-grid']
                        },
                        'justify-content': {
                            validValues: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'start', 'end', 'left', 'right', 'stretch', 'inherit', 'initial', 'unset']
                        },
                        'align-items': {
                            validValues: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch', 'start', 'end', 'self-start', 'self-end', 'inherit', 'initial', 'unset']
                        },
                        'align-content': {
                            validValues: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch', 'start', 'end', 'inherit', 'initial', 'unset']
                        },
                        'flex-direction': {
                            validValues: ['row', 'row-reverse', 'column', 'column-reverse', 'inherit', 'initial', 'unset']
                        },
                        'flex-wrap': {
                            validValues: ['nowrap', 'wrap', 'wrap-reverse', 'inherit', 'initial', 'unset']
                        },
                        'grid-template-columns': {
                            checkFrUnit: true
                        },
                        'grid-template-rows': {
                            checkFrUnit: true
                        }
                    };

                    if (gridFlexProps[propertyName]) {
                        const rule = gridFlexProps[propertyName];
                        const cleanValue = propertyValue.replace(/!important/i, '').trim().toLowerCase();

                        if (rule.validValues) {
                            if (!rule.validValues.includes(cleanValue) && !cleanValue.includes('var(')) {
                                errors.push(`Line ${index + 1}: Invalid value "${cleanValue}" for "${propertyName}" - must be one of: ${rule.validValues.slice(0, 5).join(', ')}...`);
                            }
                        }

                        if (rule.checkFrUnit) {
                            // Check for common typo: "pr" instead of "fr"
                            if (/\d+pr\b/i.test(propertyValue)) {
                                errors.push(`Line ${index + 1}: Invalid unit "pr" in grid template - did you mean "fr" (fractional unit)?`);
                            }
                        }
                    }

                    // Check for invalid gradient syntax
                    if (propertyName === 'background' || propertyName === 'background-image') {
                        // Check linear-gradient - handle nested parentheses properly
                        const linearGradientMatch = propertyValue.match(/linear-gradient\(((?:[^()]+|\([^()]*\))*)\)/i);
                        if (linearGradientMatch) {
                            const gradientContent = linearGradientMatch[1];

                            // Must have at least 2 colors
                            const commaCount = (gradientContent.match(/,/g) || []).length;
                            if (commaCount < 1) {
                                errors.push(`Line ${index + 1}: linear-gradient requires at least 2 colors separated by commas`);
                            }

                            // Special case: direction with only one color after comma
                            if (/^(to |deg|grad|rad|turn)/i.test(gradientContent.trim())) {
                                // Has direction, so should have at least 2 commas (direction, color1, color2)
                                if (commaCount < 2) {
                                    errors.push(`Line ${index + 1}: linear-gradient with direction requires at least 2 colors after the direction`);
                                }
                            }

                            // Check for colors separated by spaces instead of commas (common mistake)
                            // Pattern: color word/hex followed by space and another color without comma
                            const hasSpaceSeparatedColors = /\b(red|blue|green|yellow|orange|purple|pink|black|white|gray|grey)\s+(red|blue|green|yellow|orange|purple|pink|black|white|gray|grey)\b/i.test(gradientContent) ||
                                                          /#[0-9a-fA-F]{3,6}\s+#[0-9a-fA-F]{3,6}/.test(gradientContent) ||
                                                          /rgb\([^)]+\)\s+rgb\([^)]+\)/.test(gradientContent) ||
                                                          /rgba\([^)]+\)\s+rgba\([^)]+\)/.test(gradientContent);

                            if (hasSpaceSeparatedColors) {
                                errors.push(`Line ${index + 1}: linear-gradient colors must be separated by commas, not spaces`);
                            }

                            // Check for missing direction separator
                            // If starts with direction keyword (to, deg, etc.), should have comma after it
                            if (/^(to |deg|grad|rad|turn)/i.test(gradientContent.trim())) {
                                const firstComma = gradientContent.indexOf(',');
                                if (firstComma === -1) {
                                    errors.push(`Line ${index + 1}: linear-gradient with direction must have comma after direction`);
                                }
                            }
                        }

                        // Check radial-gradient - handle nested parentheses properly
                        const radialGradientMatch = propertyValue.match(/radial-gradient\(((?:[^()]+|\([^()]*\))*)\)/i);
                        if (radialGradientMatch) {
                            const gradientContent = radialGradientMatch[1];

                            // Must have at least 2 colors
                            const commaCount = (gradientContent.match(/,/g) || []).length;
                            if (commaCount < 1) {
                                errors.push(`Line ${index + 1}: radial-gradient requires at least 2 colors separated by commas`);
                            }

                            // Check for space-separated colors in radial gradient too
                            const hasSpaceSeparatedColors = /\b(red|blue|green|yellow|orange|purple|pink|black|white|gray|grey)\s+(red|blue|green|yellow|orange|purple|pink|black|white|gray|grey)\b/i.test(gradientContent) ||
                                                          /#[0-9a-fA-F]{3,6}\s+#[0-9a-fA-F]{3,6}/.test(gradientContent);

                            if (hasSpaceSeparatedColors) {
                                errors.push(`Line ${index + 1}: radial-gradient colors must be separated by commas, not spaces`);
                            }
                        }
                    }

                    // Check for invalid transform functions
                    if (propertyName === 'transform') {
                        // Check for unclosed parentheses in transform functions
                        const transformFunctions = ['translate', 'translateX', 'translateY', 'translateZ', 'translate3d', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'scale3d', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'rotate3d', 'skew', 'skewX', 'skewY', 'matrix', 'matrix3d', 'perspective'];

                        transformFunctions.forEach(func => {
                            const regex = new RegExp(func + '\\(', 'i');
                            if (regex.test(propertyValue)) {
                                // Check if there's a matching closing parenthesis
                                const funcStart = propertyValue.toLowerCase().indexOf(func.toLowerCase() + '(');
                                if (funcStart !== -1) {
                                    let parenCount = 1; // Start with 1 for the opening paren
                                    let foundClose = false;
                                    // Start AFTER the function name AND the opening paren
                                    for (let i = funcStart + func.length + 1; i < propertyValue.length; i++) {
                                        if (propertyValue[i] === '(') {
                                            parenCount++;
                                        } else if (propertyValue[i] === ')') {
                                            parenCount--;
                                            if (parenCount === 0) {
                                                foundClose = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (!foundClose) {
                                        errors.push(`Line ${index + 1}: Unclosed ${func}() function in transform`);
                                    }
                                }
                            }
                        });

                        // Check for missing units in transform functions
                        if (/translate[XY]?\(\s*\d+\s*\)/i.test(propertyValue)) {
                            warnings.push(`Line ${index + 1}: translate functions typically require units (e.g., "translateX(10px)" not "translateX(10)")`);
                        }
                    }

                    // Check for invalid animation/transition syntax
                    if (propertyName === 'transition' || propertyName === 'animation') {
                        // Check if duration is missing (required for both)
                        const hasDuration = /\d+(\.\d+)?(s|ms)\b/.test(propertyValue);

                        if (!hasDuration && !propertyValue.toLowerCase().includes('none') && !propertyValue.includes('var(')) {
                            errors.push(`Line ${index + 1}: ${propertyName} requires a duration (e.g., "0.3s" or "300ms")`);
                        }

                        // Check for invalid timing functions
                        const invalidTimingFunctions = ['easy', 'ease-inn', 'ease-outt', 'liner', 'ease-in-outt'];
                        invalidTimingFunctions.forEach(invalid => {
                            if (new RegExp('\\b' + invalid + '\\b', 'i').test(propertyValue)) {
                                const correct = {
                                    'easy': 'ease',
                                    'ease-inn': 'ease-in',
                                    'ease-outt': 'ease-out',
                                    'liner': 'linear',
                                    'ease-in-outt': 'ease-in-out'
                                };
                                errors.push(`Line ${index + 1}: Invalid timing function "${invalid}" - did you mean "${correct[invalid] || 'ease'}"?`);
                            }
                        });
                    }

                    // === GROUP 5: ADVANCED FEATURES ===

                    // Check for CSS variable (custom property) issues
                    if (propertyName.startsWith('--')) {
                        // Custom property declaration - check if truly empty (not just whitespace)
                        // Need to get the raw value after the colon, including potential empty string
                        const rawMatch = trimmedLine.match(/^--[^:]+:\s*(.*)$/);
                        if (rawMatch) {
                            const rawValue = rawMatch[1].replace(/;$/, '').trim();
                            if (rawValue === '') {
                                errors.push(`Line ${index + 1}: CSS custom property "${propertyName}" has no value`);
                            }
                        }
                    }

                    // Check var() usage
                    if (propertyValue.includes('var(')) {
                        // Use regex that handles nested parentheses: ((?:[^()]+|\([^()]*\))*)
                        const varMatches = propertyValue.matchAll(/var\(((?:[^()]+|\([^()]*\))*)\)/g);
                        for (const varMatch of varMatches) {
                            const varContent = varMatch[1].trim();

                            // Check for empty var()
                            if (!varContent) {
                                errors.push(`Line ${index + 1}: Empty var() function`);
                                continue;
                            }

                            // Split by comma to get variable name and fallback
                            const parts = varContent.split(',').map(p => p.trim());
                            const varName = parts[0];

                            // Variable name must start with --
                            if (!varName.startsWith('--')) {
                                errors.push(`Line ${index + 1}: CSS variable name "${varName}" must start with "--"`);
                            }

                            // Check for invalid characters in variable name (only letters, numbers, hyphens, underscores)
                            if (!/^--[a-zA-Z0-9\-_]+$/.test(varName)) {
                                errors.push(`Line ${index + 1}: Invalid characters in CSS variable name "${varName}"`);
                            }

                            // Check for too many parts - better detection
                            // If there are nested var(), the comma count will be higher
                            // Simple approach: count commas that are NOT inside nested parentheses
                            let depth = 0;
                            let topLevelCommaCount = 0;
                            for (let char of varContent) {
                                if (char === '(') depth++;
                                if (char === ')') depth--;
                                if (char === ',' && depth === 0) topLevelCommaCount++;
                            }

                            if (topLevelCommaCount > 1) {
                                warnings.push(`Line ${index + 1}: var() function should have only variable name and optional fallback value`);
                            }
                        }
                    }

                    // Check for unnecessary or missing vendor prefixes
                    const needsPrefixCheck = {
                        'appearance': true,
                        'user-select': true,
                        'backdrop-filter': true,
                        'clip-path': true
                    };

                    if (needsPrefixCheck[propertyName]) {
                        warnings.push(`Line ${index + 1}: Property "${propertyName}" may need vendor prefixes (-webkit-, -moz-, -ms-) for older browser support`);
                    }

                    // Check for outdated vendor prefixes that are no longer needed
                    const outdatedPrefixes = {
                        '-webkit-border-radius': 'border-radius',
                        '-moz-border-radius': 'border-radius',
                        '-webkit-box-shadow': 'box-shadow',
                        '-moz-box-shadow': 'box-shadow',
                        '-webkit-transform': 'transform (check browser support)',
                        '-moz-transform': 'transform (check browser support)',
                        '-webkit-transition': 'transition (check browser support)',
                        '-moz-transition': 'transition (check browser support)',
                        '-webkit-animation': 'animation (check browser support)',
                        '-moz-animation': 'animation (check browser support)'
                    };

                    if (outdatedPrefixes[propertyName]) {
                        warnings.push(`Line ${index + 1}: Vendor prefix "${propertyName}" may be outdated - consider using standard "${outdatedPrefixes[propertyName]}"`);
                    }

                    // Advanced calc() validation - unit mixing issues
                    if (propertyValue.includes('calc(')) {
                        const calcMatches = propertyValue.matchAll(/calc\(([^)]+)\)/g);
                        for (const calcMatch of calcMatches) {
                            const calcContent = calcMatch[1];

                            // Check for mixing incompatible units in multiplication/division
                            // e.g., calc(10px * 20px) is invalid - one must be unitless
                            // BUT: calc(100% * 50%) should only warn, not error (it's technically valid)
                            const multiplyDivide = /(\d+\.?\d*)([a-z%]+)\s*[*\/]\s*(\d+\.?\d*)([a-z%]+)/i;
                            if (multiplyDivide.test(calcContent)) {
                                const match = calcContent.match(multiplyDivide);
                                if (match) {
                                    const unit1 = match[2];
                                    const unit2 = match[4];

                                    // If both are percentages, it's technically valid but warn (handled separately)
                                    // Otherwise, it's an error
                                    if (!(unit1 === '%' && unit2 === '%')) {
                                        errors.push(`Line ${index + 1}: calc() multiplication/division requires one unitless value, got "${match[1]}${unit1}" and "${match[3]}${unit2}"`);
                                    }
                                }
                            }

                            // Check for percentage in multiplication/division with another percentage
                            // Only warn if BOTH are percentages, not just one
                            // Valid: calc(100% * 0.5), calc(100% / 3)
                            // Invalid/Warning: calc(100% * 50%)
                            if (/\d+%\s*[*\/]\s*\d+%/.test(calcContent)) {
                                warnings.push(`Line ${index + 1}: calc() with percentage in multiplication/division - use decimal instead (e.g., 0.5 instead of 50%)`);
                            }

                            // Check for invalid unit mixing in addition/subtraction
                            const addSubtract = /(\d+\.?\d*)(px|em|rem|%|vh|vw|vmin|vmax|pt|cm|mm|in)\s*[\+\-]\s*(\d+\.?\d*)(px|em|rem|%|vh|vw|vmin|vmax|pt|cm|mm|in)/i;
                            const addMatch = calcContent.match(addSubtract);
                            if (addMatch) {
                                const unit1 = addMatch[2];
                                const unit4 = addMatch[4];

                                // Check if units are from incompatible categories
                                const lengthUnits = ['px', 'em', 'rem', 'pt', 'cm', 'mm', 'in'];
                                const viewportUnits = ['vh', 'vw', 'vmin', 'vmax'];
                                const percentUnits = ['%'];

                                const unit1IsLength = lengthUnits.includes(unit1);
                                const unit4IsLength = lengthUnits.includes(unit4);
                                const unit1IsViewport = viewportUnits.includes(unit1);
                                const unit4IsViewport = viewportUnits.includes(unit4);
                                const unit1IsPercent = percentUnits.includes(unit1);
                                const unit4IsPercent = percentUnits.includes(unit4);

                                // Warn for viewport + percent mixing (uncommon pattern)
                                if ((unit1IsViewport && unit4IsPercent) || (unit1IsPercent && unit4IsViewport)) {
                                    warnings.push(`Line ${index + 1}: calc() mixing different unit types (${unit1} and ${unit4}) - verify this is intended`);
                                }

                                // Don't warn for length + percent or length + viewport - these are very common and valid
                                // calc(100% - 20px) is extremely common
                                // calc(100vh - 10px) is very common
                            }
                        }
                    }

                    // === GROUP 6: MEDIA QUERIES & AT-RULES ===

                    // This section handles validation of CSS at-rules (@media, @keyframes, @import, @font-face, etc.)
                    // Note: These are typically full-line or multi-line declarations, so we check the trimmed line

                }
            }

            // Check for @media query validation (after property checks since these are line-level)
            if (trimmedLine.startsWith('@media')) {
                // Extract media query
                const mediaQuery = trimmedLine.match(/@media\s+(.+?)\s*\{?$/);
                if (mediaQuery) {
                    const query = mediaQuery[1].trim();

                    // Check for common typos in media types
                    const invalidMediaTypes = /\b(scren|screan|screeen|prit|printt)\b/i;
                    if (invalidMediaTypes.test(query)) {
                        errors.push(`Line ${index + 1}: Invalid media type - check spelling (screen, print, etc.)`);
                    }

                    // Check for missing 'and' between conditions
                    if (/\([^)]+\)\s+\([^)]+\)/.test(query) && !query.includes(' and ')) {
                        errors.push(`Line ${index + 1}: Multiple media conditions must be joined with "and"`);
                    }

                    // Check for invalid property names in media queries
                    const commonProps = ['min-width', 'max-width', 'min-height', 'max-height', 'orientation', 'aspect-ratio', 'min-resolution', 'max-resolution'];
                    const propMatch = query.match(/\(([a-z\-]+):/i);
                    if (propMatch) {
                        const prop = propMatch[1];
                        // Check for common typos
                        if (prop === 'width' || prop === 'height') {
                            warnings.push(`Line ${index + 1}: Use "min-width" or "max-width" instead of "${prop}" in media queries`);
                        }
                        // Check for invalid properties
                        if (prop.includes('_') || /[A-Z]/.test(prop)) {
                            errors.push(`Line ${index + 1}: Invalid media feature "${prop}" - use lowercase with hyphens`);
                        }
                    }

                    // Check for missing units in width/height queries
                    if (/\((?:min-|max-)?(?:width|height):\s*\d+\s*\)/.test(query)) {
                        errors.push(`Line ${index + 1}: Media query width/height values require units (e.g., 768px, not 768)`);
                    }

                    // Check for invalid comparison operators (people sometimes use =, <, >)
                    if (/:\s*[<>=]/.test(query)) {
                        errors.push(`Line ${index + 1}: Media queries use "min-" and "max-" prefixes, not comparison operators`);
                    }
                }
            }

            // Check for @keyframes validation
            if (trimmedLine.startsWith('@keyframes') || trimmedLine.startsWith('@-webkit-keyframes') || trimmedLine.startsWith('@-moz-keyframes')) {
                const keyframesMatch = trimmedLine.match(/@(?:-webkit-|-moz-)?keyframes\s+([^\s{]+)/);
                if (keyframesMatch) {
                    const animationName = keyframesMatch[1];

                    // Check for invalid animation names
                    if (/^\d/.test(animationName)) {
                        errors.push(`Line ${index + 1}: Animation name "${animationName}" cannot start with a number`);
                    }

                    if (/\s/.test(animationName)) {
                        errors.push(`Line ${index + 1}: Animation name "${animationName}" cannot contain spaces`);
                    }

                    // Warn about vendor-prefixed keyframes
                    if (trimmedLine.startsWith('@-webkit-keyframes') || trimmedLine.startsWith('@-moz-keyframes')) {
                        warnings.push(`Line ${index + 1}: Vendor-prefixed @keyframes may be unnecessary in modern browsers`);
                    }
                } else if (trimmedLine === '@keyframes' || trimmedLine === '@keyframes ') {
                    errors.push(`Line ${index + 1}: @keyframes requires an animation name`);
                }
            }

            // Check for keyframe percentage selectors (0%, 50%, 100%, from, to)
            if (trimmedLine.match(/^\d+%\s*\{?$/) || trimmedLine === 'from {' || trimmedLine === 'to {') {
                // Valid keyframe selector - no validation needed
            } else if (/^(\d+)%/.test(trimmedLine) && !trimmedLine.includes(':')) {
                // Check for invalid percentage format
                const percentMatch = trimmedLine.match(/^(\d+)%/);
                if (percentMatch) {
                    const percent = parseInt(percentMatch[1]);
                    if (percent > 100) {
                        errors.push(`Line ${index + 1}: Keyframe percentage "${percent}%" cannot exceed 100%`);
                    }
                }
            }

            // Check for @import validation
            if (trimmedLine.startsWith('@import')) {
                // @import should be at the beginning of the stylesheet
                if (index > 5) {
                    warnings.push(`Line ${index + 1}: @import should be placed at the beginning of the stylesheet`);
                }

                // Check for missing url() or quotes
                if (!trimmedLine.includes('url(') && !trimmedLine.includes('"') && !trimmedLine.includes("'")) {
                    errors.push(`Line ${index + 1}: @import requires url() or quoted string`);
                }

                // Check for missing semicolon
                if (!trimmedLine.endsWith(';')) {
                    errors.push(`Line ${index + 1}: @import statement missing semicolon`);
                }
            }

            // Check for @font-face validation
            if (trimmedLine.startsWith('@font-face')) {
                // Track if we're entering a font-face block (simple check)
                // Note: Full validation would require state tracking across multiple lines
                if (!trimmedLine.includes('{')) {
                    warnings.push(`Line ${index + 1}: @font-face should be followed by an opening brace`);
                }
            }

            // Check for @supports validation
            if (trimmedLine.startsWith('@supports')) {
                const supportsMatch = trimmedLine.match(/@supports\s+(.+?)\s*\{?$/);
                if (supportsMatch) {
                    const condition = supportsMatch[1].trim();

                    // Check for missing parentheses
                    if (!condition.includes('(') || !condition.includes(')')) {
                        errors.push(`Line ${index + 1}: @supports condition must be wrapped in parentheses`);
                    }

                    // Check for missing property:value format
                    if (condition.includes('(') && !condition.includes(':')) {
                        errors.push(`Line ${index + 1}: @supports condition requires property:value format`);
                    }
                }
            }

            // Check for invalid at-rules (common typos)
            const invalidAtRules = /@(midea|meida|keframes|keyframe|inport|imoprt|charst|font-fce)/i;
            if (invalidAtRules.test(trimmedLine)) {
                const match = trimmedLine.match(invalidAtRules);
                if (match) {
                    const typo = match[1];
                    const corrections = {
                        'midea': '@media',
                        'meida': '@media',
                        'keframes': '@keyframes',
                        'keyframe': '@keyframes',
                        'inport': '@import',
                        'imoprt': '@import',
                        'charst': '@charset',
                        'font-fce': '@font-face'
                    };
                    errors.push(`Line ${index + 1}: Invalid at-rule "@${typo}" - did you mean "${corrections[typo.toLowerCase()]}"?`);
                }
            }

            // Check for properties without semicolons (unless it's the last property before })
            if (line.includes(':') && !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}') && line.trim() !== '' && !line.trim().startsWith('@')) {
                const nextLine = lines[index + 1];
                if (nextLine && !nextLine.trim().startsWith('}')) {
                    warnings.push(`Line ${index + 1}: Missing semicolon`);
                }
            }
        });
        return {
            isValid: errors.length === 0,
            hasWarnings: warnings.length > 0,
            errors,
            warnings
        };

// Export function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateCSS };
}
