const net = require('net');

console.log('Attempting connection to aws-0-ap-northeast-2.pooler.supabase.com:5432 ...');

const socket = net.createConnection({
    host: 'aws-0-ap-northeast-2.pooler.supabase.com',
    port: 5432,
    timeout: 8000
});

let finished = false;

function done(exitCode) {
    if (finished) return;
    finished = true;
    socket.destroy();
    setTimeout(() => process.exit(exitCode), 200);
}

socket.on('connect', () => {
    console.log('SUCCESS: Node.js itself can reach the database on port 5432.');
    done(0);
});

socket.on('timeout', () => {
    console.log('TIMEOUT: Node.js could not reach the database (connection hung).');
    done(1);
});

socket.on('error', (err) => {
    console.log('ERROR: Node.js could not reach the database.');
    console.log('Details:', err.message);
    done(1);
});