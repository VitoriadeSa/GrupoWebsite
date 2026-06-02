// Configuração do Banco de Dados Local (IndexedDB)
const DB_NAME = 'GreenHerbDB';
const DB_VERSION = 1;

const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);

dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    // Store para cache de dados da API (Lotes ativos)
    db.createObjectStore('lotes_cache', { keyPath: '_id' });
    // Store para tarefas criadas offline que aguardam sincronização
    db.createObjectStore('sync_queue', { keyPath: 'tempId', autoIncrement: true });
};

// Função para guardar o Token (LocalStorage)
function saveAuth(token, userProfile) {
    localStorage.setItem('gh_token', token);
    localStorage.setItem('gh_user', JSON.stringify(userProfile));
}

// Função para guardar uma tarefa (Resiliência Offline)
async function registrarTarefaNoBrowser(tarefa) {
    const db = await new Promise(res => dbRequest.onsuccess = () => res(dbRequest.result));
    const tx = db.transaction('sync_queue', 'readwrite');
    
    // Adiciona flag para sabermos que é um dado local
    tarefa.syncStatus = 'pending';
    tarefa.createdAt = new Date().toISOString();
    
    tx.objectStore('sync_queue').add(tarefa);
    console.log("Dados guardados localmente no IndexedDB.");
}