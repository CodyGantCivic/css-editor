// ==================== VALIDATION TYPOS MODULE ====================
// This module contains dictionaries of common CSS typos
// Lines 346-436 from original css-editor.js

// Common CSS property typos mapped to correct property names
const commonPropertyTypos = {
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

// Common color name typos (lines 783-815 from original)
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

// Common unit typos (lines 688-696 from original)
const commonUnitTypos = {
    'pxx': 'px',
    'pz': 'px',
    'emm': 'em',
    'rrem': 'rem',
    'pct': '%',
    'vhh': 'vh',
    'vww': 'vw'
};

// Common split property names (lines 1082-1105 from original)
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

// !important typos (lines 1157-1164 from original)
const importantTypos = [
    { pattern: /!importnt\b/i, correct: '!important' },
    { pattern: /!imprtant\b/i, correct: '!important' },
    { pattern: /!imporant\b/i, correct: '!important' },
    { pattern: /!importat\b/i, correct: '!important' },
    { pattern: /!impotant\b/i, correct: '!important' },
    { pattern: /!\s+important\b/i, correct: '!important' }
];

// Export all typo dictionaries
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        commonPropertyTypos,
        commonColorTypos,
        commonUnitTypos,
        commonSplitProperties,
        importantTypos
    };
}
