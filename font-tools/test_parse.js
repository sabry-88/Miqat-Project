const https = require('https');
const opentype = require('./node_modules/opentype.js');

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function test() {
  console.log('Downloading sample TTF for testing...');
  const buf = await download('https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU7NSg.ttf');
  console.log('Downloaded bytes:', buf.length);
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  console.log('Font familyName:', font.names.fontFamily);
  console.log('Number of glyphs:', font.glyphs.length);
  const glyphA = font.charToGlyph('a');
  console.log('Glyph a:', glyphA.name, 'advanceWidth:', glyphA.advanceWidth, 'commands:', glyphA.path.commands.length);
}
test().catch(console.error);
