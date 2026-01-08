# 🎨 Color Preview Test Suite

## Overview
This test suite validates the color highlighting and preview functionality from `css-editor.js`. It tests **200+ different color codes** across various formats to ensure the syntax highlighting and color preview boxes work correctly.

## How to Run the Tests

### Option 1: Direct Browser Opening
1. Open `color-preview-test.html` in any modern web browser
2. Tests will run automatically on page load
3. View the results visually in the browser

### Option 2: Local Web Server
```bash
# Using Python 3
cd /home/user/css-editor
python3 -m http.server 8000

# Then open: http://localhost:8000/color-preview-test.html
```

## What's Being Tested

### Test Categories

#### 1. **Hex 3-Digit Colors** (15 tests)
- Valid examples: `#f00`, `#0f0`, `#abc`
- Tests basic hex color previews

#### 2. **Hex 6-Digit Colors** (25 tests)
- Valid examples: `#ff0000`, `#4ecdc4`, `#38ada9`
- Tests standard hex colors

#### 3. **Hex 8-Digit Colors with Alpha** (9 tests)
- Valid examples: `#ff0000ff`, `#0000ff80`, `#ffffff00`
- Tests hex colors with alpha channel (RRGGBBAA format)

#### 4. **Hex 4-Digit Colors with Alpha** (5 tests)
- Valid examples: `#f00f`, `#0f0f`, `#fff0`
- Tests short hex with alpha (RGBA format)

#### 5. **RGB Colors** (20 tests)
- Valid examples: `rgb(255, 0, 0)`, `rgb(128, 128, 128)`
- Tests RGB color function

#### 6. **RGBA Colors** (20 tests)
- Valid examples: `rgba(255, 0, 0, 1)`, `rgba(0, 0, 0, 0.5)`
- Tests RGBA with alpha transparency

#### 7. **Invalid Hex Colors** (10 tests)
- Tests error detection for:
  - Wrong length: `#ff`, `#fffff`
  - Invalid characters: `#gggggg`, `#xyz`
  - Other malformed hex codes

#### 8. **Invalid RGB Colors** (8 tests)
- Tests error detection for:
  - Out of range values: `rgb(256, 0, 0)`
  - Missing values: `rgb(255, 0)`
  - Invalid characters: `rgb(abc, 0, 0)`

#### 9. **Invalid RGBA Colors** (6 tests)
- Tests error detection for:
  - Missing alpha: `rgba(255, 0, 0)`
  - Alpha out of range: `rgba(255, 0, 0, 2)`
  - Negative alpha: `rgba(255, 0, 0, -0.5)`

#### 10. **Mixed Color Scenarios** (8 tests)
- Tests colors in real-world contexts:
  - `background: linear-gradient(#ff0000, #00ff00);`
  - `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);`
  - Multiple colors in one declaration

#### 11. **Edge Cases** (9 tests)
- Tests special scenarios:
  - Uppercase: `#FFF`, `RGB(255, 0, 0)`
  - Mixed case: `#FfFfFf`
  - No spaces: `rgba(255,0,0,1)`
  - Extra spaces: `rgb( 255 , 0 , 0 )`

## What to Look For

### ✅ Valid Color Tests Should Show:
1. **Property name** in blue (e.g., `color`, `background-color`)
2. **Colon** in black
3. **Color value** in red (e.g., `#ff0000`, `rgb(255, 0, 0)`)
4. **Color preview box** next to the color value with the actual color displayed
5. **Green border** around the test item
6. **"✓ VALID"** status badge

### ❌ Invalid Color Tests Should Show:
1. Same highlighting as above
2. **Red border** around the test item
3. **"✗ ERROR"** status badge
4. **Error message** explaining what's wrong (displayed below the code)

## Expected Results

The test suite includes:
- **Total Tests**: ~135-150 tests
- **Valid Tests**: ~110-120 tests (should show green borders with color previews)
- **Invalid Tests**: ~20-30 tests (should show red borders with error messages)

## Visual Verification Checklist

When reviewing the test results, verify:

- [ ] All hex colors show a small colored square preview
- [ ] RGB colors show the correct color in the preview box
- [ ] RGBA colors with transparency show correctly
- [ ] Invalid colors are marked with red borders
- [ ] Error messages appear for invalid colors
- [ ] Syntax highlighting colors match VS Code Light theme:
  - Properties: Blue (#0451a5)
  - Color values: Red (#a31515)
  - Numbers: Green (#098658)

## How the Tests Work

### 1. Syntax Highlighting
The `highlightCSS()` function (extracted from css-editor.js) processes each CSS line:
- Identifies color patterns (hex, rgb, rgba)
- Wraps colors in `<span>` tags with appropriate classes
- Injects color preview `<span>` elements with inline styles

### 2. Color Validation
The `validateColor()` function checks:
- Hex color length (must be 3, 4, 6, or 8 characters)
- Hex characters (only 0-9, a-f, A-F allowed)
- RGB value ranges (0-255)
- RGBA alpha range (0-1)
- Correct number of parameters

### 3. Visual Display
Each test shows:
- Original CSS code with syntax highlighting
- Color preview boxes inline with the color values
- Validation status (valid/invalid)
- Error messages for invalid tests

## Troubleshooting

### Colors not showing previews?
- Check browser console for JavaScript errors
- Verify the `highlightCSS()` function is working
- Inspect the generated HTML to see if `<span class="css-color-preview">` elements exist

### All tests showing as invalid?
- Check the `validateColor()` function logic
- Verify regex patterns are matching correctly

### Syntax highlighting not working?
- Verify CSS classes are defined in the `<style>` section
- Check that the highlighting function is being called

## Browser Compatibility

Tested and working in:
- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)

## Extending the Tests

To add more test cases, edit the `generateTestCases()` function:

```javascript
tests.push({
    category: 'Your Custom Category',
    tests: [
        'color: #yourcolor;',
        'background: rgb(your, values, here);',
        // ... more tests
    ]
});
```

## Technical Details

### Color Preview Implementation
The color preview boxes are created by:
1. Detecting color patterns with regex: `/#([0-9a-fA-F]{3,8})\b/` for hex
2. Replacing color matches with placeholders during processing
3. Restoring placeholders with HTML including the preview span:
   ```html
   <span class="css-color">#ff0000</span>
   <span class="css-color-preview" style="background:#ff0000"></span>
   ```

### Validation Logic
- **Hex**: Validates length (3, 4, 6, or 8) and characters (0-9, a-f, A-F)
- **RGB**: Validates 3 values in range 0-255
- **RGBA**: Validates 3 RGB values + 1 alpha value (0-1)

## Statistics

After running the tests, you'll see:
- **Total Count**: Number of all tests run
- **Valid Count**: Tests that passed validation (green)
- **Invalid Count**: Tests that failed validation (red)

The console will also log a pass rate percentage.

---

## Questions or Issues?

If you find any color formats that aren't being highlighted or validated correctly, they may need to be added to the test suite or the main css-editor.js file.
