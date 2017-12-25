class MyCommunications {
    constructor(scene) {
        this.scene = scene;
        this.port = 8081;
    }

    requestGameInitialization(mode, difficulty) {
        this._requestToProlog("initGame("+mode+","+difficulty+")", this._initGameListener);
    }

    requestBoard() {
        this._requestToProlog("getBoard(B)", this._updatePiecesListener);
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
}