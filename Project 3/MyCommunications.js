class MyCommunications {
    port = 8081;

    constructor(scene) {
        this.scene = scene;
    }

    requestBoard(port) {
        _requestToProlog("getBoard(B)", _updatePiecesListener);
    }

    _requestToProlog(requestStr, eventListener) {
        let request = new XMLHttpRequest();
        request.open("GET", "http://localhost:" + this.port + "/" + requestStr, true);
        request.addEventListener("load", eventListener);
        request.send();
    }

    _updatePiecesListener(event) {
        prologPieces = this.responseText;
        this.scene.board.updatePieces(prologPieces);
    }
}