# 📦 CSS Editor Modular Structure

This document explains the modularized structure of the CivicPlus CSS Editor codebase. The original `css-editor.js` (2057 lines) has been broken down into focused, maintainable modules.

## 🗂️ File Structure

```
css-editor/
├── css-editor.js                  # Original monolithic file (2057 lines)
├── modules/
│   ├── site-detection.js          # CivicPlus site detection
│   ├── css-styles.js              # CSS injection for editor UI
│   ├── syntax-highlighter.js      # CSS syntax highlighting
│   ├── line-numbers.js            # Line number generation
│   ├── validation-complete.js     # ⭐ FULL validation (1473 lines) - USE THIS
│   ├── validation.js              # Stub file (only basic checks)
│   ├── validation/
│   │   ├── syntax.js              # Basic syntax validation (partial)
│   │   └── typos.js               # Typo dictionaries (complete)
│   ├── skin-replacement.js        # .skinX class replacement
│   ├── editor-initialization.js   # Editor setup and lifecycle
│   ├── text-limits.js             # Character limit enforcement
│   ├── textarea-finder.js         # Textarea discovery
│   ├── mutation-observer.js       # DOM change observer
│   └── main.js                    # Main initialization orchestrator
├── color-preview-test.html        # Color preview test suite
├── COLOR-TEST-README.md           # Test suite documentation
└── MODULES-README.md              # This file
```

## 📋 Module Breakdown

### 1. **site-detection.js** (Lines 18-38)
**Purpose:** Detects if the current site is a CivicPlus website

**Functions:**
- `isCivicPlusSite()` - Async function that checks for CivicPlus resources
- `pageMatches(patterns)` - Checks if URL matches given patterns

**Dependencies:** None

**Usage:**
```javascript
const isCivicPlus = await isCivicPlusSite();
if (isCivicPlus) {
    // Initialize editor
}
```

---

### 2. **css-styles.js** (Lines 41-223)
**Purpose:** Injects CSS styles for the editor interface

**Functions:**
- `injectStyles()` - Injects all necessary CSS into `<head>`

**Styles Include:**
- Editor wrapper and container layout
- Line numbers column styling
- Syntax highlighting colors (VS Code Light theme)
- Validation indicator styling
- Color preview boxes
- Character counter

**Dependencies:** None

**Usage:**
```javascript
injectStyles(); // Call once during initialization
```

---

### 3. **syntax-highlighter.js** (Lines 226-301)
**Purpose:** Provides CSS syntax highlighting with color previews

**Functions:**
- `highlightCSS(code)` - Returns HTML string with syntax highlighting

**Features:**
- Comments: Green, italic
- Strings: Red
- Properties: Blue
- Values: Red
- Numbers/units: Green
- Hex colors: Red with inline preview box
- RGB/RGBA: Red with inline preview box
- !important: Purple, bold
- Brackets: Blue, bold

**Dependencies:** None

**Usage:**
```javascript
const highlightedHTML = highlightCSS('.class { color: #ff0000; }');
backdrop.innerHTML = highlightedHTML;
```

---

### 4. **line-numbers.js** (Lines 303-338)
**Purpose:** Generates line numbers that sync with wrapped lines

**Functions:**
- `updateLineNumbers(textarea, lineNumbersDiv, backdrop)` - Updates line number display

**Features:**
- Handles wrapped lines (shows grayed placeholders)
- Calculates visual vs logical lines
- Auto-adjusts for different line heights

**Dependencies:** Requires DOM elements from editor-initialization

**Usage:**
```javascript
updateLineNumbers(textarea, lineNumbersDiv, backdrop);
```

---

### 5. **validation-complete.js** (Lines 340-1791)
**Purpose:** Complete CSS validation module with ALL 100+ validation checks (1473 lines)

**⚠️ STATUS:** This is the **FULL, WORKING** validation module extracted from the original css-editor.js

**Files:**
- `validation-complete.js` - Complete validation logic (USE THIS ONE)
- `validation.js` - Stub file (only has basic validation)
- `validation/syntax.js` - Modular syntax validation (partial implementation)
- `validation/typos.js` - Typo dictionaries (complete)

**Functions:**
- `validateCSS(code)` - Returns validation results

