/// <reference lib="webworker" />

let engine: any;

async function initializeStockfish() {
  if (engine) return;

  try {
    // CORRECTION : On utilise le CDN jsDelivr, qui est mieux configuré pour le CORS
    const STOCKFISH_VERSION = '16.0.0';
    const CDN_URL = `https://cdn.jsdelivr.net/npm/stockfish@${STOCKFISH_VERSION}/stockfish.js`;

    const stockfishModule = await import(CDN_URL);
    const Stockfish = stockfishModule.default;

    engine = await Stockfish({
        // On indique aussi au moteur de chercher ses fichiers .wasm sur le même CDN
        locateFile: (path: string) => `https://cdn.jsdelivr.net/npm/stockfish@${STOCKFISH_VERSION}/${path}`,
    });
    
    engine.addMessageListener((message: string) => {
      self.postMessage(message);
    });
    
    self.postMessage('ready'); // Signale que le moteur est prêt
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Stockfish depuis le CDN:", error);
    self.postMessage("error_init"); // Envoie un message d'erreur à l'app principale
  }
}

self.onmessage = async (event: MessageEvent) => {
  // On s'assure que l'initialisation est terminée avant toute commande
  await initializeStockfish();
  
  if (engine) {
    engine.postMessage(event.data);
  }
};