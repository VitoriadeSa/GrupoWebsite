const dbName = "GreenHerbDB";

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Store para tarefas que foram feitas offline
      if (!db.objectStoreNames.contains('operacoes_pendentes')) {
        db.createObjectStore('operacoes_pendentes', { keyPath: 'id', autoIncrement: true });
      }
      // Cache de lotes para consulta offline
      if (!db.objectStoreNames.contains('lotes_cache')) {
        db.createObjectStore('lotes_cache', { keyPath: '_id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Erro ao abrir IDB");
  });
};

// Guardar uma tarefa quando não há rede
async function salvarTarefaOffline(tarefa) {
  const db = await initDB();
  const tx = db.transaction('operacoes_pendentes', 'readwrite');
  tx.objectStore('operacoes_pendentes').add({ ...tarefa, timestamp: new Date() });
  return tx.complete;
}