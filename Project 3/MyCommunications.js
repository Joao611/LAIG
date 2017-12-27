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
     * @param {object} colStart Object with 'line' and 'col' attributes.
     * @param {object} rowStart Object with 'line' and 'col' attributes.
     */
    requestPlayerTurn(playerColor, startCoords, destCoords) {
        let requestStr = "playerPlay("+playerColor+","+startCoords.col+","+startCoords.line+","+destCoords.col+","+destCoords.line+")";
        this._requestToProlog(requestStr, this._playerTurnListener);
    }

    /**
     * 
     * @param {string} nextColor 
     * @param {object} colStart Object with 'line' and 'col' attributes.
     * @param {object} rowStart Object with 'line' and 'col' attributes.
     */
    requestForceMove(nextColor, startCoords, destCoords) {
        let requestStr = "forceMove("+nextColor+","+startCoords.col+","+startCoords.line+","+destCoords.col+","+destCoords.line+")";
        this._requestToProlog(requestStr, this._forceMoveListener);
    }

    requestGameIsOver() {
        this._requestToProlog("gameIsOver", this._gameIsOverListener);
    }

    requestPlayerChange() {
        this._requestToProlog("changePlayer", this._playerChangeListener);
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
        this.comms.requestGameIsOver();
    }

    _nextTurnListener(event) {
        let play = this.comms._getPlayFromProlog(this.responseText);
        this.comms.scene.board.addPlay(play);
        this.comms.requestBoard();
    }

    _playerTurnListener(event) {
        this.comms.requestBoard();
    }

    _forceMoveListener(event) {
        this.comms.requestBoard();
    }

    _gameIsOverListener(event) {
        let gameState = this.comms._getGameStateFromProlog(event.target.response);
        this.comms.scene.board.updateState(gameState);
    }

    _playerChangeListener(event) {
        let player;
        if (event.target.response == "b") {
            player = "blacks";
        } else {
            player = "whites";
        }
        alert("Changed turn to " + player);
        this.comms.scene.board.resetPlayerTime();
    }


    /**
     * 
     * @param {string} prologPlay String in the format '[Color,Col_Start,Row_Start,Col_Dest,Row_Dest]'
     */
    _getPlayFromProlog(prologPlay) {
        let playArray = JSON.parse(prologPlay);
        let play = new MyPlay(String.fromCharCode(playArray[0][0]), playArray[1], playArray[2], playArray[3], playArray[4]);
        return play;
    }

    _getGameStateFromProlog(prologState) {
        let stateArray = JSON.parse(prologState);
        let isDraw = stateArray[0];
        let whiteWon = stateArray[1];
        let blackWon = stateArray[2];
        return new MyGameState(isDraw, whiteWon, blackWon);
    }
}