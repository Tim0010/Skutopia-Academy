const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sharp = require('sharp');

// Promisify fs methods
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

// Define favicon sizes for different devices
const sizes = [16, 32, 48, 96, 144, 192, 512];

// Ensure the favicon directory exists
async function ensureDir(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

// Generate a manifest.json file for PWA support
async function generateManifest() {
  const manifest = {
    name: 'Skutopia Academy',
    short_name: 'Skutopia',
    description: 'Learn STEM subjects with personalized mentorship',
    start_url: '/',
    display: 'standalone',
    background_color: '#2196F3',
    theme_color: '#2196F3',
    icons: sizes.map(size => ({
      src: `/favicon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: 'any maskable'
    }))
  };

  await writeFile(
    path.join(__dirname, '../public/manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Generated manifest.json');
}

// Main function to generate favicons
async function generateFavicons() {
  try {
    // Create the favicon directory if it doesn't exist
    const publicDir = path.join(__dirname, '../public');
    await ensureDir(publicDir);

    // Read the source SVG
    const svgBuffer = await readFile(path.join(publicDir, 'favicon.svg'));

    // Generate PNG favicons in different sizes
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
      console.log(`Generated ${size}x${size} favicon`);
    }

    // Create apple-touch-icon.png
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');

    // Generate manifest.json
    await generateManifest();

    console.log('All favicons generated successfully!');
  } catch (err) {
    console.error('Error generating favicons:', err);
  }
}

// Run the favicon generator
generateFavicons(); 