// ==================== EDITOR INITIALIZATION MODULE ====================
// This module handles the initialization and setup of the CSS editor for textareas
// Lines 1806-1963 from original css-editor.js

/**
 * Initializes the CSS editor for a textarea element
 * Creates the editor structure with:
 * - Wrapper (colored border for validation status)
 * - Container (holds line numbers and editor)
 * - Line numbers column
 * - Content area (backdrop + textarea overlay)
 * - Validation indicator bar
 *
 * @param {HTMLTextAreaElement} textarea - The textarea to enhance
 * @param {Object} dependencies - Required functions from other modules
 *   - dependencies.getSkinId
 *   - dependencies.replaceSkinNumbers
 *   - dependencies.highlightCSS
 *   - dependencies.updateLineNumbers
 *   - dependencies.validateCSS
 */
function initializeEditor(textarea, dependencies) {
    // Check if already initialized
    if (textarea.parentElement && textarea.parentElement.classList.contains('css-editor-content')) {
        console.log('[CivicPlus CSS Editor] Editor already initialized for textarea #' + textarea.id + ', skipping...');
        return;
    }

    console.log('[CivicPlus CSS Editor] Initializing CSS editor for textarea #' + textarea.id + '...');

    const skinId = dependencies.getSkinId();
    const maxLength = parseInt(textarea.getAttribute('maxlength')) || 1000;
    console.log('[CivicPlus CSS Editor] Skin ID: ' + skinId + ', Max Length: ' + maxLength);

    // Auto-replace initial skin numbers
    if (skinId && skinId !== '-1') {
        const initialText = textarea.value;
        const replacedText = dependencies.replaceSkinNumbers(initialText, skinId);
        if (initialText !== replacedText) {
            textarea.value = replacedText;
            console.log('[CivicPlus CSS Editor] Replaced initial .skin numbers with .skin' + skinId);
        }
    }

    // Set textarea attributes
    textarea.setAttribute('spellcheck', 'false');
    textarea.setAttribute('autocomplete', 'off');
    textarea.setAttribute('autocorrect', 'off');
    textarea.setAttribute('autocapitalize', 'off');

    // Create editor structure
    const wrapper = document.createElement('div');
    wrapper.className = 'css-editor-wrapper valid';
    const container = document.createElement('div');
    container.className = 'css-editor-container';
    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'css-line-numbers';
    const contentArea = document.createElement('div');
    contentArea.className = 'css-editor-content';
    const backdrop = document.createElement('div');
    backdrop.className = 'css-editor-backdrop';

    // Insert into DOM
    textarea.parentNode.insertBefore(wrapper, textarea);
    contentArea.appendChild(backdrop);
    contentArea.appendChild(textarea);
    container.appendChild(lineNumbers);
    container.appendChild(contentArea);
    wrapper.appendChild(container);

    // Create validation indicator
    const validationIndicator = document.createElement('div');
    validationIndicator.className = 'css-validation-indicator valid';
    validationIndicator.innerHTML = `
        <div class="css-validation-status">
            <span class="status-icon"></span>
            <span class="status-text">Valid CSS</span>
        </div>
        <div class="css-char-counter"><span class="current">0</span>/<span class="max">${maxLength}</span></div>
    `;
    wrapper.appendChild(validationIndicator);

    textarea.classList.add('css-editor-textarea');
    backdrop.innerHTML = dependencies.highlightCSS(textarea.value);

    // Update line numbers after rendering
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            dependencies.updateLineNumbers(textarea, lineNumbers, backdrop);
        });
    });

    const charCounter = validationIndicator.querySelector('.css-char-counter');
    const currentChars = charCounter.querySelector('.current');

    /**
     * Updates the character counter display and styling
     * @param {number} length - Current character count
     */
    function updateCharCounter(length) {
        currentChars.textContent = length;
        charCounter.classList.remove('warning', 'error');

        if (length >= maxLength) {
            charCounter.classList.add('error');
        } else if (length >= maxLength * 0.9) {
            charCounter.classList.add('warning');
        }
    }

    /**
     * Synchronizes the editor display with textarea content
     * - Enforces character limit
     * - Replaces skin numbers
     * - Updates syntax highlighting
     * - Updates line numbers
     * - Validates CSS
     */
    function syncEditor() {
        let code = textarea.value;

        // Enforce character limit
        if (code.length > maxLength) {
            code = code.substring(0, maxLength);
            textarea.value = code;
        }

        // Auto-replace skin numbers
        if (skinId && skinId !== '-1') {
            const beforeReplace = code;
            code = dependencies.replaceSkinNumbers(code, skinId);
            if (beforeReplace !== code) {
                const cursorPos = textarea.selectionStart;
                textarea.value = code;
                const lengthDiff = code.length - beforeReplace.length;
                textarea.selectionStart = textarea.selectionEnd = cursorPos + lengthDiff;
                console.log('[CivicPlus CSS Editor] Auto-replaced .skin numbers with .skin' + skinId);
            }
        }

        // Update syntax highlighting
        backdrop.innerHTML = dependencies.highlightCSS(code);

        // Update line numbers
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                dependencies.updateLineNumbers(textarea, lineNumbers, backdrop);
            });
        });

        // Update character counter
        updateCharCounter(code.length);

        // Validate CSS
        const validation = dependencies.validateCSS(code);
        wrapper.classList.remove('valid', 'invalid', 'warning');
        validationIndicator.classList.remove('valid', 'invalid', 'warning');

        if (!validation.isValid) {
            wrapper.classList.add('invalid');
            validationIndicator.classList.add('invalid');
            validationIndicator.querySelector('.status-text').textContent = validation.errors[0];
        } else if (validation.hasWarnings) {
            wrapper.classList.add('warning');
            validationIndicator.classList.add('warning');
            validationIndicator.querySelector('.status-text').textContent = validation.warnings[0];
        } else {
            wrapper.classList.add('valid');
            validationIndicator.classList.add('valid');
            validationIndicator.querySelector('.status-text').textContent = 'Valid CSS';
        }
    }

    /**
     * Synchronizes scroll position between textarea and backdrop/line numbers
     */
    function syncScroll() {
        backdrop.scrollTop = contentArea.scrollTop;
        backdrop.scrollLeft = contentArea.scrollLeft;
        lineNumbers.scrollTop = contentArea.scrollTop;
    }

    // Initialize character counter
    updateCharCounter(textarea.value.length);

    // Event listeners
    textarea.addEventListener('input', syncEditor);
    textarea.addEventListener('change', () => {
        if (skinId === '-1' && /\.skin\d+/.test(textarea.value)) {
            alert('You used a skin number. Save the skin first to get a number.');
        }
    });

    contentArea.addEventListener('scroll', syncScroll);

    // Tab key handler (insert 2 spaces instead of tabbing away)
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            textarea.value = value.substring(0, start) + '  ' + value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 2;
            textarea.dispatchEvent(new Event('input'));
        }
    });

    console.log('[CivicPlus CSS Editor] CSS editor initialized successfully for #' + textarea.id + '!');
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeEditor };
}
