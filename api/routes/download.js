const express = require('express');
const crowdin = require('@crowdin/crowdin-api-client');
const fs = require('fs-extra');

const getUserStatus = require('../src/getUserStatus');
const downloadFile = require('../src/downloadFile');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fileIDs = (req.query.fileIDs ?? '').split(',');

    if (!fileIDs) return res.status(400).send('Missing params');
    if (!Array.isArray(fileIDs)) return res.status(400).send('Invalid IDs');

    const user = await getUserStatus();
    const { sourceFilesApi } = new crowdin.default({ token: user.token });

    const files = [];

    await Promise.all(
      fileIDs.map(async (e) => {
        try {
          const fileData = await sourceFilesApi.getFile(user.projectID, e);
          const filePath = fileData.data.path;
          const fileDataURL = await sourceFilesApi.downloadFile(
            user.projectID,
            e,
          );
          const file = await downloadFile(
            filePath,
            fileDataURL.data.url,
            user.token,
          );
          files.push(file);
        } catch (err) {
          console.error(err.message);
        }
      }),
    );

    await res.zip({ files });
    await fs.emptyDir('temp');
  } catch (err) {
    res.status(err.code ?? 500).send(err.message);
  }
});

module.exports = router;
