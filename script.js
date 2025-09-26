/* script.js (version finale corrigée - v2) */

// CORRECTION : On utilise la bonne URL pour le paquet chess.js
import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.0.0-beta.8/+esm"
import { Chessboard, FEN } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.5.4/+esm"

// --- INITIALISATION ---

const boardContainer = document.getElementById('board-container')
const pgnHistoryElement = document.getElementById('pgn-history')
const game = new Chess()

// --- FONCTIONS ---

function updateHistory() {
    const pgn = game.pgn({ maxWidth: 80, newline: '\n' });
    pgnHistoryElement.innerText = pgn;
    pgnHistoryElement.scrollTop = pgnHistoryElement.scrollHeight;
}

function handleMove(event) {
    const { from, to } = event.detail;
    const move = game.move({ from, to, promotion: 'q' });

    if (move === null) {
        console.log("Coup illégal !");
        return;
    }

    board.setPosition(game.fen());
    updateHistory();
}

// --- CONFIGURATION DE L'ÉCHIQUIER ---

const board = new Chessboard(boardContainer, {
    position: FEN.start,
    style: {
        lightSquare: "var(--board-color-light)",
        darkSquare: "var(--board-color-dark)",
        pieces: {
            file: "pieces/staunty.svg"
        }
    },
    assetsUrl: "https://cdn.jsdelivr.net/npm/cm-chessboard@8.5.4/assets/"
})

board.enableMoveInput(handleMove);
updateHistory();
