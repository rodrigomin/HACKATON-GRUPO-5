import { selectRole, doLogin } from './controller/authController'


// ===== STATE =====
  let currentRole = 'doador';
  let donorForms = JSON.parse(localStorage.getItem('vitaleite_donors') || '[]');
  let milkBatches = JSON.parse(localStorage.getItem('vitaleite_batches') || '[]');
  let receptorRequests = JSON.parse(localStorage.getItem('vitaleite_receptor_requests') || '[]');

  const CREDENTIALS = {
    doador: { user: 'Doador', pass: 'Doador123' },
    intermediario: { user: 'Intermediario', pass: 'Intermediario123' },
    receptor: { user: 'Receptor', pass: 'Receptor123' }
  };

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

  document.getElementById('login-pass').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  document.getElementById('login-user').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });

  function setupAppShell(role, user) {
    const avatars = { doador: '🤱', intermediario: '🏥', receptor: '👶' };
    const labels = { doador: 'Doador', intermediario: 'Intermediário', receptor: 'Receptor' };

    document.getElementById('user-avatar').textContent = avatars[role];
    document.getElementById('user-name-display').textContent = user;
    document.getElementById('role-badge-display').textContent = labels[role];

    document.getElementById('donor-tabs').style.display = role === 'doador' ? 'flex' : 'none';
    document.getElementById('inter-tabs').style.display = role === 'intermediario' ? 'flex' : 'none';
    document.getElementById('receptor-tabs').style.display = role === 'receptor' ? 'flex' : 'none';

    // Show first panel
    document.querySelectorAll('.panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });

    if(role === 'doador') {
      showPanel('panel-donor-formulario');
    } else if(role === 'intermediario') {
      showPanel('panel-inter-respostas');
      refreshDonorTable();
    } else if(role === 'receptor') {
      showPanel('panel-receptor-solicitar');
    }
  }

  function showPanel(id) {
    document.querySelectorAll('.panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });
    const panel = document.getElementById(id);
    if(panel) { panel.style.display = 'block'; panel.classList.add('active'); }
  }

  function doLogout() {
    document.getElementById('login-page').style.display = 'grid';
    document.getElementById('app-shell').style.display = 'none';
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    document.getElementById('login-error').style.display = 'none';
  }

  // ===== TABS =====
  function switchTab(role, panelKey, btn) {
    const tabGroup = document.getElementById(role === 'inter' ? 'inter-tabs' : role+'-tabs');
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
  function refreshDonorTable() {
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

  // ===== MILK BATCHES =====
  function openBatchModal() {
    document.getElementById('batch-modal').classList.add('open');
    // Set defaults
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('b-retirada').value = today;
    document.getElementById('b-id').value = `LEVA-${Date.now().toString().slice(-6)}`;
  }

  function closeBatchModal() {
    document.getElementById('batch-modal').classList.remove('open');
    ['b-id','b-temp','b-retirada','b-uso','b-local','b-destino'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }

  document.getElementById('batch-modal').addEventListener('click', function(e) {
    if(e.target === this) closeBatchModal();
  });

  function saveBatch() {
    const id = document.getElementById('b-id').value.trim();
    const temp = document.getElementById('b-temp').value;
    const retirada = document.getElementById('b-retirada').value;
    const uso = document.getElementById('b-uso').value;
    const local = document.getElementById('b-local').value.trim();
    const destino = document.getElementById('b-destino').value.trim();

    if(!id || !temp || !retirada || !local) {
      alert('Preencha os campos obrigatórios: ID, temperatura, data de retirada e localização.');
      return;
    }

    const batch = { id, temp: parseFloat(temp), retirada, uso, local, destino: destino || 'Não definido', createdAt: new Date().toLocaleDateString('pt-BR') };
    milkBatches.push(batch);
    localStorage.setItem('vitaleite_batches', JSON.stringify(milkBatches));
    closeBatchModal();
    renderBatches();
  }

  function deleteBatch(i) {
    if(!confirm('Remover esta leva?')) return;
    milkBatches.splice(i, 1);
    localStorage.setItem('vitaleite_batches', JSON.stringify(milkBatches));
    renderBatches();
  }

  function renderBatches() {
    milkBatches = JSON.parse(localStorage.getItem('vitaleite_batches') || '[]');
    const grid = document.getElementById('batches-grid');

    if(milkBatches.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="es-icon">🧊</div><h3>Nenhuma leva registrada</h3><p>Clique em "Nova Leva" para adicionar um registro de leite recebido.</p></div>`;
      return;
    }

    grid.innerHTML = milkBatches.map((b, i) => `
      <div class="batch-card">
        <span class="batch-id">${b.id}</span>
        <div class="batch-temp">${b.temp}°<span>C</span></div>
        <div class="batch-info-row">
          <div class="batch-info-item"><span>📍 Localização</span><strong>${b.local}</strong></div>
          <div class="batch-info-item"><span>🗓️ Retirada</span><strong>${b.retirada ? new Date(b.retirada+'T12:00:00').toLocaleDateString('pt-BR') : '—'}</strong></div>
          <div class="batch-info-item"><span>⏳ Validade / Uso</span><strong>${b.uso ? new Date(b.uso+'T12:00:00').toLocaleDateString('pt-BR') : '—'}</strong></div>
          <div class="batch-info-item"><span>👶 Destinado a</span><strong>${b.destino}</strong></div>
        </div>
        <div class="batch-card-footer">
          <span style="font-size:0.78rem;color:var(--gray)">Registrado em ${b.createdAt}</span>
          <button class="btn-delete-batch" onclick="deleteBatch(${i})">✕ Remover</button>
        </div>
      </div>
    `).join('');
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

  function renderReceptorRequests() {
    receptorRequests = JSON.parse(localStorage.getItem('vitaleite_receptor_requests') || '[]');
    const list = document.getElementById('receptor-requests-list');

    if(receptorRequests.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="es-icon">📤</div><h3>Nenhum pedido recebido</h3><p>Quando receptores enviarem solicitações, elas aparecerão aqui para análise.</p></div>`;
      return;
    }

    list.innerHTML = receptorRequests.map((r, i) => `
      <div class="request-card">
        <div>
          <div class="req-name">${r.nome}</div>
          <div class="req-details">CPF: ${r.cpf} &nbsp;·&nbsp; Tel: ${r.telefone} &nbsp;·&nbsp; Nasc.: ${r.dataNasc ? new Date(r.dataNasc+'T12:00:00').toLocaleDateString('pt-BR') : '—'} &nbsp;·&nbsp; Enviado: ${r.timestamp}</div>
          ${r.obs ? `<div class="req-details" style="margin-top:4px;font-style:italic">"${r.obs}"</div>` : ''}
        </div>
        <div class="req-actions">
          ${r.status === 'Pendente' ? `
            <button class="btn-approve" onclick="handleRequest(${i},'Aprovado')">✓ Aprovar</button>
            <button class="btn-deny" onclick="handleRequest(${i},'Negado')">✕ Negar</button>
          ` : `<span class="tag ${r.status === 'Aprovado' ? 'tag-enviado' : 'tag-nao'}">${r.status}</span>`}
        </div>
      </div>
    `).join('');
  }

  function handleRequest(i, status) {
    receptorRequests[i].status = status;
    localStorage.setItem('vitaleite_receptor_requests', JSON.stringify(receptorRequests));
    renderReceptorRequests();
  }

  function renderMyRequests() {
    receptorRequests = JSON.parse(localStorage.getItem('vitaleite_receptor_requests') || '[]');
    const list = document.getElementById('my-requests-list');

    if(receptorRequests.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="es-icon">📋</div><h3>Nenhum pedido enviado</h3><p>Seus pedidos enviados aparecerão aqui.</p></div>`;
      return;
    }

    list.innerHTML = receptorRequests.map(r => `
      <div class="request-card">
        <div>
          <div class="req-name">Pedido #${r.id.toString().slice(-4)}</div>
          <div class="req-details">Enviado em ${r.timestamp}</div>
        </div>
        <span class="tag ${r.status === 'Aprovado' ? 'tag-enviado' : r.status === 'Negado' ? 'tag-nao' : 'tag-pendente'}">${r.status}</span>
      </div>
    `).join('');
  }

  // CPF mask
  document.getElementById('r-cpf').addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'').slice(0,11);
    if(v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/,'$1.$2.$3-$4');
    else if(v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/,'$1.$2.$3');
    else if(v.length > 3) v = v.replace(/(\d{3})(\d+)/,'$1.$2');
    this.value = v;
  });