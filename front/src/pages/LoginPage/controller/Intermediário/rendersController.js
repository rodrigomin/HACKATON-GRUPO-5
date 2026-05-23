export function renderBatches() {
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
