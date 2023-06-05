update();

async function login() {
  const projectID = await document.querySelector('#projectID').getValue();
  const token = await document.querySelector('#token').getValue();

  if (!projectID || !token) {
    return alert('Missing params!');
  }

  fetch('http://127.0.0.1:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ projectID, token }),
  })
    .then(function (res) {
      if (!res.ok) {
        return alert('Login Error');
      }
      update();
    })
    .catch((err) => alert(err.message));
}

async function update() {
  fetch('http://127.0.0.1:3000/status')
    .then(function (res) {
      if (res.status === 200) {
        window.location.href = '/';
      }
    })
    .catch(function () {});
}
