const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promises: fsPromises } = fs;

async function convertSvgToPng() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const svgPath = path.join(publicDir, 'apple-touch-icon.svg');
    const pngPath = path.join(publicDir, 'apple-touch-icon.png');

    console.log('Reading SVG file...');
    const svgBuffer = await fsPromises.readFile(svgPath);

    console.log('Converting SVG to PNG...');
    await sharp(svgBuffer)
      .resize(180, 180)
      .toFormat('png')
      .toFile(pngPath);

    console.log('Apple-touch-icon.png created successfully!');
  } catch (error) {
    console.error('Error creating apple-touch-icon.png:', error);
  }
}

convertSvgToPng(); 