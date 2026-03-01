// Test script for all CRUD operations
const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  console.log('=== TEST 1: GET All Users ===');
  let res = await makeRequest({ hostname: 'localhost', port: 3000, path: '/users', method: 'GET' });
  console.log('Status:', res.status);
  console.log('Response:', res.body);
  console.log();

  console.log('=== TEST 2: POST - Create User ===');
  const newUser = JSON.stringify({ name: "Test User", email: "test@example.com" });
  res = await makeRequest({
    hostname: 'localhost', port: 3000, path: '/users', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': newUser.length }
  }, newUser);
  console.log('Status:', res.status);
  console.log('Response:', res.body);
  const userId = JSON.parse(res.body).insertId;
  console.log('New User ID:', userId);
  console.log();

  console.log('=== TEST 3: GET - Get User by ID ===');
  res = await makeRequest({ hostname: 'localhost', port: 3000, path: `/users/${userId}`, method: 'GET' });
  console.log('Status:', res.status);
  console.log('Response:', res.body);
  console.log();

  console.log('=== TEST 4: PATCH - Update User ===');
  const updatedData = JSON.stringify({ email: "updated@example.com" });
  res = await makeRequest({
    hostname: 'localhost', port: 3000, path: `/users/${userId}`, method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Content-Length': updatedData.length }
  }, updatedData);
  console.log('Status:', res.status);
  console.log('Response:', res.body);
  console.log();

  console.log('=== TEST 5: GET - Verify Update ===');
  res = await makeRequest({ hostname: 'localhost', port: 3000, path: `/users/${userId}`, method: 'GET' });
  console.log('Status:', res.status);
  console.log('Response:', res.body);
  console.log();

  console.log('=== TEST 6: DELETE - Delete User ===');
  res = await makeRequest({ hostname: 'localhost', port: 3000, path: `/users/${userId}`, method: 'DELETE' });
  console.log('Status:', res.status);
  console.log('Response:', res.body);
  console.log();

  console.log('=== TEST 7: GET - Verify Delete (should be 404) ===');
  res = await makeRequest({ hostname: 'localhost', port: 3000, path: `/users/${userId}`, method: 'GET' });
  console.log('Status:', res.status);
  console.log('Response:', res.body);
  console.log();

  console.log('=== ALL TESTS COMPLETED ===');
})();
