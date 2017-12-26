'use strict';

class MyBoard {
  /**
   * 
   * @param {XMLscene} scene 
   */
  constructor(scene) {
    'use strict';
    this.scene = scene;
    this.playerColor = 'w'; //white
    this.botColor = 'b'; //black
    this.cellWidth = 1;
    this.boardLength = 8;
    this.blackCell = scene.graph.nodes['blackCell'];
    this.whiteCell = scene.graph.nodes['whiteCell'];
    this.board = this._buildBoard();
    this.boardPieces = this._initBoardPieces();
    this.playSequence = [];
  }

  update() {
    // get pieces in each position
    // make move
  }

  display() {
    for (let line = 0; line < this.boardLength; line++) {
      for (let col = 0; col < this.boardLength; col++) {
        this.scene.pushMatrix();
          this.scene.translate(this.cellWidth * col, 0, this.cellWidth * line);
          this.scene.registerForPick(this._getPickId(line, col), this.board[line][col]);
          if (this.scene.pickedId == this._getPickId(line, col)) {
            this.scene.setActiveShader(this.scene.pickedShader);
          }
          this.scene.graph.displayNode(this.board[line][col]);
          if (this.scene.pickedId == this._getPickId(line, col)) {
            this.scene.setActiveShader(this.scene.defaultShader);
          }
          if (this.boardPieces[line][col].node != null) {
            this.scene.graph.displayNode(this.boardPieces[line][col].node);
          }
        this.scene.popMatrix();
      }
    }
  }

  /**
   * 
   * @param {string} prologPieces Prolong representation of board.
   */
  updatePieces(prologPieces) {
    prologPieces = prologPieces.slice(2);
    prologPieces = prologPieces.slice(0, -2);
    let piecesLines = prologPieces.split("],[");
    
    for (let line = 0; line < this.boardLength; line++) {
      let pieces = piecesLines[line].split(",");
      for (let col = 0; col < this.boardLength; col++) {
        this.boardPieces[line][col].setPiece(pieces[col]);
      }
    }
  }

  /**
   * Returns an object with 'line' and 'col' attributes.
   * @param {number} pickedId 
   */
  getCoordsOfPickedId(pickedId) {
    let coords = new Object();
    coords.line = Math.floor(pickedId / this.boardLength);
    coords.col = pickedId % this.boardLength;
    return coords;
  }

  /**
   * 
   * @param {MyPlay} play 
   */
  addPlay(play) {
    this.playSequence.push(play);
  }

  _buildBoard() {
    let outerBlackTurn = true;
    let board = [];
    for (let line = 0; line < this.boardLength; line++) {
      let blackTurn = outerBlackTurn;
      let boardLine = [];
      for (let col = 0; col < this.boardLength; col++) {
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
    for (let line = 0; line < this.boardLength; line++) {
      let piecesLine = [];
      for (let col = 0; col < this.boardLength; col++) {
        piecesLine[col] = new MyPiece(this.scene);
      }
      boardPieces.push(piecesLine);
    }
    return boardPieces;
  }

  /**
   * 
   * @param {number} line 
   * @param {number} col 
   */
  _getPickId(line, col) {
    return line * this.boardLength + col;
  }
}
