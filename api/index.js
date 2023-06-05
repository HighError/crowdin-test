require('dotenv').config();
const express = require('express');
const cors = require('cors');
const zip = require('express-easy-zip');

const getUserStatus = require('./src/getUserStatus');
const db = require('./db.js');

const downloadRoute = require('./routes/download');
const dataRoute = require('./routes/data');
const loginRoute = require('./routes/login');
const folderRoute = require('./routes/folders');
const uploadRoute = require('./routes/upload');

const app = express();

const port = 3000;

app.use(express.json());
app.use(cors());
app.use(zip());

app.use('/download', downloadRoute);
app.use('/data', dataRoute);
app.use('/login', loginRoute);
app.use('/folders', folderRoute);
app.use('/upload', uploadRoute);

app.get('/status', async (req, res) => {
  try {
    await getUserStatus();
    return res.status(200).end();
  } catch (err) {
    return res.status(401).end();
  }
});

app.delete('/logout', (req, res) => {
  db.run(`UPDATE user_data SET value = NULL WHERE key = 'ProjectID';`);
  db.run(`UPDATE user_data SET value = NULL WHERE key = 'Token';`);
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = { db };
