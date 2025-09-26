/* script.js (Architecture finale et la plus robuste) */

import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.0.0-beta.8/+esm";
import { Chessboard, FEN } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.5.4/+esm";

// La fonction principale qui contient tout notre code
function initializeChessboard() {
    const boardContainer = document.getElementById('board-container');
    const pgnHistoryElement = document.getElementById('pgn-history');

    if (!boardContainer) {
        console.error("ERREUR : L'élément #board-container est introuvable !");
        return;
    }

    const game = new Chess();

    function updateHistory() {
        const pgn = game.pgn({ maxWidth: 80, newline: '\n' });
        pgnHistoryElement.innerText = pgn;
        pgnHistoryElement.scrollTop = pgnHistoryElement.scrollHeight;
    }

    function handleMove(event) {
        const { from, to } = event.detail;
        const move = game.move({ from, to, promotion: 'q' });
        if (move === null) return;
        board.setPosition(game.fen());
        updateHistory();
    }

    const board = new Chessboard(boardContainer, {
        position: FEN.start,
        style: {
            lightSquare: "var(--board-color-light)",
            darkSquare: "var(--board-color-dark)",
            pieces: { file: "pieces/staunty.svg" }
        },
        assetsUrl: "https://cdn.jsdelivr.net/npm/cm-chessboard@8.5.4/assets/"
    });

    board.enableMoveInput(handleMove);
    updateHistory();
}

// On attend que le DOM soit prêt, PUIS on exécute notre fonction principale
document.addEventListener('DOMContentLoaded', initializeChessboard);
