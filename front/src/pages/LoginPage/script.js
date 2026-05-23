import { selectRole, doLogin, doLogout } from './controller/authController.js'
import { openBatchModal, saveBatch, closeBatchModal, deleteBatch } from './controller/Intermediário/batchController.js';
import { renderBatches } from './controller/Intermediário/rendersController.js';

import { switchTab } from './controller/Intermediário/tabController.js';

import { setupAppShell, showPanel } from './controller/panelController.js'


// ===== STATE =====
  window.selectRole = selectRole;
  window.doLogin = doLogin;
  window.setupAppShell = setupAppShell;
  window.doLogout = doLogout;
  window.showPanel = showPanel;
  window.switchTab = switchTab;
  window.openBatchModal = openBatchModal;
  window.saveBatch = saveBatch;
  window.closeBatchModal = closeBatchModal;
  window.deleteBatch = deleteBatch;
  window.renderBatches = renderBatches;
  window.refreshDonorTable = refreshDonorTable;

  let currentRole = 'doador';
  let donorForms = JSON.parse(localStorage.getItem('vitaleite_donors') || '[]');
  let milkBatches = JSON.parse(localStorage.getItem('vitaleite_batches') || '[]');
  let receptorRequests = JSON.parse(localStorage.getItem('vitaleite_receptor_requests') || '[]');

  document.getElementById('login-pass').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  document.getElementById('login-user').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });


  // ===== DONOR FORM =====
  document.getElementById('d-exames').addEventListener('change', function(){
    const count = this.files.length;
    const el = document.getElementById('files-selected');
    if(count > 0) {
      el.textContent = `✓ ${count} arquivo(s) selecionado(s)`;
      el.style.display = 'block';
    } else { el.style.display = 'none'; }
  });

  function getRadioValue(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : 'Não informado';
  }

  function clearDonorForm() {
    ['d-nome','d-datanascimento','d-telefone','d-localizacao','d-doenca','d-medicamento'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.getElementById('d-exames').value = '';
    document.getElementById('files-selected').style.display = 'none';
  }

  function submitDonorForm() {
    const nome = document.getElementById('d-nome').value.trim();
    const data = document.getElementById('d-datanascimento').value;
    const tel = document.getElementById('d-telefone').value.trim();
    const local = document.getElementById('d-localizacao').value.trim();

    if(!nome || !data || !tel || !local) {
      alert('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    const entry = {
      id: Date.now(),
      nome,
      dataNasc: data,
      telefone: tel,
      localizacao: local,
      doenca: document.getElementById('d-doenca').value.trim() || 'Nenhuma',
      medicamento: document.getElementById('d-medicamento').value.trim() || 'Nenhum',
      alcool: getRadioValue('alcool'),
      amamenta: getRadioValue('amamenta'),
      exames: document.getElementById('d-exames').files.length > 0 ? `${document.getElementById('d-exames').files.length} arquivo(s)` : 'Nenhum',
      status: 'Pendente',
      timestamp: new Date().toLocaleDateString('pt-BR')
    };

    donorForms.push(entry);
    localStorage.setItem('vitaleite_donors', JSON.stringify(donorForms));

    document.getElementById('donor-form-card').style.display = 'none';
    document.getElementById('donor-success-state').style.display = 'block';
  }

  // ===== DONOR TABLE =====
  export function refreshDonorTable() {
    donorForms = JSON.parse(localStorage.getItem('vitaleite_donors') || '[]');
    const tbody = document.getElementById('donor-responses-tbody');
    const table = document.getElementById('donor-responses-table');
    const empty = document.getElementById('donor-empty-state');

    document.getElementById('stat-total').textContent = donorForms.length;
    document.getElementById('stat-pendentes').textContent = donorForms.filter(d=>d.status==='Pendente').length;
    document.getElementById('stat-aprovados').textContent = donorForms.filter(d=>d.status==='Aprovado').length;

    if(donorForms.length === 0) {
      table.style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';
    table.style.display = 'table';
    tbody.innerHTML = '';

    donorForms.forEach((d, i) => {
      const statusTag = d.status === 'Aprovado' ? 'tag-sim' : 'tag-pendente';
      tbody.innerHTML += `
        <tr>
          <td><strong>${d.nome}</strong></td>
          <td>${d.dataNasc ? new Date(d.dataNasc+'T12:00:00').toLocaleDateString('pt-BR') : '—'}</td>
          <td>${d.localizacao}</td>
          <td>${d.telefone}</td>
          <td>${d.doenca.length > 30 ? d.doenca.substring(0,30)+'...' : d.doenca}</td>
          <td>${d.medicamento.length > 25 ? d.medicamento.substring(0,25)+'...' : d.medicamento}</td>
          <td>${d.alcool}</td>
          <td>${d.exames}</td>
          <td>
            <span class="tag ${statusTag}">${d.status}</span>
            ${d.status === 'Pendente' ? `<button style="margin-left:6px;background:var(--success);color:white;border:none;border-radius:6px;padding:3px 8px;cursor:pointer;font-size:0.75rem;font-family:'DM Sans',sans-serif" onclick="approveDoador(${i})">✓</button>` : ''}
          </td>
        </tr>`;
    });
  }

  function approveDoador(i) {
    donorForms[i].status = 'Aprovado';
    localStorage.setItem('vitaleite_donors', JSON.stringify(donorForms));
    refreshDonorTable();
  }

  


  // ===== RECEPTOR REQUESTS =====
  function submitReceptorRequest() {
    const nome = document.getElementById('r-nome').value.trim();
    const data = document.getElementById('r-data').value;
    const cpf = document.getElementById('r-cpf').value.trim();
    const tel = document.getElementById('r-telefone').value.trim();

    if(!nome || !data || !cpf || !tel) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const req = {
      id: Date.now(),
      nome, dataNasc: data, cpf, telefone: tel,
      obs: document.getElementById('r-obs').value.trim(),
      status: 'Pendente',
      timestamp: new Date().toLocaleDateString('pt-BR')
    };

    receptorRequests.push(req);
    localStorage.setItem('vitaleite_receptor_requests', JSON.stringify(receptorRequests));

    document.getElementById('receptor-form-card').style.display = 'none';
    document.getElementById('receptor-success-state').style.display = 'block';
  }

  function newReceptorRequest() {
    document.getElementById('receptor-form-card').style.display = 'block';
    document.getElementById('receptor-success-state').style.display = 'none';
    ['r-nome','r-data','r-cpf','r-telefone','r-obs'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }

  function handleRequest(i, status) {
    receptorRequests[i].status = status;
    localStorage.setItem('vitaleite_receptor_requests', JSON.stringify(receptorRequests));
    renderReceptorRequests();
  }

  

  // CPF mask
  document.getElementById('r-cpf').addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'').slice(0,11);
    if(v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/,'$1.$2.$3-$4');
    else if(v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/,'$1.$2.$3');
    else if(v.length > 3) v = v.replace(/(\d{3})(\d+)/,'$1.$2');
    this.value = v;
  });