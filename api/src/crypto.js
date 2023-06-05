const CryptoJS = require('crypto-js');

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, process.env.KEY).toString();
}

function decrypt(text) {
  return CryptoJS.AES.decrypt(text, process.env.KEY).toString(
    CryptoJS.enc.Utf8,
  );
}

module.exports = { encrypt, decrypt };
