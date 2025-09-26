// --- INITIALISATION ET CONFIGURATION ---
let board = null;
const game = new Chess();
const boardElement = $('#monEchiquier');
const historyElement = $('#historiqueCoups');

// On stocke ici l'historique complet des coups avec les positions (FEN)
let fullHistory = [{ move: null, fen: 'start' }]; 
// Index du coup actuellement affiché
let viewIndex = 0;

const unicodePieces = {
    'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
    'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
};

// --- FONCTIONS ---

function renderUnicodePieces() {
    boardElement.find('.square-55d63').empty();
    const currentFen = fullHistory[viewIndex].fen;
    const tempGame = new Chess(currentFen);

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = 'abcdefgh'[j] + (8 - i);
            const piece = tempGame.get(square);
            if (piece) {
                const colorClass = piece.color === 'w' ? 'piece-blanche' : 'piece-noire';
                boardElement.find('.square-' + square)
                    .html(`<div class="piece-unicode ${colorClass}">${unicodePieces[piece.color + piece.type.toUpperCase()]}</div>`);
            }
        }
    }
}

function updateHistory() {
    let historyHtml = '';
    // On enlève le surlignage précédent avant de redessiner
    historyElement.find('span').removeClass('active-move');

    for (let i = 0; i < fullHistory.length - 1; i += 2) {
        const moveNumber = (i / 2) + 1;
        const whiteMove = fullHistory[i + 1].move;
        const blackMove = (fullHistory[i + 2]) ? fullHistory[i + 2].move : '';

        // On assigne un id unique à chaque coup pour pouvoir le cibler
        const whiteId = `move-${i + 1}`;
        const blackId = `move-${i + 2}`;

        historyHtml += `<div class="move-pair">${moveNumber}. <span id="${whiteId}">${whiteMove}</span> <span id="${blackId}">${blackMove}</span></div>`;
    }
    historyElement.html(historyHtml);
    
    // On surligne le coup actif
    if (viewIndex > 0) {
        historyElement.find(`#move-${viewIndex}`).addClass('active-move');
    }

    historyElement.scrollTop(historyElement[0].scrollHeight);
}

function navigateTo(index) {
    if (index < 0 || index >= fullHistory.length) return;
    viewIndex = index;
    const position = fullHistory[viewIndex].fen;
    
    game.load(position);
    board.position(position, false);
    
    renderUnicodePieces();
    updateHistory();
}

function onDrop(source, target) {
    if (viewIndex < fullHistory.length - 1) {
        fullHistory = fullHistory.slice(0, viewIndex + 1);
    }

    let move = game.move({ from: source, to: target, promotion: 'q' });

    if (move === null) {
        renderUnicodePieces();
        return 'snapback';
    }

    fullHistory.push({ move: move.san, fen: game.fen() });
    viewIndex++;
    
    // Pas besoin d'appeler renderUnicodePieces() ici car navigateTo() le fait implicitement
    // via le changement de viewIndex et la mise à jour de l'historique
    // Correction: si, on est à la fin, il faut le faire.
    renderUnicodePieces();
    updateHistory();
}

function onDragStart(source, piece, position, orientation) {
    // Permet de jouer uniquement pour le camp dont c'est le tour
    if (game.game_over() || game.turn() !== piece.charAt(0)) {
        return false;
    }
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

// --- GESTIONNAIRE D'ÉVÉNEMENTS CLAVIER ---
$(document).on('keydown', (e) => {
    // Empêche le défilement de la page avec les flèches
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
    }

    if (e.key === 'ArrowLeft') {
        navigateTo(viewIndex - 1);
    }
    if (e.key === 'ArrowRight') {
        navigateTo(viewIndex + 1);
    }
});
