// --- INITIALISATION ET CONFIGURATION ---
let board = null;
const game = new Chess();
const boardElement = $('#monEchiquier');

const unicodePieces = {
    'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
    'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
};

// --- FONCTIONS ---

function renderUnicodePieces() {
    boardElement.find('.square-55d63').empty();

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = 'abcdefgh'[j] + (8 - i);
            const piece = game.get(square);

            if (piece) {
                const pieceSymbol = piece.color + piece.type.toUpperCase();
                const unicodeSymbol = unicodePieces[pieceSymbol];
                
                // === LA MODIFICATION EST ICI ===
                // On détermine la classe CSS en fonction de la couleur de la pièce ('w' ou 'b')
                const colorClass = piece.color === 'w' ? 'piece-blanche' : 'piece-noire';

                // On ajoute cette classe à la div que nous créons
                boardElement.find('.square-' + square)
                    .html(`<div class="piece-unicode ${colorClass}">${unicodeSymbol}</div>`);
            }
        }
    }
}


function onDrop(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) {
        renderUnicodePieces();
        return 'snapback';
    }

    renderUnicodePieces();
}

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    boardElement.find('.square-' + source).empty();
}

function onSnapEnd() {
    renderUnicodePieces();
}

const config = {
    draggable: true,
    position: 'start',
    onDrop: onDrop,
    onDragStart: onDragStart,
    onSnapEnd: onSnapEnd,
};

// --- LANCEMENT ---
board = Chessboard('monEchiquier', config);
renderUnicodePieces();