**Return Object:**
```javascript
{
    isValid: boolean,
    hasWarnings: boolean,
    errors: string[],
    warnings: string[]
}
```

**Validation Categories (100+ checks):**
1. **Syntax Errors:** Brackets, comments, strings, semicolons
2. **Property Typos:** 35+ common typos (e.g., `bordr` → `border`)
3. **Value Validation:** Type checking for each property
4. **Color Validation:** Hex, RGB, RGBA, color names
5. **Unit Validation:** px, em, rem, %, etc.
6. **Function Validation:** calc(), url(), var()
7. **Advanced CSS:** Grid, Flexbox, transforms, gradients
8. **At-Rules:** @media, @keyframes, @import, @font-face
9. **Important Validation:** !important typos
10. **Vendor Prefixes:** Outdated and needed prefixes
11. **Shorthand Properties:** border, margin, padding, background
12. **CSS Variables:** Custom property validation
13. **Gradients:** linear-gradient, radial-gradient
14. **Animations & Transitions:** Timing functions, durations
15. **And 85+ more validation rules!**

**🔧 Future Modularization:**
This module CAN be split into smaller modules:
- `validation/syntax.js` - Basic syntax checks (STARTED)
- `validation/properties.js` - Property validation
- `validation/colors.js` - Color validation
- `validation/functions.js` - CSS functions
- `validation/advanced.js` - Grid, Flexbox, animations
- `validation/at-rules.js` - @media, @keyframes, etc.

**Dependencies:**
- None (self-contained with typo dictionaries included)

**Usage:**
```javascript
const result = validateCSS('.class { color: #fff; }');
if (!result.isValid) {
    console.error('Errors:', result.errors);
}
if (result.hasWarnings) {
    console.warn('Warnings:', result.warnings);
}
```

---

### 6. **validation/typos.js** (Lines 346-436, 783-815, etc.)
**Purpose:** Dictionaries of common CSS typos

**Exports:**
- `commonPropertyTypos` - Property name typos (35+)
- `commonColorTypos` - Color name typos (28+)
- `commonUnitTypos` - Unit typos (7+)
- `commonSplitProperties` - Space-separated properties
- `importantTypos` - !important typos

**Dependencies:** None

**Usage:**
```javascript
if (commonPropertyTypos[propertyName]) {
    const correction = commonPropertyTypos[propertyName];
    errors.push(`Did you mean "${correction}"?`);
}
```

---

### 7. **skin-replacement.js** (Lines 1793-1802)
**Purpose:** Automatically replaces .skinX class numbers

**Functions:**
- `getSkinId()` - Gets skin ID from hidden field
- `replaceSkinNumbers(text, skinId)` - Replaces .skinX with .skinY

**Dependencies:** Requires `#hdnSkinID` element in DOM

**Usage:**
```javascript
const skinId = getSkinId();
const updatedCSS = replaceSkinNumbers('.skin123 { }', skinId);
// Result: '.skin456 { }' (if skinId is 456)
```

---

### 8. **editor-initialization.js** (Lines 1806-1963)
**Purpose:** Initializes and manages the editor lifecycle

**Functions:**
- `initializeEditor(textarea, dependencies)` - Main initialization function

**Creates:**
- Wrapper with validation border color
- Container with line numbers and editor
- Backdrop with syntax highlighting
- Transparent textarea overlay
- Validation indicator bar
- Character counter

**Event Handlers:**
- `input` - Syncs highlighting, validates, updates line numbers
- `scroll` - Syncs scroll position
- `keydown` - Tab key inserts 2 spaces
- `change` - Warns about unsaved skin numbers

**Dependencies:**
```javascript
{
    getSkinId,
    replaceSkinNumbers,
    highlightCSS,
    updateLineNumbers,
    validateCSS
}
```

**Usage:**
```javascript
initializeEditor(textarea, {
    getSkinId,
    replaceSkinNumbers,
    highlightCSS,
    updateLineNumbers,
    validateCSS
});
```

---

### 9. **text-limits.js** (Lines 1966-2007)
**Purpose:** Enforces character limits on textareas

**Functions:**
- `enforceTextLimits(pageMatches)` - Injects limit enforcement code

**Limits:**
- Theme Manager: 1000 characters
- Widget Manager: 255 characters

