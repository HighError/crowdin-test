const crowdin = require('@crowdin/crowdin-api-client');

async function getFileData(token, projectID, fileID) {
  try {
    const { sourceFilesApi } = new crowdin.default({ token });
    const file = await sourceFilesApi.getFile(projectID, fileID);
    return file.data;
  } catch (err) {
    return null;
  }
}

module.exports = getFileData;
