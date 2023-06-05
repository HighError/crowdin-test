const https = require('https');
const fs = require('fs');

function downloadFile(path, link, token) {
  return new Promise((resolve, reject) => {
    const folderPath = `./temp${path.split('/').slice(0, -1).join('/')}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const file = fs.createWriteStream(`./temp/${path}`);
    https
      .get(link, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve({
            path: `./temp/${path}`,
            name: path,
          });
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = downloadFile;
