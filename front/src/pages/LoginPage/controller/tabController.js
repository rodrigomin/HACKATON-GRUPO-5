import { renderBatches } from '../Intermediario/leiteController.js'
import { refreshDonorTable } from './donorController.js';
import { renderMyRequests, renderReceptorRequests } from './requestController.js';

export function switchTab(role, panelKey, btn) {

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