// Variable globale pour l'échiquier (board) et la logique du jeu (game)
let board = null;
const game = new Chess(); // On crée une instance de la logique du jeu avec la bibliothèque Chess.js

// --- FONCTIONS DE GESTION DES MOUVEMENTS ---

/**
 * Fonction appelée quand un utilisateur commence à déplacer une pièce.
 */
function onDragStart(source, piece, position, orientation) {
    // Ne pas autoriser le déplacement des pièces si la partie est terminée
    if (game.game_over()) {
        return false;
    }

    // On autorise le déplacement de n'importe quelle couleur pour le moment
    return true;
}

/**
 * Fonction appelée quand un utilisateur relâche une pièce sur une case.
 */
function onDrop(source, target) {
    // Essayer de faire le mouvement dans la logique du jeu (avec chess.js)
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: Pour les promotions de pion, on choisit automatiquement une Dame (q)
    });

    // Si le mouvement est illégal, on annule le mouvement visuellement.
    if (move === null) {
        return 'snapback';
    }
}

/**
 * Fonction appelée après qu'une pièce soit revenue à sa place (après un coup illégal).
 */
function onSnapEnd() {
    board.position(game.fen());
}


// --- CONFIGURATION DE L'ÉCHIQUIER ---

const config = {
    draggable: true,
    position: 'start',
    // Assurez-vous que cette ligne commence bien par "https://"
    pieceTheme: 'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/img/chesspieces/wikipedia/{piece}.png',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

// --- INITIALISATION ---

// On crée l'échiquier dans la <div id="monEchiquier"> avec la configuration définie ci-dessus.
board = Chessboard('monEchiquier', config);
