/* script.js */

// On importe la bibliothèque de l'échiquier depuis son CDN
// C'est une syntaxe moderne (ES6 modules) qui fonctionne grâce au type="module" dans notre HTML
import { Chessboard, FEN } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.5.4/src/cm-chessboard/Chessboard.js"

// --- INITIALISATION ---

// 1. On récupère les éléments de notre page HTML
const boardContainer = document.getElementById('board-container')
const pgnHistoryElement = document.getElementById('pgn-history')

// 2. On crée une instance de la logique du jeu avec chess.js
// La variable "Chess" est disponible globalement car nous l'avons importée dans index.html
const game = new Chess()

// 3. La fonction qui met à jour l'historique des coups
function updateHistory() {
    // On récupère le PGN (Portable Game Notation) de la partie en cours
    // L'option newline: '\n' force un saut de ligne après chaque coup (ex: 1. e4 e5 \n 2. ...)
    const pgn = game.pgn({ maxWidth: 80, newline: '\n' });
    
    // On met à jour le contenu de notre encart
    pgnHistoryElement.innerText = pgn;

    // Fait en sorte que le scroll soit toujours en bas pour voir le dernier coup
    pgnHistoryElement.scrollTop = pgnHistoryElement.scrollHeight;
}

// 4. La fonction qui est appelée quand un joueur fait un coup sur l'échiquier
function handleMove(event) {
    // `event.detail` contient les informations du coup (from, to)
    const { from, to } = event.detail;

    // On essaie de jouer le coup avec la logique de chess.js
    const move = game.move({ from, to, promotion: 'q' });

    // Si le coup est illégal, `move` sera `null`
    if (move === null) {
        console.log("Coup illégal !");
        // La bibliothèque `cm-chessboard` gère le retour de la pièce à sa place
        return;
    }

    // Si le coup est légal :
    // On met à jour l'échiquier visuel avec la nouvelle position (au format FEN)
    board.setPosition(game.fen());
    // On met à jour notre historique de coups
    updateHistory();
}

// --- CONFIGURATION DE L'ÉCHIQUIER ---

// On crée une nouvelle instance de l'échiquier avec nos options
const board = new Chessboard(boardContainer, {
    position: FEN.start, // Position de départ
    style: {
        // On utilise les variables CSS définies dans style.css pour les couleurs
        lightSquare: "var(--board-color-light)",
        darkSquare: "var(--board-color-dark)",
        pieces: {
            // On choisit le set de pièces SVG "staunty"
            file: "pieces/staunty.svg" 
        }
    },
    // On indique l'URL de base pour trouver les pièces SVG
    assetsUrl: "https://cdn.jsdelivr.net/npm/cm-chessboard@8.5.4/assets/"
})

// On active la possibilité pour l'utilisateur de jouer des coups
// et on lie cela à notre fonction `handleMove`
board.enableMoveInput(handleMove);
