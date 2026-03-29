const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const filesToMove = [
  { src: 'GEO Logo - White - NB.png', dest: 'geo-logo.png' },
  { src: 'groupPhoto.jpeg', dest: 'groupPhoto.jpeg' },
  { src: 'Guild Electoral Code 2025.pdf', dest: 'electoral-code.pdf' }
];

filesToMove.forEach(({ src, dest }) => {
  const srcPath = path.join(__dirname, src);
  const destPath = path.join(publicDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.renameSync(srcPath, destPath);
    console.log(`Moved ${src} to public/${dest}`);
  } else {
    console.log(`File ${src} not found`);
  }
});
