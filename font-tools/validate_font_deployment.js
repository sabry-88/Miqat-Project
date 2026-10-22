const fs = require('fs');
const path = require('path');
const opentype = require('./node_modules/opentype.js');

const fontsDir = path.resolve(__dirname, '..', 'Miqat UI-UX', 'assets', 'fonts');
const cssPath = path.resolve(__dirname, '..', 'Miqat UI-UX', 'styles.css');
const htmlPath = path.resolve(__dirname, '..', 'Miqat UI-UX', 'index.html');

console.log('====================================================');
console.log('MIQAT TEXT TYPOGRAPHY VALIDATION AUDIT');
console.log('====================================================');

let allPassed = true;

// 1. Audit font files
const expectedFiles = [
  'MiqatText-Regular.woff2',
  'MiqatText-Regular.ttf',
  'MiqatText-Medium.woff2',
  'MiqatText-Medium.ttf',
  'MiqatText-SemiBold.woff2',
  'MiqatText-SemiBold.ttf'
];

console.log('\n--- 1. FONT ASSET INTEGRITY ---');
expectedFiles.forEach(file => {
  const filePath = path.join(fontsDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[FAIL] Missing font asset: ${file}`);
    allPassed = false;
  } else {
    const size = fs.statSync(filePath).size;
    console.log(`[PASS] ${file} exists (${size.toLocaleString()} bytes)`);
  }
});

// 2. Audit TTF tables and glyphs
console.log('\n--- 2. OPENTYPE METRICS & GLYPH VERIFICATION ---');
['Regular', 'Medium', 'SemiBold'].forEach(style => {
  const ttfPath = path.join(fontsDir, `MiqatText-${style}.ttf`);
  const font = opentype.parse(fs.readFileSync(ttfPath));
  const family = font.getEnglishName('fontFamily');
  const subfamily = font.getEnglishName('fontSubfamily');
  const glyphCount = font.glyphs.length;
  const weightClass = font.tables.os2 ? font.tables.os2.usWeightClass : 'N/A';
  const l = font.charToGlyph('l');
  const I = font.charToGlyph('I');
  const one = font.charToGlyph('1');

  console.log(`\nWeight ${style}:`);
  console.log(`  Family: "${family}", Subfamily: "${subfamily}", WeightClass: ${weightClass}`);
  console.log(`  UnitsPerEm: ${font.unitsPerEm}, Ascender: ${font.ascender}, Descender: ${font.descender}`);
  console.log(`  Total Glyphs: ${glyphCount}`);
  console.log(`  'l' (curved tail) advanceWidth: ${l.advanceWidth}, path commands: ${l.path.commands.length}`);
  console.log(`  'I' (crossbar serifs) advanceWidth: ${I.advanceWidth}, path commands: ${I.path.commands.length}`);
  console.log(`  '1' (angled flag & base) advanceWidth: ${one.advanceWidth}, path commands: ${one.path.commands.length}`);

  // Disambiguation check
  if (l.advanceWidth === I.advanceWidth && l.path.commands.length === I.path.commands.length) {
    console.error(`  [FAIL] 'l' and 'I' are identical!`);
    allPassed = false;
  } else {
    console.log(`  [PASS] 'l' and 'I' are clearly differentiated.`);
  }

  if (l.advanceWidth === one.advanceWidth && l.path.commands.length === one.path.commands.length) {
    console.error(`  [FAIL] 'l' and '1' are identical!`);
    allPassed = false;
  } else {
    console.log(`  [PASS] 'l' and '1' are clearly differentiated.`);
  }
});

// 3. Audit CSS Rules
console.log('\n--- 3. CSS SCOPE & SELECTOR INTEGRITY ---');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Check @font-face
const hasFontFace = cssContent.includes("@font-face") &&
                    cssContent.includes("font-family: 'Miqat Text'") &&
                    cssContent.includes("MiqatText-Regular.woff2") &&
                    cssContent.includes("MiqatText-Medium.woff2") &&
                    cssContent.includes("MiqatText-SemiBold.woff2");
console.log(`@font-face declarations for Miqat Text: ${hasFontFace ? '[PASS]' : '[FAIL]'}`);
if (!hasFontFace) allPassed = false;

// Check Arabic preservation
const arabicPreserved = cssContent.includes("--font-display-ar: 'Aref Ruqaa'") &&
                        cssContent.includes("--font-body-ar: 'IBM Plex Sans Arabic'") &&
                        cssContent.includes('html[lang="ar"] {\n  --font-current: var(--font-body-ar);\n  font-family: var(--font-body-ar);\n}');
console.log(`Arabic typography preservation: ${arabicPreserved ? '[PASS]' : '[FAIL]'}`);
if (!arabicPreserved) allPassed = false;

// Check English Headings preservation
const headingsPreserved = cssContent.includes("--font-en-display: 'Cormorant Garamond'") &&
                          cssContent.includes('[dir="ltr"] .hero-heading {\n  font-family: var(--font-en-display);') &&
                          cssContent.includes('[dir="ltr"] .section-title {\n  font-family: var(--font-en-display);');
console.log(`English heading font preservation (Cormorant Garamond): ${headingsPreserved ? '[PASS]' : '[FAIL]'}`);
if (!headingsPreserved) allPassed = false;

// Check UI font preservation
const uiPreserved = cssContent.includes('[dir="ltr"] .nav-link,') &&
                    cssContent.includes('[dir="ltr"] .btn {\n  font-family: var(--font-en-ui);') &&
                    cssContent.includes('[dir="ltr"] .gateway-title');
console.log(`English UI font preservation (Inter for nav, buttons, cards): ${uiPreserved ? '[PASS]' : '[FAIL]'}`);
if (!uiPreserved) allPassed = false;

// Check Content font application
const contentApplied = cssContent.includes("--font-en-content: 'Miqat Text'") &&
                       cssContent.includes('[dir="ltr"] p,') &&
                       cssContent.includes('[dir="ltr"] .section-desc {\n  font-family: var(--font-en-content);') &&
                       cssContent.includes('[dir="ltr"] .hero-subheading {\n  font-family: var(--font-en-content);');
console.log(`English Content font application (Miqat Text): ${contentApplied ? '[PASS]' : '[FAIL]'}`);
if (!contentApplied) allPassed = false;

// 4. Audit HTML Preload
console.log('\n--- 4. HTML PRELOAD AUDIT ---');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const hasPreload = htmlContent.includes('<link rel="preload" href="./assets/fonts/MiqatText-Regular.woff2" as="font" type="font/woff2" crossorigin>');
console.log(`MiqatText-Regular.woff2 preload in HTML: ${hasPreload ? '[PASS]' : '[FAIL]'}`);
if (!hasPreload) allPassed = false;

console.log('\n====================================================');
console.log(allPassed ? 'ALL AUDITS PASSED WITH FULL INTEGRITY' : 'SOME AUDITS FAILED');
console.log('====================================================');
process.exit(allPassed ? 0 : 1);
