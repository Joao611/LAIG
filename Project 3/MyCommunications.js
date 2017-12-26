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

    /**
     * 
     * @param {string} botColor Color assigned to the NPC in singleplayer. This may be anything in other modes.
     */
    requestNextTurn(botColor) {
        this._requestToProlog("npcPlay("+botColor+")", this._nextTurnListener);
    }

    /**
     * 
     * @param {string} playerColor Color assigned to the Player in singleplayer. This may be anything in other modes.
     * @param {number} colStart 
     * @param {number} rowStart 
     * @param {number} colDest 
     * @param {number} rowDest 
     */
    requestPlayerTurn(playerColor, startCoords, destCoords) {
        let requestStr = "playerPlay("+playerColor+","+startCoords.col+","+startCoords.line+","+destCoords.col+","+destCoords.line+")";
        this._requestToProlog(requestStr, this._playerTurnListener);
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