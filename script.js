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
    // (on pourrait ajouter une logique pour n'autoriser que les blancs ou les noirs à jouer)
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

    // Si le mouvement est illégal, chess.js retourne 'null'.
    // On retourne 'snapback' pour que chessboard.js annule le mouvement visuellement.
    if (move === null) {
        return 'snapback';
    }
}

/**
 * Fonction appelée après qu'une pièce soit revenue à sa place (après un coup illégal).
 * On s'assure que la position visuelle de l'échiquier correspond bien à la position
 * logique enregistrée dans notre variable 'game'.
 */
function onSnapEnd() {
    board.position(game.fen());
}


// --- CONFIGURATION DE L'ÉCHIQUIER ---

// C'est ici qu'on définit toutes les options de notre échiquier visuel.
const config = {
    draggable: true,                                     // Rend les pièces déplaçables.
    position: 'start',                                   // Affiche la position de départ.
    pieceTheme: 'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/img/chesspieces/wikipedia/{piece}.png', // URL pour les images des pièces.
    onDragStart: onDragStart,                            // Fonction à appeler quand on prend une pièce.
    onDrop: onDrop,                                      // Fonction à appeler quand on relâche une pièce.
    onSnapEnd: onSnapEnd                                 // Fonction à appeler après l'animation d'un mouvement illégal.
};

// --- INITIALISATION ---

// On crée l'échiquier dans la <div id="monEchiquier"> avec la configuration définie ci-dessus.
board = Chessboard('monEchiquier', config);
