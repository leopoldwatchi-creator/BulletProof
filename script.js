// Variable globale pour l'échiquier et la logique du jeu
let board = null;
const game = new Chess(); // On crée une instance de la logique du jeu

// --- FONCTIONS DE GESTION DES MOUVEMENTS ---

// Appelé quand une pièce est "soulevée"
function onDragStart(source, piece, position, orientation) {
    // Ne pas autoriser le déplacement des pièces si la partie est terminée
    if (game.game_over()) return false;

    // Pour l'instant, on autorise le déplacement de n'importe quelle couleur.
    return true;
}

// Appelé quand une pièce est "relâchée" sur une case
function onDrop(source, target) {
    // Essayer de faire le mouvement dans la logique du jeu
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: on promeut toujours en Dame pour l'instant
    });

    // Si le mouvement est illégal, on "snapback" la pièce à sa position d'origine
    if (move === null) return 'snapback';
}

// Appelé à la fin d'une animation de "snap" (quand un coup illégal est joué)
// Met à jour la position FEN de l'échiquier pour qu'elle corresponde à la logique du jeu.
function onSnapEnd() {
    board.position(game.fen());
}


// --- CONFIGURATION DE L'ÉCHIQUIER ---

const config = {
    draggable: true,
    position: 'start',
    // === LA LIGNE MODIFIÉE CI-DESSOUS ===
    // Au lieu d'un chemin local, on utilise une URL complète vers les images des pièces.
    pieceTheme: 'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/img/chesspieces/wikipedia/{piece}.png',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

// Initialisation de l'échiquier
board = Chessboard('monEchiquier', config);
