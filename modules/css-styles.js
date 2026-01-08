// ==================== CSS STYLES INJECTION MODULE ====================
// This module handles the injection of CSS styles for the editor interface
// Lines 41-223 from original css-editor.js

/**
 * Injects all CSS styles needed for the editor into the document head
 * Includes styles for:
 * - Editor wrapper and container
 * - Line numbers
 * - Syntax highlighting colors (VS Code Light theme)
 * - Validation indicators
 * - Character counter
 * - Color preview boxes
 */
function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .css-editor-wrapper {
            position: relative;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
            border-radius: 4px;
            overflow: hidden;
            background: #ffffff;
            border: 2px solid #e0e0e0;
            transition: border-color 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .css-editor-wrapper.valid { border-color: #4ec9b0; }
        .css-editor-wrapper.invalid { border-color: #e51400; }
        .css-editor-wrapper.warning { border-color: #bf8803; }
        .css-editor-container {
            display: flex;
            position: relative;
            min-height: 200px;
            flex: 1;
            overflow: hidden;
        }
        .css-line-numbers {
            padding: 10px 5px;
            background: #f3f3f3;
            color: #237893;
            text-align: right;
            user-select: none;
            border-right: 1px solid #e0e0e0;
            min-width: 20px;
            overflow: hidden;
            font-family: monospace !important;
            font-size: 13px !important;
            line-height: 19.5px !important;
        }
        .css-line-numbers div {
            line-height: 19.5px !important;
            height: 19.5px !important;
        }
        .css-line-numbers .wrapped-line {
            color: #999999;
        }
        .css-editor-content {
            flex: 1;
            position: relative;
            overflow: auto;
            background: #ffffff;
        }
        .css-editor-backdrop {
            position: relative;
            padding: 10px;
            color: #000000;
            white-space: pre-wrap;
            word-wrap: break-word;
            pointer-events: none;
            overflow-wrap: break-word;
            min-height: 100%;
            font-family: monospace !important;
            font-size: 13px !important;
            line-height: 19.5px !important;
            letter-spacing: normal !important;
            word-spacing: normal !important;
            text-transform: none !important;
            text-indent: 0 !important;
            text-shadow: none !important;
            text-rendering: auto !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }
        .css-editor-textarea {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100% !important;
            height: 100% !important;
            padding: 10px !important;
            margin: 0 !important;
            background: transparent !important;
            color: transparent !important;
            caret-color: #000000 !important;
            border: none !important;
            outline: none !important;
            resize: none !important;
            font-family: monospace !important;
            font-size: 13px !important;
            line-height: 19.5px !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            overflow: hidden !important;
            z-index: 2;
            -webkit-text-fill-color: transparent !important;
            spellcheck: false !important;
            letter-spacing: normal !important;
            word-spacing: normal !important;
            text-transform: none !important;
            text-indent: 0 !important;
            text-shadow: none !important;
            text-rendering: auto !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            font-weight: normal !important;
            font-style: normal !important;
            font-variant: normal !important;
        }
        .css-editor-textarea::selection {
            background: rgba(173, 214, 255, 0.5) !important;
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
        }
        .css-editor-textarea::-moz-selection {
            background: rgba(173, 214, 255, 0.5) !important;
            color: transparent !important;
        }
        /* VS Code Light Theme Colors */
        .css-property { color: #0451a5; }
        .css-value { color: #a31515; }
        .css-number { color: #098658; }
        .css-unit { color: #098658; }
        .css-color { color: #a31515; }
        .css-important { color: #af00db; font-weight: bold; }
        .css-comment { color: #008000; font-style: italic; }
        .css-selector { color: #0000ff; }
        .css-bracket { color: #0000ff; font-weight: bold; }
        .css-semicolon { color: #000000; }
        .css-colon { color: #000000; }
        .css-string { color: #a31515; }
        .css-skin-class { color: #267f99; font-weight: bold; }
        .css-validation-indicator {
            padding: 5px 10px;
            background: #f3f3f3;
            border-top: 1px solid #e0e0e0;
            color: #000000;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }
        .css-validation-status {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .css-char-counter {
            font-size: 11px;
            color: #616161;
        }
        .css-char-counter.warning {
            color: #bf8803;
        }
        .css-char-counter.error {
            color: #e51400;
            font-weight: bold;
        }
        .css-validation-indicator .status-icon {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        .css-validation-indicator.valid .status-icon { background: #4ec9b0; }
        .css-validation-indicator.invalid .status-icon { background: #e51400; }
        .css-validation-indicator.warning .status-icon { background: #bf8803; }
        .css-color-preview {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1px solid #cccccc;
            border-radius: 2px;
            margin: 0 4px;
            vertical-align: middle;
        }

    `;
    document.head.appendChild(style);
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { injectStyles };
}
