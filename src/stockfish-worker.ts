// Fichier : src/stockfish-worker.ts

import stockfish from 'stockfish';

let engine: any;

// Fonction pour initialiser le moteur
async function initializeStockfish() {
  if (engine) return; 
  engine = await stockfish(); 
  engine.addMessageListener((message: string) => {
    // Renvoie les messages du moteur à l'application principale
    self.postMessage(message);
  });
}

// Écoute les commandes venant de l'application principale
self.onmessage = async (event: MessageEvent) => {
  await initializeStockfish(); 
  engine.postMessage(event.data);
};