**Method:** Hooks into CivicPlus functions:
- `window.initializePopovers` (Theme Manager)
- `window.InitializeWidgetOptionsModal` (Widget Manager)

**Dependencies:**
- `pageMatches` function

**Usage:**
```javascript
enforceTextLimits(pageMatches);
```

---

### 10. **textarea-finder.js** (Lines 2010-2023)
**Purpose:** Finds and enhances CSS textareas

**Functions:**
- `findAndEnhanceTextareas(initializeEditor)` - Finds and enhances textareas

**Selector:** `textarea[id*="MiscellaneousStyles"]`

**Dependencies:**
- `initializeEditor` function

**Usage:**
```javascript
findAndEnhanceTextareas((textarea) => {
    initializeEditor(textarea, dependencies);
});
```

---

### 11. **mutation-observer.js** (Lines 2027-2036)
**Purpose:** Watches DOM for new textareas (modals, dynamic content)

**Functions:**
- `startObserving(findAndEnhanceTextareas)` - Starts MutationObserver

**Observes:**
- `childList: true` - Watches for added/removed elements
- `subtree: true` - Watches entire DOM tree

**Dependencies:**
- `findAndEnhanceTextareas` function

**Usage:**
```javascript
startObserving(() => {
    findAndEnhanceTextareas(initializeEditor);
});
```

---

### 12. **main.js** (Lines 2039-2057)
**Purpose:** Main orchestrator that ties all modules together

**Functions:**
- `initialize(modules)` - Main async initialization
- `bootstrap(modules)` - Starts initialization when DOM ready

**Initialization Flow:**
1. Check if CivicPlus site
2. Inject CSS styles
3. Enforce text limits
4. Start observing for textareas

**Dependencies:** All other modules

**Usage:**
```javascript
bootstrap({
    isCivicPlusSite,
    injectStyles,
    enforceTextLimits,
    pageMatches,
    startObserving,
    findAndEnhanceTextareas,
    initializeEditor: (textarea) => {
        initializeEditor(textarea, {
            getSkinId,
            replaceSkinNumbers,
            highlightCSS,
            updateLineNumbers,
            validateCSS
        });
    }
});
```

---

## 🔧 How to Use the Modules

### Option 1: As Separate Script Tags (Browser)

```html
<script src="modules/site-detection.js"></script>
<script src="modules/css-styles.js"></script>
<script src="modules/syntax-highlighter.js"></script>
<script src="modules/line-numbers.js"></script>
<script src="modules/validation/typos.js"></script>
<script src="modules/validation.js"></script>
<script src="modules/skin-replacement.js"></script>
<script src="modules/editor-initialization.js"></script>
<script src="modules/text-limits.js"></script>
<script src="modules/textarea-finder.js"></script>
<script src="modules/mutation-observer.js"></script>
<script src="modules/main.js"></script>

<script>
// Initialize with all modules
bootstrap({
    isCivicPlusSite,
    injectStyles,
    enforceTextLimits,
    pageMatches,
    startObserving,
    findAndEnhanceTextareas,
    initializeEditor: (textarea) => {
        initializeEditor(textarea, {
            getSkinId,
            replaceSkinNumbers,
            highlightCSS,
            updateLineNumbers,
            validateCSS
        });
    }
});
</script>
```

### Option 2: Build System (Webpack/Rollup)

```javascript
// index.js
import { isCivicPlusSite, pageMatches } from './modules/site-detection.js';
import { injectStyles } from './modules/css-styles.js';
import { highlightCSS } from './modules/syntax-highlighter.js';
import { updateLineNumbers } from './modules/line-numbers.js';
import { validateCSS } from './modules/validation.js';
import { getSkinId, replaceSkinNumbers } from './modules/skin-replacement.js';
import { initializeEditor } from './modules/editor-initialization.js';
import { enforceTextLimits } from './modules/text-limits.js';
import { findAndEnhanceTextareas } from './modules/textarea-finder.js';
import { startObserving } from './modules/mutation-observer.js';
import { bootstrap } from './modules/main.js';

bootstrap({
    isCivicPlusSite,
    injectStyles,
    enforceTextLimits,
    pageMatches,
    startObserving,
    findAndEnhanceTextareas,
    initializeEditor: (textarea) => {
        initializeEditor(textarea, {
            getSkinId,
            replaceSkinNumbers,
            highlightCSS,
            updateLineNumbers,
            validateCSS
        });
    }
});
```

