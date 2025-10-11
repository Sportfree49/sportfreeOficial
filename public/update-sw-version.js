// update-sw-version.js

const fs = require('fs');
const path = require('path');

const serviceWorkerPath = path.join(__dirname, 'serviceWorker.js');
const newVersion = `v${new Date().getTime()}`; // Gera uma versão baseada no timestamp atual

fs.readFile(serviceWorkerPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler serviceWorker.js:', err);
        return;
    }

    // Regex para encontrar a linha const CACHE_STATIC_NAME = 'sportfree-static-vX';
    const regex = /const CACHE_STATIC_NAME = 'sportfree-static-v(\d+|v\d+\.\d+)';/; // Ajustado para pegar vX ou vX.Y
    const replacement = `const CACHE_STATIC_NAME = 'sportfree-static-${newVersion}';`;

    if (data.match(regex)) {
        const updatedContent = data.replace(regex, replacement);

        fs.writeFile(serviceWorkerPath, updatedContent, 'utf8', (err) => {
            if (err) {
                console.error('Erro ao escrever serviceWorker.js atualizado:', err);
                return;
            }
            console.log(`[Script] serviceWorker.js atualizado para ${newVersion}`);
        });
    } else {
        console.error('[Script] Não foi possível encontrar a linha CACHE_STATIC_NAME para atualizar no serviceWorker.js.');
        console.log('Por favor, certifique-se de que a linha existe e está no formato esperado: const CACHE_STATIC_NAME = \'sportfree-static-vX\';');
    }
});