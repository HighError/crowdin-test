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
    for (const directory of directories.data) {
      data.push({
        id: directory.data.id,
        type: null,
        parent_id: directory.data.directoryId ?? '0',
        node_type: '0',
        name: directory.data.name,
        title: directory.data.title,
        hasFiles: true,
      });
    }

    const files = await sourceFilesApi.listProjectFiles(user.projectID);
    for (const file of files.data) {
      data.push({
        id: file.data.id,
        type: file.data.type,
        parent_id: file.data.directoryId ?? '0',
        node_type: '1',
        name: file.data.name,
        title: file.data.title,
      });
    }
    return res.send(data);
  } catch (err) {
    return res.status(err.code ?? 500).send(err.message);
  }
});

module.exports = router;
