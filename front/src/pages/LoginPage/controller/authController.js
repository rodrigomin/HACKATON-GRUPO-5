// ===== LOGIN =====
function selectRole(btn, role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentRole = role;
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').style.display = 'none';
}

function doLogin() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  const cred = CREDENTIALS[currentRole];
  if (user === cred.user && pass === cred.pass) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-shell').style.display = 'block';
    setupAppShell(currentRole, user);
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}