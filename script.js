// Sélection du conteneur du plateau d'échecs
const chessBoard = document.getElementById('chessBoard');

// Tableau 2D représentant l'état du plateau avec les pièces
let board = [
    ["bTower", "bKnight", "bMad", "bKing", "bQueen", "bMad", "bKnight", "bTower"], // Rangée des pièces noires
    ["bPawn", "bPawn", "bPawn", "bPawn", "bPawn", "bPawn", "bPawn", "bPawn"], // Pions noirs
    ["", "", "", "", "", "", "", ""],         // Cases vides
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["wPawn", "wPawn", "wPawn", "wPawn", "wPawn", "wPawn", "wPawn", "wPawn"], // Pions blancs
    ["wTower", "wKnight", "wMad", "wQueen", "wKing", "wMad", "wKnight", "wTower"]  // Rangée des pièces blanches
];

// Variable pour gérer le tour actuel
let currentTurn = 'white'; // 'white' pour les blancs, 'black' pour les noirs
let selectedPiecePosition = null; // Pour stocker la position de la pièce sélectionnée
let selectedPiece = null; // Pour stocker la pièce sélectionnée

// Fonction pour générer le plateau d'échecs et placer les pièces
function generateBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');

            // Appliquer les classes white/black pour la couleur des cases
            if ((i + j) % 2 === 0) {
                square.classList.add('white');
            } else {
                square.classList.add('black');
            }

            // Ajouter les pièces au plateau
            const piece = board[i][j];
            if (piece) {
                const pieceElement = document.createElement('img');
                pieceElement.src = `assets/${piece}.png`;  // Chemin des images des pièces
                pieceElement.classList.add('piece');
                pieceElement.dataset.color = piece[0]; // Ajouter un attribut pour la couleur (w ou b)
                pieceElement.dataset.position = `${i}-${j}`; // Stocker la position dans l'attribut de données
                square.appendChild(pieceElement);
            }

            // Ajouter la case au plateau
            chessBoard.appendChild(square);
        }
    }
}

// Appeler la fonction pour générer le plateau
generateBoard();

// Fonction pour supprimer la surbrillance des cases
function clearHighlights() {
    const squares = document.querySelectorAll('#chessBoard div');
    squares.forEach(square => {
        square.classList.remove('highlight');
    });
}

// Fonction pour surligner les cases valides pour le pion
function highlightPawnMoves(row, col, color) {
    clearHighlights(); // Supprimer les surbrillances précédentes
    const direction = color === 'w' ? -1 : 1; // Les pions blancs avancent vers le haut (ligne -1) et les noirs vers le bas (ligne +1)
    const startRow = color === 'w' ? 6 : 1; // Ligne de départ pour les pions

    // Case directement devant le pion
    if (row + direction >= 0 && row + direction < 8 && board[row + direction][col] === "") {
        const targetSquare = chessBoard.children[(row + direction) * 8 + col];
        targetSquare.classList.add('highlight');
    }

    // Case de départ : possibilité d'avancer de deux
    if (row === startRow && row + direction * 2 >= 0 && row + direction * 2 < 8 && board[row + direction * 2][col] === "") {
        const targetSquare = chessBoard.children[(row + direction * 2) * 8 + col];
        targetSquare.classList.add('highlight');
    }
}

// Gestion des clics pour déplacer les pièces
chessBoard.addEventListener('click', (event) => {
    const target = event.target;

    // Vérifier si une pièce est cliquée
    if (target.tagName === 'IMG') {
        // Vérifier si la pièce appartient au joueur courant
        if (target.dataset.color === currentTurn[0]) {
            // Sélectionner la pièce cliquée
            selectedPiece = target;

            // Enregistrer la position de la pièce sélectionnée
            selectedPiecePosition = selectedPiece.dataset.position.split('-').map(Number);
            const pieceType = selectedPiece.src.split('/').pop().split('.')[0]; // Obtenir le type de pièce

            // Si c'est un pion, surligner les mouvements possibles
            if (pieceType === 'wPawn' || pieceType === 'bPawn') {
                highlightPawnMoves(selectedPiecePosition[0], selectedPiecePosition[1], selectedPiece.dataset.color);
            }
        } else {
            alert("C'est le tour de l'autre joueur !");
        }
    } 
    // Si une case est cliquée et qu'une pièce est déjà sélectionnée, déplacer la pièce
    else if (selectedPiece && target.tagName === 'DIV') {
        const targetPosition = Array.from(chessBoard.children).indexOf(target);
        const targetRow = Math.floor(targetPosition / 8);
        const targetCol = targetPosition % 8;

        // Vérifier si la case cible est surlignée
        if (target.classList.contains('highlight')) {
            // Mettre à jour le tableau board
            board[targetRow][targetCol] = selectedPiece.src.split('/').pop().split('.')[0]; // Met à jour la position cible
            board[selectedPiecePosition[0]][selectedPiecePosition[1]] = ""; // Effacer l'ancienne position

            // Mettre à jour la position de la pièce dans le DOM
            target.appendChild(selectedPiece); // Déplacer la pièce sélectionnée
            selectedPiece.dataset.position = `${targetRow}-${targetCol}`; // Mettre à jour la position de la pièce

            // Changer de tour
            currentTurn = currentTurn === 'white' ? 'black' : 'white';

            clearHighlights(); // Effacer la surbrillance après le déplacement
            selectedPiece = null;  // Réinitialiser la sélection
            selectedPiecePosition = null; // Réinitialiser la position sélectionnée
        }
    } else {
        clearHighlights(); // Effacer la surbrillance si une case vide est cliquée
    }
});
