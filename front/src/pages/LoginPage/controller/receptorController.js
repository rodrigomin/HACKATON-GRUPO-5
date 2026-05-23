// ===== RECEPTOR REQUESTS =====
export function submitReceptorRequest() {
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

export function newReceptorRequest() {
  document.getElementById('receptor-form-card').style.display = 'block';
  document.getElementById('receptor-success-state').style.display = 'none';
  ['r-nome','r-data','r-cpf','r-telefone','r-obs'].forEach(id => {
    const element = document.getElementById(id);
    if(element) element.value = '';
  });
}

export function renderReceptorRequests() {
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

export function handleRequest(i, status) {
  receptorRequests[i].status = status;
  localStorage.setItem('vitaleite_receptor_requests', JSON.stringify(receptorRequests));
  renderReceptorRequests();
}

export function renderMyRequests() {
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