const db = require('../db.js');
const { decrypt } = require('./crypto.js');

const sql = 'SELECT key, value FROM user_data where value NOT NULL';

async function getUserStatus() {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) return reject(err);

      if (rows.length !== 2) return reject('Invalid user data');

      const projectID = rows[0].value;
      const token = decrypt(rows[1].value);

      resolve({ projectID, token });
    });
  });
}

module.exports = getUserStatus;
