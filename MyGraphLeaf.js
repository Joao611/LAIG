/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
    this.type = graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);
    let args = graph.reader.getString(xmlelem, 'args');
    let argList = args.match(/[+-]?\d+(\.\d+)?/g); //regex magic
    switch (this.type) {
        case "rectangle":
            this.primitive = new MyQuad(graph.scene, argList[0], argList[1], argList[2], argList[3]); //TODO
            break;
        case "cylinder":
            this.primitive = new MyCylinder(graph.scene, argList[0], argList[1], argList[2], argList[3], argList[4]);
            break;
        case "sphere":
            break;
        case "triangle":
            break;
    }
}

MyGraphLeaf.prototype.display = function() {
    if (this.type == "rectangle") {// || this.type =="cylinder")
        this.primitive.display();
    }
    if (this.type == "cylinder") {
        this.primitive.display();
    }
}