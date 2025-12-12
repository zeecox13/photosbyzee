const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function trimLogo() {
  const inputPath = path.join(__dirname, '..', 'public', 'logo.png');
  const tempPath = path.join(__dirname, '..', 'public', 'logo-temp.png');

  try {
    // Trim transparent edges and save
    await sharp(inputPath)
      .trim({ threshold: 10 })
      .toFile(tempPath);

    // Replace original with trimmed version
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);

    const metadata = await sharp(inputPath).metadata();
    console.log(`Logo trimmed. New dimensions: ${metadata.width}x${metadata.height}px`);
  } catch (error) {
    console.error('Error trimming logo:', error);
    process.exit(1);
  }
}

trimLogo();