---

## 🎯 Benefits of Modular Structure

### ✅ Maintainability
- Each module has a single responsibility
- Easier to locate and fix bugs
- Clear separation of concerns

### ✅ Testability
- Individual modules can be unit tested
- Mock dependencies easily
- Test isolated functionality

### ✅ Reusability
- Modules can be used in other projects
- Example: `syntax-highlighter.js` can be used standalone
- Example: `validation.js` can be used in other CSS tools

### ✅ Development
- Multiple developers can work on different modules simultaneously
- Smaller files are easier to understand
- Clear module boundaries prevent merge conflicts

### ✅ Bundle Optimization
- Tree-shaking can remove unused modules
- Lazy-load modules as needed
- Reduce initial bundle size

---

## 🚧 Future Refactoring Opportunities

### 1. **Further Break Down `validation.js`**
Currently 1450+ lines. Should split into:
- `validation/syntax.js` (~200 lines)
- `validation/properties.js` (~300 lines)
- `validation/colors.js` (~250 lines)
- `validation/functions.js` (~300 lines)
- `validation/advanced.js` (~250 lines)
- `validation/at-rules.js` (~150 lines)

### 2. **Add TypeScript Definitions**
Create `.d.ts` files for each module to enable:
- Better IDE autocomplete
- Type checking
- Self-documenting code

### 3. **Create Unit Tests**
Test each module independently:
```javascript
// syntax-highlighter.test.js
test('highlights hex colors correctly', () => {
    const result = highlightCSS('color: #ff0000;');
    expect(result).toContain('css-color');
    expect(result).toContain('css-color-preview');
});
```

### 4. **Add Module Documentation**
Use JSDoc comments more extensively for:
- Better IDE support
- Auto-generated documentation
- Example usage in comments

### 5. **Create Build Pipeline**
Set up Rollup/Webpack to:
- Bundle modules into single file for production
- Minify/uglify code
- Generate source maps
- Output both ESM and UMD formats

---

## 📊 Module Dependencies Graph

```
main.js
├── site-detection.js (no deps)
├── css-styles.js (no deps)
├── text-limits.js
│   └── site-detection.js (pageMatches)
├── mutation-observer.js
│   └── textarea-finder.js
│       └── editor-initialization.js
│           ├── skin-replacement.js (no deps)
│           ├── syntax-highlighter.js (no deps)
│           ├── line-numbers.js (no deps)
│           └── validation.js
│               └── validation/typos.js (no deps)
```

---

## 🧪 Testing the Modules

### Manual Testing
1. Open `color-preview-test.html` to test color highlighting
2. Load modules in browser console
3. Test individual functions

### Automated Testing (Future)
```bash
npm install --save-dev jest
npm test
```

---

## 📝 Notes for Developers

### Working on a Specific Module

**Example: Improving Color Validation**

1. Open `modules/validation.js` (or create `modules/validation/colors.js`)
2. Find the color validation section (~lines 726-826 in original)
3. Make your changes
4. Test with `color-preview-test.html`
5. Update this README if you split the module

### Adding a New Validation Rule

1. Open `modules/validation.js`
2. Add your validation logic
3. Push errors/warnings to the appropriate array
4. Test with various CSS inputs
5. Consider adding to `validation/typos.js` if it's a typo check

### Debugging

Each module logs to console with `[CivicPlus CSS Editor]` prefix:
```javascript
console.log('[CivicPlus CSS Editor] Message here');
```

Filter console logs by this prefix to trace module execution.

---

## 🔗 Related Files

- `css-editor.js` - Original monolithic file (reference)
- `color-preview-test.html` - Color highlighting test suite
- `COLOR-TEST-README.md` - Test suite documentation
- `README.md` - Main project README (if exists)

---

## 📧 Questions?

If you have questions about the modular structure or need help working with a specific module, refer to:

1. This README
2. The original `css-editor.js` with line number references
3. JSDoc comments in each module
4. The detailed analysis document (if provided)

---

**Last Updated:** 2026-01-08
**Modular Structure Version:** 1.0
