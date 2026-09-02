const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function test() {
  try {
    const form = new FormData();
    form.append('name', 'Test User');
    form.append('email', 'test@test.com');
    form.append('roleId', 'DEV001');
    form.append('roleTitle', 'Frontend Intern');
    form.append('phone', '1234567890');
    form.append('location', 'Test City');
    form.append('college', 'Test College');
    form.append('degree', 'BTech');
    form.append('specialization', 'CS');
    form.append('currentYear', '3rd Year');
    form.append('graduationYear', '2025');
    form.append('skills', 'React');
    form.append('hasProjects', 'true');
    form.append('duration', '3 Months');
    form.append('availability', 'Full-time');
    form.append('startDate', '2026-09-01');
    form.append('motivation', 'To learn');
    form.append('source', 'LinkedIn');
    
    // Add a dummy file
    fs.writeFileSync('dummy.pdf', 'dummy content');
    form.append('resume', fs.createReadStream('dummy.pdf'));
    
    console.log('Sending request...');
    const response = await axios.post('http://localhost:5000/api/applications', form, {
      headers: form.getHeaders(),
    });
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

test();
