document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('chessboard');
    const historyElement = document.getElementById('move-history');
    
    // Pièces Unicode pleines. Structure : [pièce, couleur]
    // 'w' pour blanc (white), 'b' pour noir (black)
    const initialBoard = [
        ['♜', 'b'], ['♞', 'b'], ['♝', 'b'], ['♛', 'b'], ['♚', 'b'], ['♝', 'b'], ['♞', 'b'], ['♜', 'b'],
        ['♟', 'b'], ['♟', 'b'], ['♟', 'b'], ['♟', 'b'], ['♟', 'b'], ['♟', 'b'], ['♟', 'b'], ['♟', 'b'],
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        ['♙', 'w'], ['♙', 'w'], ['♙', 'w'], ['♙', 'w'], ['♙', 'w'], ['♙', 'w'], ['♙', 'w'], ['♙', 'w'],
        ['♖', 'w'], ['♘', 'w'], ['♗', 'w'], ['♕', 'w'], ['♔', 'w'], ['♗', 'w'], ['♘', 'w'], ['♖', 'w'],
    ];

    let selectedSquare = null;
    let moveCount = 1;
    let whiteMove = ''; // Pour stocker le coup des blancs

    // Fonction pour convertir un index (0-63) en notation algébrique (e.g., "a1")
    function getAlgebraicNotation(index) {
        const col = index % 8;
        const row = 8 - Math.floor(index / 8);
        const file = String.fromCharCode('a'.charCodeAt(0) + col);
        return `${file}${row}`;
    }

    // Fonction pour créer l'échiquier
    function createBoard() {
        boardElement.innerHTML = '';
        initialBoard.forEach((pieceData, index) => {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.index = index;

            const row = Math.floor(index / 8);
            if ((row + (index % 8)) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            
            if (pieceData) {
                const [piece, color] = pieceData;
                const pieceElement = document.createElement('span');
                pieceElement.classList.add('piece');
                pieceElement.classList.add(color === 'w' ? 'white-piece' : 'black-piece');
                pieceElement.innerHTML = piece;
                square.appendChild(pieceElement);
            }

            square.addEventListener('click', onSquareClick);
            boardElement.appendChild(square);
        });
    }

    function onSquareClick(event) {
        const clickedSquare = event.currentTarget;
        
        if (selectedSquare === null) {
            // Sélectionner une case uniquement si elle contient une pièce
            if (clickedSquare.hasChildNodes()) {
                selectedSquare = clickedSquare;
                selectedSquare.classList.add('selected');
            }
        } else {
            const fromIndex = selectedSquare.dataset.index;
            const toIndex = clickedSquare.dataset.index;
            
            // Si on clique sur la même case, on déselectionne
            if(fromIndex === toIndex) {
                 selectedSquare.classList.remove('selected');
                 selectedSquare = null;
                 return;
            }

            // Générer le mouvement en notation
            const pieceSymbol = selectedSquare.textContent;
            const fromNotation = getAlgebraicNotation(fromIndex);
            const toNotation = getAlgebraicNotation(toIndex);
            
            // Déplacer la pièce visuellement
            if (clickedSquare.hasChildNodes()) {
                clickedSquare.innerHTML = ''; // "Capture" en supprimant l'ancienne pièce
            }
            clickedSquare.appendChild(selectedSquare.firstChild);
            
            // Mettre à jour l'historique
            logMove(pieceSymbol, fromNotation, toNotation);

            // Déselectionner
            selectedSquare.classList.remove('selected');
            selectedSquare = null;
        }
    }

    // Fonction pour ajouter un coup à l'historique
    function logMove(piece, from, to) {
        const moveNotation = `${piece} ${from}-${to}`;

        if (moveCount % 2 !== 0) { // C'est le tour des blancs
            whiteMove = moveNotation;
        } else { // C'est le tour des noirs, on peut créer la ligne complète
            const moveEntry = document.createElement('div');
            moveEntry.classList.add('move-entry');
            
            const moveNumber = Math.ceil(moveCount / 2);
            moveEntry.innerHTML = `<span>${moveNumber}.</span><span>${whiteMove}</span><span>${moveNotation}</span>`;
            
            historyElement.appendChild(moveEntry);
            historyElement.scrollTop = historyElement.scrollHeight; // Fait défiler vers le bas
        }
        
        moveCount++;
    }

    // Initialiser le jeu
    createBoard();
});
