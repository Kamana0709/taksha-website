const fs = require('fs');
const path = require('path');
const https = require('https');

const fontsDir = path.join(__dirname, '..', 'assets', 'fonts', 'Poppins');

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fonts = [
  { name: 'Poppins-Regular.ttf', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf' },
  { name: 'Poppins-Bold.ttf', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf' },
  { name: 'Poppins-Italic.ttf', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Italic.ttf' },
  { name: 'Poppins-BoldItalic.ttf', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-BoldItalic.ttf' }
];

function downloadFont(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`[SKIP] ${path.basename(dest)} already exists.`);
      return resolve();
    }
    
    console.log(`Downloading ${path.basename(dest)}...`);
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`[DONE] ${path.basename(dest)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    for (const font of fonts) {
      const dest = path.join(fontsDir, font.name);
      await downloadFont(font.url, dest);
    }
    console.log('All fonts downloaded successfully!');
  } catch (error) {
    console.error('Error downloading fonts:', error);
    process.exit(1);
  }
}

main();
