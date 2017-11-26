class ComboAnimation extends Animation {
    constructor(scene, animations) {
        super(scene);
        this.animations = animations;
        this.elapsedTime = 0;
        for(let i=0; i< this.animations.lenght; i++){
            this.totalTime +=  this.animations[i].totalTime
        }
    }
    
    getTransform(t){
        for(let i=0; i< this.animations.lenght; i++){
            this.elapsedTime +=  this.animations[i].totalTime;
            while(t < elapsedTime){
                this.animations[i].getTransform(t);
            }  
        }
    }
}