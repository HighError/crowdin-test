const express = require('express');
const crowdin = require('@crowdin/crowdin-api-client');

const getUserStatus = require('../src/getUserStatus');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const user = await getUserStatus();
    const { sourceFilesApi } = new crowdin.default({ token: user.token });

    const data = [];

    const directories = await sourceFilesApi.listProjectDirectories(
      user.projectID,
    );
    data.push({
      id: 0,
      name: 'Root',
    });
    for (const directory of directories.data) {
      data.push({
        id: directory.data.id,
        name: directory.data.name,
      });
    }
    return res.send(data);
  } catch (err) {
    return res.status(err.code ?? 500).send(err.message);
  }
});

module.exports = router;
