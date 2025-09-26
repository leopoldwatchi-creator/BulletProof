document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('chessboard');
    const historyElement = document.getElementById('move-history');
    
    // Structure : [pièce, couleur, nom pour notation]
    const PIECES = {
        '♜': { color: 'b', name: 'R' }, '♞': { color: 'b', name: 'N' }, '♝': { color: 'b', name: 'B' }, '♛': { color: 'b', name: 'Q' }, '♚': { color: 'b', name: 'K' },
        '♟': { color: 'b', name: 'P' },
        '♖': { color: 'w', name: 'R' }, '♘': { color: 'w', name: 'N' }, '♗': { color: 'w', name: 'B' }, '♕': { color: 'w', name: 'Q' }, '♔': { color: 'w', name: 'K' },
        '♙': { color: 'w', name: 'P' },
    };

    const initialBoardSetup = [
        '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖',
    ];

    let boardState = []; // On va utiliser cet array pour la logique du jeu
    let selectedSquare = null;
    let moveCount = 1;

    // Convertit un index (0-63) en notation (e.g., "a1")
    function getAlgebraicNotation(index) {
        const col = index % 8;
        const row = 8 - Math.floor(index / 8);
        const file = String.fromCharCode('a'.charCodeAt(0) + col);
        return `${file}${row}`;
    }
    
    // *** NOUVELLE FONCTION : Génère la notation algébrique correcte ***
    function getMoveNotation(pieceSymbol, fromIndex, toIndex, isCapture) {
        const pieceInfo = PIECES[pieceSymbol];
        const toNotation = getAlgebraicNotation(toIndex);

        if (pieceInfo.name === 'P') { // Logique pour le pion
            if (isCapture) {
                const fromFile = getAlgebraicNotation(fromIndex)[0];
                return `${fromFile}x${toNotation}`;
            }
            return toNotation; // e.g., "e4"
        } else { // Logique pour les autres pièces
            const captureChar = isCapture ? 'x' : '';
            return `${pieceInfo.name}${captureChar}${toNotation}`; // e.g., "Nf3" ou "Nxf3"
        }
    }

    function createBoard() {
        boardElement.innerHTML = '';
        boardState = [...initialBoardSetup]; // Copie la configuration initiale
        
        boardState.forEach((pieceSymbol, index) => {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.index = index;

            const row = Math.floor(index / 8);
            if ((row + (index % 8)) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            
            if (pieceSymbol) {
                const pieceInfo = PIECES[pieceSymbol];
                const pieceElement = document.createElement('span');
                pieceElement.classList.add('piece');
                pieceElement.classList.add(pieceInfo.color === 'w' ? 'white-piece' : 'black-piece');
                pieceElement.innerHTML = pieceSymbol;
                square.appendChild(pieceElement);
            }

            square.addEventListener('click', onSquareClick);
            boardElement.appendChild(square);
        });
    }

    function onSquareClick(event) {
        const clickedSquare = event.currentTarget;
        const clickedIndex = parseInt(clickedSquare.dataset.index);

        if (selectedSquare) {
            // --- C'est le deuxième clic (pour déplacer) ---
            const fromIndex = parseInt(selectedSquare.dataset.index);
            
            // Annuler la sélection si on reclique sur la même case
            if (fromIndex === clickedIndex) {
                selectedSquare.classList.remove('selected');
                selectedSquare = null;
                return;
            }

            const pieceSymbol = boardState[fromIndex];
            const isCapture = boardState[clickedIndex] !== null;

            // Obtenir la notation AVANT de modifier l'état du plateau
            const notation = getMoveNotation(pieceSymbol, fromIndex, toIndex, isCapture);

            // 1. Mettre à jour l'état logique du plateau
            boardState[clickedIndex] = boardState[fromIndex];
            boardState[fromIndex] = null;
            
            // 2. Mettre à jour l'affichage (le DOM)
            if(isCapture) { clickedSquare.innerHTML = ''; } // Vider la case si capture
            clickedSquare.appendChild(selectedSquare.firstChild);

            // 3. Mettre à jour l'historique
            logMove(notation);

            // 4. Réinitialiser
            selectedSquare.classList.remove('selected');
            selectedSquare = null;
            
        } else if (boardState[clickedIndex]) {
            // --- C'est le premier clic (pour sélectionner) ---
            selectedSquare = clickedSquare;
            selectedSquare.classList.add('selected');
        }
    }

    // *** FONCTION logMove ENTIÈREMENT REVUE ***
    function logMove(notation) {
        const isWhiteTurn = moveCount % 2 !== 0;
        
        if (isWhiteTurn) {
            // Si c'est le tour des blancs, on crée une nouvelle ligne
            const moveNumber = Math.ceil(moveCount / 2);
            const moveEntry = document.createElement('div');
            moveEntry.classList.add('move-entry');
            // On lui donne un ID pour la retrouver facilement au tour des noirs
            moveEntry.id = `move-${moveNumber}`; 
            
            moveEntry.innerHTML = `
                <span>${moveNumber}.</span>
                <span class="white-move">${notation}</span>
            `;
            historyElement.appendChild(moveEntry);
        } else {
            // Si c'est le tour des noirs, on trouve la dernière ligne et on ajoute le coup
            const moveNumber = Math.ceil(moveCount / 2);
            const currentMoveEntry = document.getElementById(`move-${moveNumber}`);
            
            const blackMoveSpan = document.createElement('span');
            blackMoveSpan.classList.add('black-move');
            blackMoveSpan.textContent = notation;
            currentMoveEntry.appendChild(blackMoveSpan);
        }

        // Faire défiler l'historique vers le bas
        historyElement.scrollTop = historyElement.scrollHeight;
        moveCount++;
    }

    createBoard();
});
