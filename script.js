// --- INITIALISATION ET CONFIGURATION ---
let board = null;
const game = new Chess();
const boardElement = $('#monEchiquier');
const historyElement = $('#historiqueCoups'); // NOUVEAU : référence à l'encart historique

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
                const colorClass = piece.color === 'w' ? 'piece-blanche' : 'piece-noire';
                boardElement.find('.square-' + square)
                    .html(`<div class="piece-unicode ${colorClass}">${unicodePieces[piece.color + piece.type.toUpperCase()]}</div>`);
            }
        }
    }
}

// NOUVELLE FONCTION pour mettre à jour l'historique
function updateHistory() {
    const moves = game.history();
    let historyHtml = '';

    for (let i = 0; i < moves.length; i += 2) {
        const moveNumber = (i / 2) + 1;
        const whiteMove = moves[i];
        const blackMove = moves[i + 1] ? moves[i + 1] : ''; // Gère le cas où le coup noir n'a pas encore été joué

        historyHtml += `<div class="move-pair">${moveNumber}. ${whiteMove} ${blackMove}</div>`;
    }

    historyElement.html(historyHtml);
    // Fait défiler l'historique vers le bas pour toujours voir le dernier coup
    historyElement.scrollTop(historyElement[0].scrollHeight);
}

// Fonctions du Drag and Drop (revenues à la normale)
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
    updateHistory(); // ON MET À JOUR L'HISTORIQUE APRÈS UN COUP LÉGAL
}

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    boardElement.find('.square-' + source).empty();
}

function onSnapEnd() {
    renderUnicodePieces();
}

const config = {
    draggable: true, // On est bien en drag and drop
    position: 'start',
    onDrop: onDrop,
    onDragStart: onDragStart,
    onSnapEnd: onSnapEnd,
};

// --- LANCEMENT ---
board = Chessboard('monEchiquier', config);
renderUnicodePieces();
