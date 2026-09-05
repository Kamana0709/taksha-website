const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(/catch \(_err\) \{\s+res\.status/g, 'catch {\n    res.status');
code = code.replace(/catch \(_err\) \{\s+return res\.status/g, 'catch {\n    return res.status');
code = code.replace(/catch \(_e\) \{\s+return res\.status/g, 'catch {\n      return res.status');
code = code.replace(/const \{ Resend \} = require\('resend'\);\n/g, '');

fs.writeFileSync('server.js', code);
console.log('Fixed catches to omit binding');
