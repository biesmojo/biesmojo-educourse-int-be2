// Test script for PATCH request
const http = require('http');

const data = JSON.stringify({
  email: "john.updated@example.com"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/users/4',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (err) => {
  console.error('Error:', err.message);
});

req.write(data);
req.end();
