class MySecondaryBoard {
    /**
     * 
     * @param {XMLscene} scene 
     * @param {*} position 
     */
    constructor(scene, position) {
        this.scene = scene;
        this.position = position;

        this.secondaryBoardLines = 2;
        this.secondaryBoardColumns = 8;
        this.blackCell = scene.graph.nodes['blackCell'];
        this.whiteCell = scene.graph.nodes['whiteCell'];

        this.boardCells = this._buildSecondaryBoard();
    }

    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.position.x, this.position.y, this.position.z);
            for (let line = 0; line < this.secondaryBoardLines; line++) {
                for (let col = 0; col < this.secondaryBoardColumns; col++) {
                    this.scene.pushMatrix();
                        this.scene.graph.displayNode(this.boardCells[line][col]);
                    this.scene.popMatrix();
                }
            }
        this.scene.popMatrix();
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
}