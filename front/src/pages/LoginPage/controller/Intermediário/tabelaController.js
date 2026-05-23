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
