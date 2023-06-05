const express = require('express');
const crowdin = require('@crowdin/crowdin-api-client');

const db = require('../db.js');
const { encrypt } = require('../src/crypto.js');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { projectID, token } = req.body;
    if (!projectID || !token) {
      return res.status(400).send('Missing params');
    }
    const { projectsGroupsApi } = new crowdin.default({ token });
    await projectsGroupsApi.getProject(projectID);

    db.run(
      `UPDATE user_data SET value = '${projectID}' WHERE key = 'ProjectID';`,
    );
    db.run(
      `UPDATE user_data SET value = '${encrypt(token)}' WHERE key = 'Token';`,
    );
    res.json();
  } catch (err) {
    return res.status(err.code ?? 500).send(err.message);
  }
});

module.exports = router;
