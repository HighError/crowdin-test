const crowdinFiles = document.querySelector('.files');
const select = document.querySelector('#folders-select');
document.querySelector('crowdin-dnd-upload').addEventListener('upload', upload);

update();

async function update() {
  crowdinFiles && crowdinFiles.setAttribute('is-loading', true);
  fetch('http://127.0.0.1:3000/status')
    .then((res) => {
      if (res.status === 401) {
        window.location.href = '/login.html';
      }
    })
    .catch(() => {});
  fetch('http://127.0.0.1:3000/data')
    .then((res) => {
      res.json().then((data) => {
        crowdinFiles && crowdinFiles.setFilesData(data);
        crowdinFiles && crowdinFiles.removeAttribute('is-loading');
      });
    })
    .catch(() => {});
  fetch('http://127.0.0.1:3000/folders')
    .then((res) => {
      res.json().then((data) => {
        let html = '';
        data.map((e) => {
          html += `<option value="${e.id}">${e.name}</option>`;
        });
        select.innerHTML = html;
      });
    })
    .catch(() => {});
}

async function logout() {
  fetch('http://127.0.0.1:3000/logout', { method: 'DELETE' })
    .then((res) => {
      update();
    })
    .catch(() => {});
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
    fetch('http://127.0.0.1:3000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        folderID,
        file: data,
        fileName: e.detail[0].name,
      }),
    })
      .then((res) => {
        update();
        alert('ok!');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  reader.onerror = function (e) {
    return alert('Error : ' + e.type);
  };

  reader.readAsText(e.detail[0]);
}
