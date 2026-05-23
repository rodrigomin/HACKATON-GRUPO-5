

export function switchTab(role, panelKey, btn) {
    
    const tabGroup = document.getElementById(role === 'inter' ? 'inter-tabs' : role+'-tabs');
    tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const panelId = `panel-${role}-${panelKey}`;
    showPanel(panelId);

    if(panelKey === 'respostas') refreshDonorTable();
    if(panelKey === 'leites') renderBatches(); /* SOU O PROBLEMA */
    if(panelKey === 'pedidos') renderReceptorRequests();
    if(panelKey === 'meuspedidos') renderMyRequests();
  }