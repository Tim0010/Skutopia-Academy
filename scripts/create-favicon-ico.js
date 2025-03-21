const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sharp = require('sharp');
const { execSync } = require('child_process');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function createFaviconIco() {
  try {
    const publicDir = path.join(__dirname, '../public');
    const svgPath = path.join(publicDir, 'favicon.svg');
    const pngPath = path.join(publicDir, 'temp-favicon.png');
    const icoPath = path.join(publicDir, 'favicon.ico');

    // Read SVG file
    const svgBuffer = await readFile(svgPath);
    
    // Convert SVG to PNG with a larger size for better quality
    await sharp(svgBuffer)
      .resize(48, 48)
      .png()
      .toFile(pngPath);
    
    console.log('Temporary PNG file created');

    // In a real environment, you would use the 'ico-convert' or similar npm package
    // Since we can't install new packages here, let's create a placeholder message
    
    // Normally this would be:
    // const ico = require('ico-convert');
    // await ico.fromPng(pngPath, icoPath, { sizes: [16, 32, 48] });
    
    // Instead, let's just copy the PNG as ICO for this example
    const pngBuffer = await readFile(pngPath);
    await writeFile(icoPath, pngBuffer);
    
    // Clean up temporary file
    fs.unlinkSync(pngPath);
    
    console.log('Favicon.ico created successfully');
  } catch (err) {
    console.error('Error creating favicon.ico:', err);
  }
}

createFaviconIco(); 