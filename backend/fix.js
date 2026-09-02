const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf-8');
c = c.replace(/\\`/g, '`');
fs.writeFileSync('server.js', c);
console.log('Fixed syntax errors');
