const fs = require('fs');
const path = require('path');
const opentype = require('./node_modules/opentype.js');
const wawoff2 = require('./node_modules/wawoff2');

const CACHE_DIR = path.resolve(__dirname, 'cache');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'Miqat UI-UX', 'assets', 'fonts');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const WEIGHT_CONFIGS = [
  {
    weight: 400,
    styleName: 'Regular',
    weightClass: 400,
    postScriptName: 'MiqatText-Regular',
    fullName: 'Miqat Text Regular',
    fileName: 'MiqatText-Regular',
    pjsFile: 'pjs-400.ttf',
    interFile: 'inter-400.ttf'
  },
  {
    weight: 500,
    styleName: 'Medium',
    weightClass: 500,
    postScriptName: 'MiqatText-Medium',
    fullName: 'Miqat Text Medium',
    fileName: 'MiqatText-Medium',
    pjsFile: 'pjs-500.ttf',
    interFile: 'inter-500.ttf'
  },
  {
    weight: 600,
    styleName: 'SemiBold',
    weightClass: 600,
    postScriptName: 'MiqatText-SemiBold',
    fullName: 'Miqat Text SemiBold',
    fileName: 'MiqatText-SemiBold',
    pjsFile: 'pjs-600.ttf',
    interFile: 'inter-600.ttf'
  }
];

function scalePath(sourcePath, scaleFactor, dx = 0, dy = 0) {
  const newPath = new opentype.Path();
  sourcePath.commands.forEach(cmd => {
    if (cmd.type === 'M') {
      newPath.moveTo(Math.round(cmd.x * scaleFactor + dx), Math.round(cmd.y * scaleFactor + dy));
    } else if (cmd.type === 'L') {
      newPath.lineTo(Math.round(cmd.x * scaleFactor + dx), Math.round(cmd.y * scaleFactor + dy));
    } else if (cmd.type === 'C') {
      newPath.curveTo(
        Math.round(cmd.x1 * scaleFactor + dx), Math.round(cmd.y1 * scaleFactor + dy),
        Math.round(cmd.x2 * scaleFactor + dx), Math.round(cmd.y2 * scaleFactor + dy),
        Math.round(cmd.x * scaleFactor + dx), Math.round(cmd.y * scaleFactor + dy)
      );
    } else if (cmd.type === 'Q') {
      newPath.quadraticCurveTo(
        Math.round(cmd.x1 * scaleFactor + dx), Math.round(cmd.y1 * scaleFactor + dy),
        Math.round(cmd.x * scaleFactor + dx), Math.round(cmd.y * scaleFactor + dy)
      );
    } else if (cmd.type === 'Z') {
      newPath.close();
    }
  });
  return newPath;
}

function scalePunctuationPath(sourcePath, scale = 1.08) {
  // Find bounding box center
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  sourcePath.commands.forEach(cmd => {
    if (cmd.x !== undefined) {
      if (cmd.x < minX) minX = cmd.x;
      if (cmd.x > maxX) maxX = cmd.x;
    }
    if (cmd.y !== undefined) {
      if (cmd.y < minY) minY = cmd.y;
      if (cmd.y > maxY) maxY = cmd.y;
    }
  });

  if (!isFinite(minX)) return sourcePath;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  const newPath = new opentype.Path();
  sourcePath.commands.forEach(cmd => {
    if (cmd.type === 'M') {
      newPath.moveTo(Math.round(cx + (cmd.x - cx) * scale), Math.round(cy + (cmd.y - cy) * scale));
    } else if (cmd.type === 'L') {
      newPath.lineTo(Math.round(cx + (cmd.x - cx) * scale), Math.round(cy + (cmd.y - cy) * scale));
    } else if (cmd.type === 'C') {
      newPath.curveTo(
        Math.round(cx + (cmd.x1 - cx) * scale), Math.round(cy + (cmd.y1 - cy) * scale),
        Math.round(cx + (cmd.x2 - cx) * scale), Math.round(cy + (cmd.y2 - cy) * scale),
        Math.round(cx + (cmd.x - cx) * scale), Math.round(cy + (cmd.y - cy) * scale)
      );
    } else if (cmd.type === 'Q') {
      newPath.quadraticCurveTo(
        Math.round(cx + (cmd.x1 - cx) * scale), Math.round(cy + (cmd.y1 - cy) * scale),
        Math.round(cx + (cmd.x - cx) * scale), Math.round(cy + (cmd.y - cy) * scale)
      );
    } else if (cmd.type === 'Z') {
      newPath.close();
    }
  });
  return newPath;
}

