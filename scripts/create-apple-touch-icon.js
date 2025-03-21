const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sharp = require('sharp');

const readFile = promisify(fs.readFile);

async function createAppleTouchIcon() {
  try {
    const publicDir = path.join(__dirname, '../public');
    const svgPath = path.join(publicDir, 'apple-touch-icon.svg');
    const pngPath = path.join(publicDir, 'apple-touch-icon.png');

    // Read SVG file
    const svgBuffer = await readFile(svgPath);
    
    // Convert SVG to PNG with size 180x180 (common size for apple-touch-icon)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(pngPath);
    
    console.log('apple-touch-icon.png created successfully');
  } catch (err) {
    console.error('Error creating apple-touch-icon.png:', err);
  }
}

createAppleTouchIcon(); 