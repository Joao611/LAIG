class MyCommunications {
    constructor(scene) {
        this.scene = scene;
        this.port = 8081;
    }

    /**
     * 
     * @param {string} mode npc, single, multi.
     * @param {number} difficulty 1 for easy, 2 for hard.
     */
    requestGameInitialization(mode, difficulty) {
        this._requestToProlog("initGame("+mode+","+difficulty+")", this._initGameListener);
    }

    requestBoard() {
        this._requestToProlog("getBoard", this._updatePiecesListener);
    }

    requestNextTurn() {
        this._requestToProlog("npcPlay", this._nextTurnListener);
    }

    /**
     * 
     * @param {string} color w for white, b for black.
     * @param {number} colStart 
     * @param {number} rowStart 
     * @param {number} colDest 
     * @param {number} rowDest 
     */
    requestPlayerTurn(color, colStart, rowStart, colDest, rowDest) {
        this._requestToProlog("playerPlay(color,colStart,rowStart,colDest,rowDest)", this._playerTurnListener);
    }

    _requestToProlog(requestStr, eventListener) {
        let request = new XMLHttpRequest();
        request.comms = this;
        request.open("GET", "http://localhost:" + this.port + "/" + requestStr, true);
        request.addEventListener("load", eventListener);
        request.send();
    }

    _initGameListener(event) {
        if (this.responseText != "ok") {
            console.log("Server: Error initializing game.");
        }
        this.comms.requestBoard();
    }

    _updatePiecesListener(event) {
        this.comms.scene.board.updatePieces(this.responseText);
    }

    _nextTurnListener(event) {
        this.comms.requestBoard();
    }

    _playerTurnListener(event) {
        this.comms.requestBoard();
    }
}