let board = null;
const game = new Chess();
const boardElement = $('#monEchiquier');
const historyElement = $('#historiqueCoups');

let fullHistory = [{ move: null, fen: 'start' }]; 
let viewIndex = 0;

const unicodePieces = {
    'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
    'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
};

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
    historyElement.find('span').removeClass('active-move');
    for (let i = 0; i < fullHistory.length - 1; i += 2) {
        const moveNumber = (i / 2) + 1;
        const whiteMove = fullHistory[i + 1].move;
        const blackMove = (fullHistory[i + 2]) ? fullHistory[i + 2].move : '';
        const whiteId = `move-${i + 1}`;
        const blackId = `move-${i + 2}`;
        historyHtml += `<div class="move-pair">${moveNumber}. <span id="${whiteId}">${whiteMove}</span> <span id="${blackId}">${blackMove}</span></div>`;
    }
    historyElement.html(historyHtml);
    if (viewIndex > 0) {
        historyElement.find(`#move-${viewIndex}`).addClass('active-move');
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);
}

function navigateTo(index) {
    if (index < 0 || index >= fullHistory.length) return;
    viewIndex = index;
    game.load(fullHistory[viewIndex].fen);
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
    renderUnicodePieces();
    updateHistory();
}

function onDragStart(source, piece, position, orientation) {
    if (game.game_over() || game.turn() !== piece.charAt(0)) return false;
    boardElement.find('.square-' + source).empty();
}

function onSnapEnd() {
    renderUnicodePieces();
}

// LA CORRECTION EST ICI : On supprime la ligne 'pieceTheme'
const config = {
    draggable: true,
    onDrop: onDrop,
    onDragStart: onDragStart,
    onSnapEnd: onSnapEnd,
};

board = Chessboard('monEchiquier', config);
renderUnicodePieces();

$(document).on('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
    if (e.key === 'ArrowLeft') navigateTo(viewIndex - 1);
    if (e.key === 'ArrowRight') navigateTo(viewIndex + 1);
});
