const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function cropLogoToSquare() {
  const inputPath = path.join(__dirname, '..', 'public', 'logo.png');
  const tempPath = path.join(__dirname, '..', 'public', 'logo-temp.png');

  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;

    // Determine the size of the square (use the smaller dimension)
    const size = Math.min(width, height);

    // Calculate the crop position (center the crop)
    const left = Math.floor((width - size) / 2);
    const top = Math.floor((height - size) / 2);

    // Crop to square and save to temp file
    await sharp(inputPath)
      .extract({ left, top, width: size, height: size })
      .toFile(tempPath);

    // Replace original with cropped version
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);

    console.log(`Logo cropped to square: ${size}x${size}px`);
    console.log(`Original dimensions: ${width}x${height}px`);
  } catch (error) {
    console.error('Error cropping logo:', error);
    process.exit(1);
  }
}

cropLogoToSquare();

