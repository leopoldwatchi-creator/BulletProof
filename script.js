document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('chessboard');
    
    // Position de départ des pièces en Unicode
    // ♜♞♝♛♚♝♞♜ (noir)
    // ♟♟♟♟♟♟♟♟
    // ... cases vides ...
    // ♙♙♙♙♙♙♙♙ (blanc)
    // ♖♘♗♕♔♗♘♖
    const initialBoard = [
        '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖',
    ];

    let selectedSquare = null; // Pour garder en mémoire la case sélectionnée

    // Fonction pour créer l'échiquier
    function createBoard() {
        boardElement.innerHTML = ''; // Vide l'échiquier avant de le recréer
        initialBoard.forEach((piece, index) => {
            const square = document.createElement('div');
            square.classList.add('square');

            const row = Math.floor(index / 8);
            const col = index % 8;

            // Détermine la couleur de la case
            if ((row + col) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }

            square.innerHTML = piece;
            square.dataset.index = index; // Ajoute un attribut pour savoir quelle case c'est

            // Ajoute la logique de clic
            square.addEventListener('click', onSquareClick);

            boardElement.appendChild(square);
        });
    }

    // Gère le clic sur une case
    function onSquareClick(event) {
        const clickedSquare = event.currentTarget;
        
        // Si aucune pièce n'est sélectionnée pour le moment
        if (selectedSquare === null) {
            // On ne peut sélectionner qu'une case qui contient une pièce
            if (clickedSquare.innerHTML !== '') {
                selectedSquare = clickedSquare;
                selectedSquare.classList.add('selected');
            }
        } 
        // Si une pièce a déjà été sélectionnée
        else {
            // Déplacer la pièce
            // (Note: ce code ne valide pas les mouvements, il déplace juste le texte)
            clickedSquare.innerHTML = selectedSquare.innerHTML;
            selectedSquare.innerHTML = '';
            
            // Déselectionner la case d'origine
            selectedSquare.classList.remove('selected');
            selectedSquare = null; // Réinitialiser pour le prochain tour
        }
    }

    // Crée l'échiquier au chargement de la page
    createBoard();
});
