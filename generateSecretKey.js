const crypto = require('crypto');
const fs = require('fs');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

// Save the secret key to a file (optional)
fs.writeFileSync('secret-key.txt', secretKey, 'utf-8');

console.log('Generated Secret Key:', secretKey);
console.log('Secret Key has been saved to secret-key.txt (optional)');
