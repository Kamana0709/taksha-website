const axios = require('axios');
const jwt = require('jsonwebtoken');

// Create a dummy token for SUPER_ADMIN
const token = jwt.sign({ id: 'dummy-admin-id', role: 'SUPER_ADMIN' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });

const interns = [
  { name: 'Alice Smith', email: 'alice.test1@example.com', track: 'Frontend', college: 'Tech U' },
  { name: 'Bob Jones', email: 'bob.test1@example.com', track: 'Backend', college: 'State U' }
];

async function run() {
  try {
    const res = await axios.post('http://localhost:5000/api/interns/bulk-import', { interns }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Success:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

run();
