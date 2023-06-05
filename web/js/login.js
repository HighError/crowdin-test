update();

async function login() {
  const projectID = await document.querySelector('#projectID').getValue();
  const token = await document.querySelector('#token').getValue();

  if (!projectID || !token) {
    return alert('Missing params!');
  }

  await axios
    .post('http://127.0.0.1:3000/login', {
      projectID,
      token,
    })
    .then(() => update())
    .catch((err) => {
      if (err.response.status === 401) {
        return alert('Invalid Token');
      }
      if (err.response.status === 404) {
        return alert('Invalid ProjectID');
      }
      return alert(err.message);
    });
}

async function update() {
  await axios
    .get('http://127.0.0.1:3000/status')
    .then(() => (window.location.href = '/'))
    .catch(() => {});
}
