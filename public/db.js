// --- Início do Código para IndexedDB ---

const DB_NAME = 'sportfree_music_db';
const DB_VERSION = 1;
const STORE_NAME = 'downloaded_music'; // Corrigido: 'downloaded_music'

let db; // Variável para armazenar a instância do banco de dados

/**
 * Abre (ou cria) o banco de dados IndexedDB e a object store.
 * @returns {Promise<IDBDatabase>} Uma Promise que resolve com a instância do DB.
 */
export function openSportfreeDb() { // Adicionado 'export'
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = function(event) {
            console.error('Erro ao abrir IndexedDB:', event.target.errorCode);
            reject(event.target.errorCode);
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            console.log('IndexedDB "sportfree_music_db" aberto com sucesso!');
            resolve(db);
        };

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            // Corrigido: objectStoreNames com 'o' minúsculo
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                console.log('Object Store "downloaded_music" criada.'); // Corrigido: 'downloaded_music'
            }
        };
    });
}

/**
 * Adiciona ou atualiza metadados de uma música no IndexedDB.
 * @param {Object} musicData - Os dados da música a serem salvos (deve conter 'id').
 * @returns {Promise<void>} Uma Promise que resolve quando a operação é concluída.
 */
export async function addMusicToDownloadedDb(musicData) { // Adicionado 'export'
    if (!db) {
        await openSportfreeDb();
    }
    // Corrigido: 'transaction'
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.put(musicData);

        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            console.error('Erro ao adicionar música ao IndexedDB:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

/**
 * Obtém os metadados de uma música específica do IndexedDB.
 * @param {string} id - O ID da música a ser buscada.
 * @returns {Promise<Object|undefined>} Uma Promise que resolve com os dados da música ou undefined se não for encontrada.
 */
export async function getMusicFromDownloadedDb(id) { // Adicionado 'export'
    if (!db) {
        await openSportfreeDb();
    }
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.get(id);

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => {
            console.error('Erro ao buscar música no IndexedDB:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

/**
 * Obtém todos os metadados das músicas baixadas do IndexedDB.
 * @returns {Promise<Array<Object>>} Uma Promise que resolve com um array de objetos das músicas baixadas.
 */
export async function getAllDownloadedMusicFromDb() { // Adicionado 'export'
    if (!db) {
        await openSportfreeDb();
    }
    // Corrigido: 'transaction' e sintaxe da Promise
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => { // Parêntese correto aqui
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => {
            console.error('Erro ao obter todas as músicas do IndexedDB:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

/**
 * Remove os metadados de uma música do IndexedDB.
 * @param {string} id - O ID da música a ser removida.
 * @returns {Promise<void>} Uma Promise que resolve quando a operação é concluída.
 */
export async function removeMusicFromDownloadedDb(id) { // Adicionado 'export'
    if (!db) {
        await openSportfreeDb();
    }
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            console.error('Erro ao remover música do IndexedDB:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

// Inicializa o IndexedDB assim que o script é carregado ou quando o DOM estiver pronto
// É uma boa prática chamar isso em algum lugar no seu código principal para garantir que o DB esteja aberto
// Não se preocupe em exportar esta chamada, ela é executada automaticamente.
openSportfreeDb().catch(e => console.error("Falha ao inicializar Sportfree DB:", e));

// --- Fim do Código para IndexedDB ---