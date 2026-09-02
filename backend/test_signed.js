require('dotenv').config();
const { getSignedUrl } = require('./storage');

async function test() {
  try {
    const url = await getSignedUrl('submissions', 'test.txt', 315360000);
    console.log('URL:', url);
  } catch (err) {
    console.error('ERROR:', err);
  }
}
test();
