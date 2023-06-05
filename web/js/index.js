const crowdinFiles = document.querySelector('.files');
const select = document.querySelector('#folders-select');
document.querySelector('crowdin-dnd-upload').addEventListener('upload', upload);

update();

async function update() {
  crowdinFiles && crowdinFiles.setAttribute('is-loading', true);
  await axios.get('http://127.0.0.1:3000/status').catch((err) => {
    if (err.response.status === 401) {
      return (window.location.href = '/login.html');
    }
  });

  await axios
    .get('http://127.0.0.1:3000/data')
    .then((res) => {
      crowdinFiles && crowdinFiles.setFilesData(res.data);
      crowdinFiles && crowdinFiles.removeAttribute('is-loading');
    })
    .catch((err) => alert(`Error loaded data: ${err.message}`));

  await axios
    .get('http://127.0.0.1:3000/folders')
    .then((res) => {
      let html = '';
      res.data.map((e) => {
        html += `<option value="${e.id}">${e.name}</option>`;
      });
      select.innerHTML = html;
    })
    .catch((err) => {
      alert(`Error loaded folders: ${err.message}`);
    });
}

async function logout() {
  await axios
    .delete('http://127.0.0.1:3000/logout')
    .then(() => update())
    .catch((err) => alert(err.message));
}

async function download() {
  const selected = await crowdinFiles.getSelected();
  if (selected.length === 0) return;
  const fileIDs = selected.map((e) => e.id);

  window.location.href = `http://127.0.0.1:3000/download?fileIDs=${fileIDs.join(
    ',',
  )}`;
}

async function upload(e) {
  const folderID = (await select.getValue())[0];
  if (!folderID) {
    return alert("Fodler doesn't selected");
  }

  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader);
    const data = reader.result;
    axios
      .post('http://127.0.0.1:3000/upload', {
        folderID,
        file: data,
        fileName: e.detail[0].name,
      })
      .then(() => {
        alert('Complete upload');
        update();
      })
      .catch((err) => {
        alert(`Error upload: ${err.message}`);
      });
  };
  reader.onerror = function (e) {
    return alert('Error: ' + e.type);
  };

  reader.readAsText(e.detail[0]);
}
