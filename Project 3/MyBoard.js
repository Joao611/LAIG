'use strict';

/* function toJSON(proto) {
    let jsoned = {};
    let toConvert = proto || this;
    Object.getOwnPropertyNames(toConvert).forEach((prop) => {
        const val = toConvert[prop];
        // don't include those
        if (prop === 'toJSON' || prop === 'constructor') {
            return;
        }
        if (typeof val === 'function') {
            jsoned[prop] = val.bind(jsoned);
            return;
        }
        jsoned[prop] = val;
    });

    const inherited = Object.getPrototypeOf(toConvert);
    if (inherited !== null) {
        Object.keys(this.toJSON(inherited)).forEach(key => {
            if (!!jsoned[key] || key === 'constructor' || key === 'toJSON')
                return;
            if (typeof inherited[key] === 'function') {
                jsoned[key] = inherited[key].bind(jsoned);
                return;
            }
            jsoned[key] = inherited[key];
        });
    }
    return jsoned;
} */

class MyBoard {
  constructor(scene) {
    this.scene = scene;
    this.cellWidth = 1;
    this.boardLength = 8;
    this.blackCell = scene.graph.nodes['blackCell'];
    this.whiteCell = scene.graph.nodes['whiteCell'];
    this.board = this._buildBoard();
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
          this.scene.graph.displayNode(this.board[line][col]);
        this.scene.popMatrix();
      }
    }
  }

  updatePieces(prologPieces) {
    console.log(prologPieces);
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
    this.scene.comms.requestBoard();
    return board;
  }

  _getPickId(line, col) {
    return line * this.boardLength + col + 1;
  }
}
