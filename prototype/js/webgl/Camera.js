/**
*   Camera
*/

function Camera(){
    this.matrix     = mat4.create();
    this.up         = vec3.create();
    this.right      = vec3.create();
    this.normal     = vec3.create();
    this.position   = vec3.create();
    this.focus      = vec3.create();
    this.azimuth    = 0.0;
    this.elevation  = 0.0;
    this.steps      = 0;
    this.speed = 0;
    this.lastWalkTime = 0;
    
    this.home = vec3.create();
      
    this.hookRenderer = null;
    this.hookGUIUpdate = null;
    
    this.FOV = 30;
    this.minZ = 0.1;
    this.maxZ = 10000
}

Camera.prototype.goHome = function(h){
    if (h != null){
        this.home = h;
    }
    
    this.setPosition(this.home);
    this.setAzimuth(0);
    this.setElevation(0);
    this.steps = 0;
}

Camera.prototype.dolly = function(s){
    var c = this;
    
    var p =  vec3.create();
    var n = vec3.create();
    
    p = c.position;
    
    var step = s - c.steps;
    
    vec3.normalize(c.normal,n);
    
    var newPosition = vec3.create();
    
    newPosition[0] = p[0] - step*n[0];
    newPosition[1] = p[1] - step*n[1];
    newPosition[2] = p[2] - step*n[2];

	
    c.setPosition(newPosition);
    c.steps = s;
}

Camera.prototype.setPosition = function(p){
    vec3.set(p, this.position);
    this.update();
}

//This operation consists in aligning the normal to the focus vector
Camera.prototype.setFocus = function(f){
	vec3.set(f, this.focus);
	this.update();
}

Camera.prototype.setAzimuth = function(az){
    this.changeAzimuth(az - this.azimuth);
}

Camera.prototype.changeAzimuth = function(az){
    var c = this;
    c.azimuth +=az;
    
    if (c.azimuth > 360 || c.azimuth <-360) {
		c.azimuth = c.azimuth % 360;
	}
    c.update();
}

Camera.prototype.setElevation = function(el){
    this.changeElevation(el - this.elevation);
}

Camera.prototype.changeElevation = function(el){
    var c = this;
    
    c.elevation +=el;
    
    if (c.elevation > 360 || c.elevation <-360) {
		c.elevation = c.elevation % 360;
	}
    c.update();
}

Camera.prototype.calculateOrientation = function(){
	var m = this.matrix;
    mat4.multiplyVec4(m, [1, 0, 0, 0], this.right);
    mat4.multiplyVec4(m, [0, 1, 0, 0], this.up);
    mat4.multiplyVec4(m, [0, 0, 1, 0], this.normal);
}

Camera.prototype.update = function(){
	mat4.identity(this.matrix);
	
	this.calculateOrientation();
    
    mat4.translate(this.matrix, this.position);
    mat4.rotateY(this.matrix, this.azimuth * Math.PI/180);
    mat4.rotateX(this.matrix, this.elevation * Math.PI/180);

    this.calculateOrientation();
    mat4.multiplyVec4(this.matrix, [0, 0, 0, 1], this.position);

    if(this.hookRenderer){
        this.hookRenderer();
    } 
}

Camera.prototype.getViewTransform = function(){
    var m = mat4.create();
    mat4.inverse(this.matrix, m);
    return m;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

Camera.prototype.walk = function() {
    var timeNow = new Date().getTime();
    if (this.lastWalkTime != 0 && this.speed != 0) {
        var elapsed = timeNow - this.lastWalkTime;

        var xDif = Math.sin(degToRad(this.azimuth)) * this.speed * elapsed;
        var zDif = Math.cos(degToRad(this.azimuth)) * this.speed * elapsed;
        var camX = this.position[0];
        var camY = this.position[1];
        var camZ = this.position[2];

        camX = Math.max(Math.min(camX - xDif, 18.0), -18.0);
        camZ = Math.max(Math.min(camZ - zDif, 18.0), -18.0);
        vec3.set([camX, camY, camZ], this.position);

        // Update without re-rendering.
        mat4.identity(this.matrix);
        this.calculateOrientation();
        mat4.translate(this.matrix, this.position);
        mat4.rotateY(this.matrix, this.azimuth * Math.PI/180);
        mat4.rotateX(this.matrix, this.elevation * Math.PI/180);
        this.calculateOrientation();
        mat4.multiplyVec4(this.matrix, [0, 0, 0, 1], this.position);

        console.log(Array.prototype.slice.call(camera.position));
    }

    this.lastWalkTime = timeNow;
}