var WEBGLAPP_RENDER = undefined;
var reqIdx = null;


function WebGLApp(canvas) {
    this.loadSceneHook = undefined;
    this.configureGLHook = undefined;
    gl = Utils.getGLContext(canvas);
}
  
WebGLApp.prototype.run = function(){
        if (this.configureGLHook == undefined){
            alert('The WebGL application cannot start because the configureGLHook has not been specified'); return;
        }
        if (this.loadSceneHook == undefined){
            alert('The WebGL application cannot start because the loadSceneHook has not been specified'); return;
        }
        if (this.drawSceneHook == undefined){
            alert('The WebGL application cannot start because the drawSceneHook has not been specified'); return;
        }
        
        this.configureGLHook();
        
        this.loadSceneHook();
        
        WEBGLAPP_RENDER = this.drawSceneHook;
        
        renderLoop();
 }
 
 /**
 * Causes immediate rendering
 */
 WebGLApp.prototype.refresh = function(){
    if (WEBGLAPP_RENDER) WEBGLAPP_RENDER();
 }
     
renderLoop = function(){
    if(WEBGLAPP_RENDER){
        WEBGLAPP_RENDER();
        reqIdx = requestAnimFrame(renderLoop);
     }
}

WebGLApp.prototype.stop = function() {
    //debugger;
    window.cancelAnimationFrame(reqIdx);
    WEBGLAPP_RENDER = undefined;
}

WebGLApp.prototype.play = function() {

    WEBGLAPP_RENDER = this.drawSceneHook;
    renderLoop();
}