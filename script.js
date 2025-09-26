// --- INITIALISATION ET CONFIGURATION ---
let board = null;
const game = new Chess();
const boardElement = $('#monEchiquier'); // On garde une référence à notre div

// Dictionnaire pour faire le lien entre la notation (ex: 'wK') et le caractère Unicode ('♔')
const unicodePieces = {
    'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
    'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
};

// --- FONCTIONS ---

/**
 * Cette fonction va dessiner toutes les pièces sur l'échiquier.
 * On l'appellera à chaque fois que la position change.
 */
function renderUnicodePieces() {
    // On vide d'abord toutes les cases
    boardElement.find('.square-55d63').empty();

    // On parcourt chaque case de l'échiquier logique
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = 'abcdefgh'[j] + (8 - i);
            const piece = game.get(square);

            if (piece) {
                // Si une pièce existe sur cette case
                const pieceSymbol = piece.color + piece.type.toUpperCase(); // ex: 'w' + 'P' = 'wP'
                const unicodeSymbol = unicodePieces[pieceSymbol];
                
                // On trouve la div de la case et on y ajoute notre pièce Unicode
                boardElement.find('.square-' + square)
                    .html('<div class="piece-unicode">' + unicodeSymbol + '</div>');
            }
        }
    }
}


/**
 * Fonction appelée quand un utilisateur relâche une pièce sur une case.
 */
function onDrop(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    // Si le mouvement est illégal, on annule et on redessine pour être sûr
    if (move === null) {
        renderUnicodePieces(); // S'assure que rien n'a bougé visuellement
        return 'snapback';
    }

    // Si le mouvement est légal, on redessine tout l'échiquier
    renderUnicodePieces();
}

/**
 * Quand on commence à déplacer, on vide la case de départ pour simuler le "soulèvement"
 */
function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    // On efface temporairement la pièce de sa case d'origine
    boardElement.find('.square-' + source).empty();
}

/**
 * Si on annule un déplacement, la pièce retourne à sa place. On redessine tout.
 */
function onSnapEnd() {
    renderUnicodePieces();
}

// Configuration de l'échiquier
const config = {
    draggable: true,
    position: 'start', // Important pour la logique initiale de chess.js
    onDrop: onDrop,
    onDragStart: onDragStart,
    onSnapEnd: onSnapEnd,
    // On ne met PAS de 'pieceTheme'
};

// --- LANCEMENT ---
board = Chessboard('monEchiquier', config);

// On fait le premier dessin des pièces
renderUnicodePieces();
