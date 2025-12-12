const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color replacements: green -> mustard/golden
const colorMap = {
  '#6B705C': '#D4A574', // Main green -> Mustard gold
  '#5A5E4F': '#B8956A',  // Darker green -> Darker mustard
  'rgba(107, 112, 92': 'rgba(212, 165, 116', // For rgba values
};

// Find all .tsx and .ts files in app directory
const appDir = path.join(__dirname, '..', 'app');
const files = [];

function findFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.includes('node_modules')) {
      findFiles(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }
}

findFiles(appDir);

// Also check globals.css
files.push(path.join(__dirname, '..', 'app', 'globals.css'));

let totalReplacements = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    Object.entries(colorMap).forEach(([oldColor, newColor]) => {
      const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newColor);
        modified = true;
        totalReplacements += matches.length;
      }
    });
    
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${path.relative(__dirname + '/..', file)}`);
    }
  } catch (error) {
    // Skip files that can't be read
  }
});

console.log(`\nTotal color replacements: ${totalReplacements}`);