function findGlyphByName(font, name) {
  for (let i = 0; i < font.glyphs.length; i++) {
    const g = font.glyphs.get(i);
    if (g.name === name) return g;
  }
  return null;
}

async function generateWeight(config) {
  console.log(`\n========================================`);
  console.log(`Generating Miqat Text - ${config.styleName} (${config.weight})`);
  console.log(`========================================`);

  const pjsBuf = fs.readFileSync(path.join(CACHE_DIR, config.pjsFile));
  const interBuf = fs.readFileSync(path.join(CACHE_DIR, config.interFile));

  const pjsFont = opentype.parse(pjsBuf.buffer.slice(pjsBuf.byteOffset, pjsBuf.byteOffset + pjsBuf.byteLength));
  const interFont = opentype.parse(interBuf.buffer.slice(interBuf.byteOffset, interBuf.byteOffset + interBuf.byteLength));

  const interScale = 1000 / 2048; // Inter is 2048 UPM, Miqat Text is 1000 UPM

  // Retrieve disambiguation glyphs from Inter
  const interL = findGlyphByName(interFont, 'l.ss02'); // Curved humanist tail 'l'
  const interI = findGlyphByName(interFont, 'I.double'); // Seriffed capital 'I'
  const interOne = findGlyphByName(interFont, 'one.ss01'); // Distinct numeral '1' with angled flag & base foot

  if (!interL || !interI || !interOne) {
    throw new Error(`Failed to locate required disambiguation glyphs in ${config.interFile}`);
  }

  const glyphList = [];

  // Glyph 0: .notdef
  const notdef = pjsFont.glyphs.get(0);
  glyphList.push(notdef);

  // Set of unicodes handled to avoid duplicates
  const seenUnicodes = new Set();

  // Process all glyphs from PJS
  for (let i = 1; i < pjsFont.glyphs.length; i++) {
    const origGlyph = pjsFont.glyphs.get(i);
    const unicode = origGlyph.unicode;
    const name = origGlyph.name;

    if (unicode && seenUnicodes.has(unicode)) {
      continue;
    }
    if (unicode) seenUnicodes.add(unicode);

    let newGlyph = null;

    // 1. Lowercase 'l' (U+006C) -> Distinct Humanist Curved Tail
    if (unicode === 108 || name === 'l') {
      const scaledPath = scalePath(interL.path, interScale);
      const adv = Math.round(interL.advanceWidth * interScale * 1.02);
      newGlyph = new opentype.Glyph({
        name: 'l',
        unicode: 108,
        unicodes: [108],
        advanceWidth: adv,
        path: scaledPath
      });
      console.log(`[Disambiguation] 'l' synthesized with curved humanist exit tail (adv: ${adv})`);
    }
    // 2. Uppercase 'I' (U+0049) -> Distinct Capital with Top & Bottom Serifs
    else if (unicode === 73 || name === 'I') {
      const scaledPath = scalePath(interI.path, interScale);
      const adv = Math.round(interI.advanceWidth * interScale);
      newGlyph = new opentype.Glyph({
        name: 'I',
        unicode: 73,
        unicodes: [73],
        advanceWidth: adv,
        path: scaledPath
      });
      console.log(`[Disambiguation] 'I' synthesized with distinct crossbar serifs (adv: ${adv})`);
    }
    // 3. Numeral '1' (U+0031) -> Distinct Numeral with Angled Flag & Base Foot
    else if (unicode === 49 || name === 'one') {
      const scaledPath = scalePath(interOne.path, interScale);
      const adv = Math.round(interOne.advanceWidth * interScale);
      newGlyph = new opentype.Glyph({
        name: 'one',
        unicode: 49,
        unicodes: [49],
        advanceWidth: adv,
        path: scaledPath
      });
      console.log(`[Disambiguation] '1' synthesized with angled flag & base foot (adv: ${adv})`);
    }
    // 4. Optical Punctuation Clarity (. , : ; ! ? ' " “ ” ‘ ’)
    else if ([46, 44, 58, 59, 33, 63, 34, 39, 8216, 8217, 8220, 8221].includes(unicode)) {
      const scaledPath = scalePunctuationPath(origGlyph.path, 1.08);
      const adv = Math.round(origGlyph.advanceWidth * 1.04);
      newGlyph = new opentype.Glyph({
        name: name,
        unicode: unicode,
        unicodes: origGlyph.unicodes || (unicode ? [unicode] : []),
        advanceWidth: adv,
        path: scaledPath
      });
    }
    // 5. Standard Content Letterforms & Accents: Optical breathing room for paragraph readability
    else {
      // Gentle +1.5% breathing room on advance width for comfortable multi-line paragraph reading
      const adv = Math.round(origGlyph.advanceWidth * 1.015 + 4);
      const pathCommands = scalePath(origGlyph.path, 1.0, 2, 0); // slight optical center shift
      newGlyph = new opentype.Glyph({
        name: name,
        unicode: unicode,
        unicodes: origGlyph.unicodes || (unicode ? [unicode] : []),
        advanceWidth: adv,
        path: pathCommands
      });
    }

    glyphList.push(newGlyph);
  }

  // Construct the OpenType font instance
  const font = new opentype.Font({
    familyName: 'Miqat Text',
    styleName: config.styleName,
    weightClass: config.weightClass,
    unitsPerEm: 1000,
    ascender: 960,
    descender: -240,
    designer: 'Miqat Type Studio',
    designerURL: 'https://miqat.com',
    manufacturer: 'Miqat Typography & Digital Experience',
    description: 'Custom Latin content typeface for Miqat Platform, combining modern geometric proportions with humanist reading clarity for Hajj & Umrah editorial content.',
    copyright: 'Copyright 2026 Miqat Platform. Inspired by Plus Jakarta Sans and Inter, licensed under SIL OFL 1.1.',
    license: 'SIL Open Font License, Version 1.1',
    licenseURL: 'https://openfontlicense.org',
    version: 'Version 1.000',
    glyphs: glyphList
  });

  // Ensure postScriptName and fullName are explicitly defined
  font.names.unicode.postScriptName = { en: config.postScriptName };
  font.names.macintosh.postScriptName = { en: config.postScriptName };
  font.names.windows.postScriptName = { en: config.postScriptName };

  font.names.unicode.fullName = { en: config.fullName };
  font.names.macintosh.fullName = { en: config.fullName };
  font.names.windows.fullName = { en: config.fullName };

  // Generate TTF buffer
  const ttfBuffer = Buffer.from(font.toArrayBuffer());
  const ttfPath = path.join(OUTPUT_DIR, `${config.fileName}.ttf`);
  fs.writeFileSync(ttfPath, ttfBuffer);
  console.log(`[Generated TTF] ${config.fileName}.ttf (${ttfBuffer.length} bytes, ${glyphList.length} glyphs)`);

  // Compress to WOFF2
  const woff2Buffer = await wawoff2.compress(ttfBuffer);
  const woff2Path = path.join(OUTPUT_DIR, `${config.fileName}.woff2`);
  fs.writeFileSync(woff2Path, woff2Buffer);
  console.log(`[Generated WOFF2] ${config.fileName}.woff2 (${woff2Buffer.length} bytes)`);

  // Verify roundtrip
  const verifyFont = opentype.parse(ttfBuffer.buffer.slice(ttfBuffer.byteOffset, ttfBuffer.byteOffset + ttfBuffer.byteLength));
  const verifyL = verifyFont.charToGlyph('l');
  const verifyI = verifyFont.charToGlyph('I');
  const verify1 = verifyFont.charToGlyph('1');
  console.log(`[Verification] Family: ${verifyFont.getEnglishName('fontFamily')}, Style: ${verifyFont.getEnglishName('fontSubfamily')}`);
  console.log(`[Verification] 'l' advance: ${verifyL.advanceWidth}, commands: ${verifyL.path.commands.length}`);
  console.log(`[Verification] 'I' advance: ${verifyI.advanceWidth}, commands: ${verifyI.path.commands.length}`);
  console.log(`[Verification] '1' advance: ${verify1.advanceWidth}, commands: ${verify1.path.commands.length}`);
}

async function buildAll() {
  console.log('Starting Miqat Text Typeface Compilation...');
  for (const config of WEIGHT_CONFIGS) {
    await generateWeight(config);
  }
  console.log('\n========================================');
  console.log('All Miqat Text font weights compiled successfully!');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log('========================================');
}

buildAll().catch(err => {
  console.error('Error generating Miqat Text fonts:', err);
  process.exit(1);
});
