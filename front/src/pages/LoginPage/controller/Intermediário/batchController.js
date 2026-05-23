// ===== MILK BATCHES =====
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


