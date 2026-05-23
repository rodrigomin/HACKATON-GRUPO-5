import { selectRole, doLogin, doLogout } from '../../controller/authController.js'
import { closeBatchModal, deleteBatch, openBatchModal, renderBatches, saveBatch } from './controller/batchController.js';
import { approveDoador, clearDonorForm, refreshDonorTable, submitDonorForm } from './controller/donorController.js';
import { setupAppShell, showPanel } from './controller/panelController.js'
import { handleRequest, newReceptorRequest } from './controller/receptorController.js';
import { renderReceptorRequests } from './controller/requestController.js';


// ===== STATE =====

let donorForms = JSON.parse(localStorage.getItem('vitaleite_donors') || '[]');
let milkBatches = JSON.parse(localStorage.getItem('vitaleite_batches') || '[]');
let receptorRequests = JSON.parse(localStorage.getItem('vitaleite_receptor_requests') || '[]');


function switchTab(role, panelKey, btn) { /* PRECISA FICAR AQUI */
    const tabGroup = document.getElementById(role === 'inter' ? 'inter-tabs' : role+'-tabs');
    if (!tabGroup) return;
    
    tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const panelId = `panel-${role}-${panelKey}`;
    showPanel(panelId);

    if(panelKey === 'respostas') refreshDonorTable();
    if(panelKey === 'leites') renderBatches();
    if(panelKey === 'pedidos') renderReceptorRequests();
    if(panelKey === 'meuspedidos') renderMyRequests();
}

// ===== DONOR FORM =====
function getRadioValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : 'Não informado';
}



// ===== DOM INITIALIZATION (when DOM is ready) =====
document.addEventListener('DOMContentLoaded', function() {
  // File upload handler
  const fileInput = document.getElementById('d-exames');
  if(fileInput) {
    fileInput.addEventListener('change', function(){
      const count = this.files.length;
      const el = document.getElementById('files-selected');
      if(count > 0) {
        el.textContent = `✓ ${count} arquivo(s) selecionado(s)`;
        el.style.display = 'block';
      } else { el.style.display = 'none'; }
    });
  }

  // Password/Login input handlers
  const loginPass = document.getElementById('login-pass');
  const loginUser = document.getElementById('login-user');
  if(loginPass) loginPass.addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  if(loginUser) loginUser.addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });

  // Modal close on backdrop click
  const batchModal = document.getElementById('batch-modal');
  if(batchModal) {
    batchModal.addEventListener('click', function(e) {
      if(e.target === this) closeBatchModal();
    });
  }

  // CPF mask
  const cpfInput = document.getElementById('r-cpf');
  if(cpfInput) {
    cpfInput.addEventListener('input', function() {
      let v = this.value.replace(/\D/g,'').slice(0,11);
      if(v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/,'$1.$2.$3-$4');
      else if(v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/,'$1.$2.$3');
      else if(v.length > 3) v = v.replace(/(\d{3})(\d+)/,'$1.$2');
      this.value = v;
    });
  }
});

// ===== EXPORT ALL FUNCTIONS TO WINDOW =====
window.switchTab = switchTab;
window.selectRole = selectRole;
window.getRadioValue = getRadioValue;
window.clearDonorForm = clearDonorForm;
window.submitDonorForm = submitDonorForm;
window.refreshDonorTable = refreshDonorTable;
window.approveDoador = approveDoador;
window.openBatchModal = openBatchModal;
window.closeBatchModal = closeBatchModal;
window.saveBatch = saveBatch;
window.deleteBatch = deleteBatch;
window.renderBatches = renderBatches;
window.submitReceptorRequest = submitDonorForm;
window.newReceptorRequest = newReceptorRequest;
window.renderReceptorRequests = renderReceptorRequests;
window.handleRequest = handleRequest;
window.renderMyRequests = renderBatches;
window.doLogin = doLogin;
window.doLogout = doLogout;
