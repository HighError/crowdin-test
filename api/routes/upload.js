const express = require('express');
const crowdin = require('@crowdin/crowdin-api-client');

const getUserStatus = require('../src/getUserStatus');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { folderID, file, fileName } = req.body;
    if (!folderID || !file || !fileName) {
      return res.status(400).send('Missing params!');
    }
    const user = await getUserStatus();
    const { uploadStorageApi, sourceFilesApi } = new crowdin.default({
      token: user.token,
    });

    const storage = await uploadStorageApi.addStorage(fileName, file);
    const fileOptions = {
      storageId: +storage.data.id,
      name: fileName,
    };
    if (folderID != 0) {
      fileOptions.directoryId = +folderID;
    }
    await sourceFilesApi.createFile(user.projectID, fileOptions);

    return res.end();
  } catch (err) {
    console.log(err);
    return res.status(err.code ?? 500).send(err.message);
  }
});

module.exports = router;
