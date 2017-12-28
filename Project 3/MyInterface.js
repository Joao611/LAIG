 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor 
    CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui
    
    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)
    
    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    var group = this.gui.addFolder("Lights");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
}

MyInterface.prototype.addSelectableDropdown = function(selectableIds) {
    this.gui.add(this.scene.graph, 'selectedNodeId', selectableIds).name('Select a node:');
}

MyInterface.prototype.addOptions = function() {
    let optionsGroup = this.gui.addFolder("Options");
    optionsGroup.open();

    let cameraOption = optionsGroup.add(this.scene, 'selectedCameraPos', this.scene.cameraPositions).name('Perspective:');
    cameraOption.onChange((value) => {
        let array = JSON.parse(value);
        this.scene.setupMoveCamera(array);
    });
}

MyInterface.prototype.addGameControls = function() {
    let mainGroup = this.gui.addFolder("Main Menu");
    mainGroup.open();
    mainGroup.add(this.scene, 'selectedMode', this.scene.selectableModes).name('Mode:');
    mainGroup.add(this.scene, 'selectedDifficulty', this.scene.selectableDifficulties).name('Difficulty:');
    mainGroup.add(this.scene, 'playTimeLimit', 1, 20).name('Play Time Limit');
    mainGroup.add(this.scene, 'startButton').name('Start Game');

    let ingameGroup = this.gui.addFolder("In Game");
    ingameGroup.open();
    ingameGroup.add(this.scene, 'nextTurnButton').name('Next Turn');
    ingameGroup.add(this.scene, 'undoButton').name('Undo');
}