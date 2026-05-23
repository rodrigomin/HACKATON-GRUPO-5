let donorForms = JSON.parse(localStorage.getItem('vitaleite_donors') || '[]');

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

export function submitDonorForm() {
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

export function approveDoador(i) {
  donorForms[i].status = 'Aprovado';
  localStorage.setItem('vitaleite_donors', JSON.stringify(donorForms));
  refreshDonorTable();
}

export function clearDonorForm() {
  ['d-nome','d-datanascimento','d-telefone','d-localizacao','d-doenca','d-medicamento'].forEach(id => {
    const element = document.getElementById(id);
    if(element) element.value = '';
  });
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  const fileInput = document.getElementById('d-exames');
  if(fileInput) fileInput.value = '';
  const fileSelected = document.getElementById('files-selected');
  if(fileSelected) fileSelected.style.display = 'none';
}