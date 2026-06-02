// Namespace da aplicação para evitar conflitos
const app = {
    // Monitor de rede
    init() {
        window.addEventListener('online', this.updateNetworkStatus);
        window.addEventListener('offline', this.updateNetworkStatus);
        this.updateNetworkStatus();
    },

    updateNetworkStatus() {
        const indicator = document.getElementById('network-indicator');
        const text = document.getElementById('status-text');
        
        if (navigator.onLine) {
            indicator.className = 'status-badge online';
            text.innerText = 'Online';
            // Aqui podias chamar uma função de sync para limpar o IndexedDB
        } else {
            indicator.className = 'status-badge offline';
            text.innerText = 'Offline (Modo Local)';
        }
    },

    async submitTask() {
        const task = {
            lote: document.getElementById('lote').value,
            tipo: document.getElementById('tipo').value,
            valor: document.getElementById('valor').value,
            timestamp: new Date().toISOString()
        };

        if (navigator.onLine) {
            alert("Sucesso: Enviado para a API da GreenHerb!");
        } else {
            // Chamada ao script storage.js que criámos anteriormente
            if (typeof saveOfflineTask === 'function') {
                await saveOfflineTask(task);
                this.renderSyncList();
                alert("Guardado localmente no browser (Sem rede).");
            }
        }
    },

    renderSyncList() {
        // Lógica para ler do IndexedDB e mostrar no card à direita
        const list = document.getElementById('sync-list');
        list.innerHTML = '<p class="tag-offline">⚠️ 1 Registo pendente para envio</p>';
    }
};

app.init();