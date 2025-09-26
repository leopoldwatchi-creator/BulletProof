/* script.js (version finale corrigée) */

// CORRECTION 1 : On utilise une URL d'import plus stable et officielle pour le CDN
import { Chessboard, FEN } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.5.4/+esm"
import { Chess } from "https://cdn.jsdelivr.net/npm/chess.mjs@1.0.0/chess.mjs"

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
        // CORRECTION 2 : Il y avait un double tiret ici (--board--color-dark)
        darkSquare: "var(--board-color-dark)", 
        pieces: {
            file: "pieces/staunty.svg" 
        }
    },
    // Cette ligne est cruciale et correcte, elle indique où trouver les pièces
    assetsUrl: "https://cdn.jsdelivr.net/npm/cm-chessboard@8.5.4/assets/"
})

board.enableMoveInput(handleMove);
updateHistory();
