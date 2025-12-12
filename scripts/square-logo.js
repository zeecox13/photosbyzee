const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function makeLogoSquare() {
  const inputPath = path.join(__dirname, '..', 'public', 'logo.png');
  const tempPath = path.join(__dirname, '..', 'public', 'logo-temp.png');

  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;

    // Use the larger dimension for the square
    const size = Math.max(width, height);

    // Create a square canvas and center the logo
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{
        input: await sharp(inputPath).toBuffer(),
        left: Math.floor((size - width) / 2),
        top: Math.floor((size - height) / 2)
      }])
      .toFile(tempPath);

    // Replace original
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);

    console.log(`Logo made square: ${size}x${size}px (centered)`);
  } catch (error) {
    console.error('Error making logo square:', error);
    process.exit(1);
  }
}

makeLogoSquare();

