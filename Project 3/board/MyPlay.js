class MyPlay {
    /**
     * 
     * @param {string} moveColor 'w'/'b'. Color of the moved piece.
     * @param {number} startCol 
     * @param {number} startLine 
     * @param {number} destCol 
     * @param {number} destLine 
     */
    constructor(moveColor, startCol, startLine, destCol, destLine) {
        this.moveColor = moveColor;
        this.startCol = startCol;
        this.startLine = startLine;
        this.destCol = destCol;
        this.destLine = destLine;
    }
}