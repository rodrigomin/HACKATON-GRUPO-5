// ===== MILK BATCHES =====

let milkBatches = JSON.parse(localStorage.getItem('vitaleite_batches') || '[]');

export function openBatchModal() {
    document.getElementById('batch-modal').classList.add('open');
    // Set defaults
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('b-retirada').value = today;
    document.getElementById('b-id').value = `LEVA-${Date.now().toString().slice(-6)}`;
  }

export function closeBatchModal() {
    document.getElementById('batch-modal').classList.remove('open');
    ['b-id','b-temp','b-retirada','b-uso','b-local','b-destino'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }

  document.getElementById('batch-modal').addEventListener('click', function(e) {
    if(e.target === this) closeBatchModal();
  });

export function saveBatch() {
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

export function deleteBatch(i) {
    if(!confirm('Remover esta leva?')) return;
    milkBatches.splice(i, 1);
    localStorage.setItem('vitaleite_batches', JSON.stringify(milkBatches));
    renderBatches();
  }



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