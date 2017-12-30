var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;

    this.lightValues = {};
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.enableTextures(true);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);

    this.whiteScore = 0;
    this.blackScore = 0;

    this.isSelectableShaderSet = false;
    this.isPickedShaderSet = false;
    this.setActiveShader(this.defaultShader);
    
    this.cameraPositions = {
        'Default': '[0.5, 10, 10]',
        'Top': '[0.5, 10, 1]'
    };
    this.selectedCameraPos = this.cameraPositions['Default'];

    this.selectedMode = "npc";
    this.selectedDifficulty = "1";
    this.playTimeLimit = 10;

    this.selectableModes = ['npc', 'single', 'multi'];
    this.selectableDifficulties = ['1', '2'];

    this.pickedId = null;

    this.comms = new MyCommunications(this);

    this.startButton = function() {
        this.board = new MyBoard(this, this.playTimeLimit);
        this.whiteScore = 0;
        this.blackScore = 0;
        this.board.mode = this.selectedMode;
        this.board.difficulty = 1;
        this.comms.requestGameInitialization(this.selectedMode, 1); // Always choose 'easy' due to a severe memory leak in Prolog.
    }

    this.nextTurnButton = function() {
        if (this.board.activeGame) {
            this.board.resetPlayerTime();
            this.comms.requestNextTurn(this.board.botColor);
        }
    }

    this.undoButton = function() {
        if (!this.board.activeGame || this.board.playSequence.length == 0) {
            return;
        }
        let lastPlay = this.board.playSequence.pop();

        let startCoords = new Object();
        startCoords.line = lastPlay.destLine + 1;
        startCoords.col = lastPlay.destCol + 1;
        let destCoords = new Object();
        destCoords.line = lastPlay.startLine + 1;
        destCoords.col = lastPlay.startCol + 1;

        this.board.resetPlayerTime();
        this.comms.requestForceMove(lastPlay.moveColor, startCoords, destCoords);
        if (lastPlay.eatenPiece != null) {
            this.board.secondaryBoard.updateQueued();
            this.board.bringBackEatenPiece(lastPlay.eatenPiece, lastPlay.eatenAtCol, lastPlay.eatenAtLine);
            this.comms.requestPlacePiece(lastPlay.eatenPiece, lastPlay.eatenAtCol + 1, lastPlay.eatenAtLine + 1, true);
        }
    }

    this.movieButton = function() {
        if (this.board.playSequence.length == 0) {
            return;
        }

        this.moviePlaySequence = this.board.playSequence.slice();

        this.board = new MyBoard(this, this.playTimeLimit);
        this.whiteScore = 0;
        this.blackScore = 0;
        this.comms.requestMovieInitialization('multi', 1); // Movie makes plays as if made by Players, to be able to choose positions.
    }
}

XMLscene.prototype.setupMovieCallbacks = function() {
    for (let i = 0; i < this.moviePlaySequence.length; i++) {
        window.setTimeout(this._movieMakePlay.bind(this), i * 1000, this.moviePlaySequence[i]);
    }
}

/**
 * 
 * @param {MyPlay} play 
 */
XMLscene.prototype._movieMakePlay = function(play) {
    let startCoords = {'line': play.startLine + 1, 'col': play.startCol + 1};
    let destCoords = {'line': play.destLine + 1, 'col': play.destCol + 1};
    this.comms.requestPlayerTurn(play.moveColor, startCoords, destCoords);
}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    let i = 0;
    // Lights index.

    // Reads the lights from the scene graph.
    for (let key in this.graph.lights) {
        if (i >= 8)
            break;              // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            let light = this.graph.lights[key];

            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

            this.lights[i].setVisible(true);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();

            this.lights[i].update();

            i++;
        }
    }

}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(0.5, 10, 10),vec3.fromValues(0.5, 0, 0));
}

/**
 * Smoothly move the camera to a new position.
 * @param {vec3} newPosition 
 */
XMLscene.prototype.setupMoveCamera = function(newPosition) {
    this.delta = [];
    this.delta = vec3.subtract(this.delta, newPosition, this.camera.position);
    this.totalCameraMovementTime = 500;
    this.remainingCameraMs = this.totalCameraMovementTime;
}

/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function()
{
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    
    this.axis = new CGFaxis(this,this.graph.referenceLength);

    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

    this.initLights();

    this.interface.addLightsGroup(this.graph.lights);
    //this.interface.addSelectableDropdown(this.graph.selectableNodeIds);
    this.interface.addOptions();

    this.selectableShader = new CGFshader(this.gl, "shaders/selectable.vert", "shaders/selectable.frag");
    this.pickedShader = new CGFshader(this.gl, "shaders/picked.vert", "shaders/picked.frag");

    this.prevTime = Date.now();
    this.setUpdatePeriod(1000.0/60);

    this.board = new MyBoard(this, this.playTimeLimit);

    this.interface.addGameControls();
}

XMLscene.prototype.handlePicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (let i=0; i< this.pickResults.length; i++) {
				let obj = this.pickResults[i][0];
				if (obj) {
                    let customId = this.pickResults[i][1];				
                    console.log("Picked object: " + obj + ", with pick id " + customId);
                    this._handlePlayerMoves(customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

XMLscene.prototype._handlePlayerMoves = function(newPickedId) {
    if (this.pickedId != null && this.pickedId != newPickedId) {
        let startCoords = this.board.getCoordsOfPickedId(this.pickedId);
        let destCoords = this.board.getCoordsOfPickedId(newPickedId);
        startCoords.line++;
        startCoords.col++;
        destCoords.line++;
        destCoords.col++;
        this.comms.requestPlayerTurn(this.board.playerColor, startCoords, destCoords);
        this.pickedId = null;
    } else {
        this.pickedId = newPickedId;
    }
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    this.handlePicking();
    this.clearPickRegistration();

    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();

    if (this.graph.loadedOk)
    {

        // Applies initial transformations.
        this.multMatrix(this.graph.initialTransforms);

		// Draw axis
        this.axis.display();
        
        this.board.display();

        let i = 0;
        for (let key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        // Displays the scene.
        this.graph.displayScene();

    }
	else
	{
		// Draw axis
		this.axis.display();
	}


    this.popMatrix();

    // ---- END Background, camera and axis setup

}

XMLscene.prototype.update = function(currTime) {
    if (!this.board.canStillPlay() && !this.board.requestingPlayerChange && this.board.activeGame) {
        this.board.requestingPlayerChange = true;
        this.comms.requestPlayerChange();
    }
	let y = (Math.sin(currTime / 75) / 2) + 0.5;
	this.selectableShader.setUniformsValues({timeFactor: y, saturatedColor: [1, 0, 1, 1]});
    this.pickedShader.setUniformsValues({pickedColor: [1, 0, 0, 1]});
    let deltaMs = currTime - this.prevTime;
    this.prevTime = currTime;
    this.graph.update(deltaMs);
    this._cameraIncrement(deltaMs);
}

XMLscene.prototype._cameraIncrement = function(deltaMs) {
    if (this.delta == null) {
        return;
    }

    let msToMove;

    if (this.remainingCameraMs >= deltaMs) {
        msToMove = deltaMs;
    } else if (this.remainingCameraMs > 0) {
        msToMove = this.remainingCameraMs;
    } else {
        msToMove = 0;
    }

    let deltaInc = [];
    deltaInc = vec3.scale(deltaInc, this.delta, msToMove / this.totalCameraMovementTime);
    let res = [];
    this.camera.setPosition(vec3.add(res, this.camera.position, deltaInc));
    this.remainingCameraMs -= msToMove;
}