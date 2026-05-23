// ===== LOGIN =====
let currentRole = ''
const CREDENTIALS = {
    doador: { user: 'Doador', pass: 'Doador123' },
    intermediario: { user: 'Intermediario', pass: 'Intermediario123' },
    receptor: { user: 'Receptor', pass: 'Receptor123' }
};

export function selectRole(btn, role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  currentRole = role;
  console.log(currentRole);
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').style.display = 'none';
}

export function doLogin() {
    console.log(currentRole)
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

export function doLogout() {
    document.getElementById('login-page').style.display = 'grid';
    document.getElementById('app-shell').style.display = 'none';
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    document.getElementById('login-error').style.display = 'none';
  }