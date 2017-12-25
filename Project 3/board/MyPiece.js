'use strict';

class MyPiece {
    constructor(scene, type = null, color = null) {
        this.scene = scene;
        this.type = type;
        this.color = color;
        this.node = this._getPieceNode(this.type, this.color);
    }

    /**
     * @param {string} str First char is type (K/Q/T/B/H), second is color (w/b).
     */
    setPiece(str) {
        if (str == "  ") {
            this.type = null;
            this.color = null;
            this.node = null;
            return;
        }
        
        this.type = str[0];
        this.color = str[1];
        
        this.node = this._getPieceNode(this.type, this.color);
    }

    /**
     * 
     * @param {string} type 
     * @param {string} color 
     */
    _getPieceNode(type, color) {
        if (this.type == null || this.color == null || this.type == " " || this.color == " ") {
            return null;
        }

        let node = null;
        if (color == 'w') {
            node = this.scene.graph.nodes['whiteKing'];
        } else {
            node = this.scene.graph.nodes['blackKing'];
        }
        return node;
    }
}