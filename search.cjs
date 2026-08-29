const fs = require('fs');
const path = require('path');

const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const searchIdentifiers = async () => {
  const dirsToScan = [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'backend'),
  ];
  
  const additionalFiles = [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'package.json'),
  ];

  let allFiles = [...additionalFiles];

  for (const dir of dirsToScan) {
    const files = await new Promise((res, rej) => walk(dir, (err, results) => err ? rej(err) : res(results)));
    allFiles = allFiles.concat(files.filter(f => !f.includes('node_modules') && !f.includes('.git') && !f.includes('uploads') && !f.includes('.gemini')));
  }
  
  const filesToSearch = allFiles.filter(f => f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.json'));

  const patterns = [
    'taksha.studio',
    'taksha.tech',
    'hello@taksha.studio',
    'website@taksha.studio',
    'takshadigital@gmail.com',
    'linkedin.com/company/taksha',
    'instagram.com/taksha.studio',
    'twitter.com/taksha_studio'
  ];

  for (const file of filesToSearch) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      for (const p of patterns) {
        if (line.includes(p)) {
          console.log(`${file}:${i + 1}: ${line.trim()}`);
          break;
        }
      }
    });
  }
};

searchIdentifiers().catch(console.error);
