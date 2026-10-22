const fs = require('fs');
const wawoff2 = require('./node_modules/wawoff2');
const opentype = require('./node_modules/opentype.js');

async function testWoff2() {
  const https = require('https');
  const buf = await new Promise((resolve) => {
    https.get('https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU7NSg.ttf', res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
  });

  console.log('Original TTF size:', buf.length);
  const woff2Buf = await wawoff2.compress(buf);
  console.log('Compressed WOFF2 size:', woff2Buf.length);
}
testWoff2().catch(console.error);
