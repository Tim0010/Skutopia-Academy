const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promises: fsPromises } = fs;

async function convertSvgToIco() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const svgPath = path.join(publicDir, 'favicon.svg');
    const pngPath = path.join(publicDir, 'favicon-tmp.png');
    const icoPath = path.join(publicDir, 'favicon.ico');

    console.log('Reading SVG file...');
    const svgBuffer = await fsPromises.readFile(svgPath);

    console.log('Converting SVG to PNG...');
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFormat('png')
      .toFile(pngPath);

    console.log('Reading PNG file...');
    const pngBuffer = await fsPromises.readFile(pngPath);
    
    console.log('Creating ICO file...');
    await fsPromises.writeFile(icoPath, pngBuffer);

    console.log('Favicon.ico created successfully!');

    console.log('Cleaning up temporary files...');
    await fsPromises.unlink(pngPath);
    
    console.log('Process completed successfully.');
  } catch (error) {
    console.error('Error creating favicon.ico:', error);
  }
}

convertSvgToIco(); 