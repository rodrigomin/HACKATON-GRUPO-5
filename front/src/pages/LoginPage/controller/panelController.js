export function setupAppShell(role, user) {
    console.log('chegou aqui')
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
      // Call refreshDonorTable if it exists
      if(typeof window.refreshDonorTable === 'function') {
        window.refreshDonorTable();
      }
    } else if(role === 'receptor') {
      showPanel('panel-receptor-solicitar');
    }
}

export function showPanel(id) {
    document.querySelectorAll('.panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });
    const panel = document.getElementById(id);
    if(panel) { panel.style.display = 'block'; panel.classList.add('active'); }
}