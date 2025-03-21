const fs = require('fs');
const path = require('path');

async function checkAssets() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    
    const requiredFiles = [
      'favicon.ico', 
      'favicon.svg', 
      'apple-touch-icon.png', 
      'apple-touch-icon.svg',
      'manifest.json'
    ];
    
    console.log('Checking required files...');
    
    for (const file of requiredFiles) {
      const filePath = path.join(publicDir, file);
      
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`✅ ${file} - ${stats.size} bytes`);
      } else {
        console.log(`❌ ${file} - MISSING`);
      }
    }
    
    // Check asset folders
    const assetDirs = ['assets/images', 'assets/svg', 'assets/icons'];
    
    for (const dir of assetDirs) {
      const dirPath = path.join(publicDir, dir);
      
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        console.log(`📁 ${dir} - exists (${files.length} files)`);
      } else {
        console.log(`❓ ${dir} - MISSING - creating now...`);
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ ${dir} - created successfully`);
      }
    }
    
    console.log('\nAsset check completed.');
  } catch (error) {
    console.error('Error checking assets:', error);
  }
}

checkAssets(); 