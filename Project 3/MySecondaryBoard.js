class MySecondaryBoard {
    /**
     * 
     * @param {XMLscene} scene 
     * @param {*} position Object with 'x', 'y' and 'z' attributes.
     */
    constructor(scene, position) {
        this.scene = scene;
        this.position = position;

        this.cellWidth = 1;
        this.secondaryBoardLines = 8;
        this.secondaryBoardColumns = 2;
        this.blackCell = scene.graph.nodes['blackCell'];
        this.whiteCell = scene.graph.nodes['whiteCell'];

        this.boardCells = this._buildSecondaryBoard();
        this.boardPieces = this._initBoardPieces();
        this.queuedBoardPieces = this._initBoardPieces();
    }

    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.position.x, this.position.y, this.position.z);
            for (let line = 0; line < this.secondaryBoardLines; line++) {
                for (let col = 0; col < this.secondaryBoardColumns; col++) {
                    this.scene.pushMatrix();
                        this.scene.translate(this.cellWidth * col, 0, this.cellWidth * line);
                        this._displayCell(line, col);
                        this._displayPiece(line, col);
                    this.scene.popMatrix();
                }
            }
        this.scene.popMatrix();
    }

    /**
     * Copies queued board to the active board.
     * This allows pieces to animate to the board before they're actually placed on it.
     */
    updateQueued() {
        this.boardPieces = this._copyBoardPieces(this.queuedBoardPieces);
    }

    /**
     * 
     * @param {MyPiece} piece 
     */
    placePiece(piece) {
        let line, col;

        if (piece.isWhite()) {
            col = 0;
        } else if (piece.isBlack()) {
            col = 1;
        }

        if (piece.isKing()) {
            line = 0;
        } else if (piece.isQueen()) {
            line = 1;
        } else if (piece.isBishop()) {
            if (this.queuedBoardPieces[2][col].pieceIsSet()) {
                line = 3;
            } else {
                line = 2;
            }
        } else if (piece.isTower()) {
            if (this.queuedBoardPieces[4][col].pieceIsSet()) {
                line = 5;
            } else {
                line = 4;
            }
        } else if (piece.isHorse()) {
            if (this.queuedBoardPieces[6][col].pieceIsSet()) {
                line = 7;
            } else {
                line = 6;
            }
        }

        this.queuedBoardPieces[line][col].setPiece("" + piece.type + piece.color);
    }

    _buildSecondaryBoard() {
        let outerBlackTurn = true;
        let board = [];
        for (let line = 0; line < this.secondaryBoardLines; line++) {
          let blackTurn = outerBlackTurn;
          let boardLine = [];
          for (let col = 0; col < this.secondaryBoardColumns; col++) {
            let cell = (blackTurn ? this.blackCell : this.whiteCell);
            blackTurn = !blackTurn;
            boardLine.push(cell);
          }
          board.push(boardLine);
          outerBlackTurn = !outerBlackTurn;
        }
        return board;
    }

    _initBoardPieces() {
        let boardPieces = [];
        for (let line = 0; line < this.secondaryBoardLines; line++) {
          let piecesLine = [];
          for (let col = 0; col < this.secondaryBoardColumns; col++) {
            piecesLine[col] = new MyPiece(this.scene);
          }
          boardPieces.push(piecesLine);
        }
        return boardPieces;
    }

    _copyBoardPieces(boardPieces) {
        let newBoardPieces = [];
        for (let line = 0; line < boardPieces.length; line++) {
          let newBoardLine = [];
          for (let col = 0; col < boardPieces[line].length; col++) {
            newBoardLine[col] = boardPieces[line][col].clone();
          }
          newBoardPieces.push(newBoardLine);
        }
        return newBoardPieces;
    }

    _displayCell(line, col) {
        this.scene.graph.displayNode(this.boardCells[line][col]);
    }

    _displayPiece(line, col) {
        if (this.boardPieces[line][col].node != null) {
            this.scene.graph.displayNode(this.boardPieces[line][col].node);
        }
    }
}