const crypto = require('crypto');

const generateHash = pass => {
  const hashed = crypto
    .createHash('sha256')
    .update(pass)
    .digest('hex');
  return hashed;
};

const checkHash = (pass, hash) => {
  const currentHash = generateHash(pass);
  return currentHash === hash;
};

module.exports = { generateHash, checkHash };
