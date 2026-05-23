import { setupAppShell } from "../pages/LoginPage/controller/panelController.js";


// ===== LOGIN =====
let currentRole = '';

const dadosSalvos = localStorage.getItem('vitaleite_credentials');

export const CREDENTIALS = dadosSalvos 
    ? JSON.parse(dadosSalvos)
    : {                       
        doador: [{ user: 'Doador', pass: 'Doador123' }],
        intermediario: [{ user: 'Intermediario', pass: 'Intermediario123' }],
        receptor: [{ user: 'Receptor', pass: 'Receptor123' }]
}


export function selectRole(btn, role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  currentRole = role;
  console.log("Role selecionada:", currentRole);
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').style.display = 'none';
}

export function doLogin() {
  console.log("Tentando login com a role:", currentRole);
  if (!currentRole) {
    alert("Por favor, selecione um perfil antes de entrar.");
    document.getElementById('norole-error').style.display = 'block'
    return;
  } else {
    document.getElementById('norole-error').style.display = 'none'
  }
  
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  const cred = CREDENTIALS[currentRole];

  for (let i = 0; i <= cred.length; i++) {
    if (user === cred[i].user && pass === cred[i].pass) {
      document.getElementById('login-page').style.display = 'none';
      document.getElementById('app-shell').style.display = 'block';
      setupAppShell(currentRole, user);
    } else {
      document.getElementById('login-error').style.display = 'block';
    }
  }
  
}

export function doLogout() {
  document.getElementById('login-page').style.display = 'grid';
  document.getElementById('app-shell').style.display = 'none';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').style.display = 'none';
}



export function cadastrarNovaCredencial(perfil, usuario, senha) {
    console.log(perfil)
    CREDENTIALS[perfil].push({
      'user': usuario,
      'pass': senha
})

    localStorage.setItem('bancodeleite_credentials', JSON.stringify(CREDENTIALS))

    console.log("Usuarios salvos", CREDENTIALS)
}