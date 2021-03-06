var caughtpos = [0.0,0.2,0.0],
t = 0.0,
jarlightidx = 0;
jarcapacity = 10.0;
djarintensity = 5.0;

// a light is a firefly
function Light(name){
	this.id = name;
	this.startposition = avoidHouse([Math.random()*32-16,0.25,Math.random()*32-16]);
	this.position = this.startposition.slice(0);
	this.ambient = [1.0,1.0,1.0];
	this.diffuse = [0.3,0.3,0.2];
	this.specular = [0.05,0.05,0.05];
	
	// is_caught[0] specifies whether or not the firefly is caught
	// is_caught[1] specifies how much light the firefly has left
	this.is_caught = [0.0, 1.0];
	
	// used to move uncaught fireflies
	this.dr = [Math.random()*0.2,Math.random()*0.1,Math.random()*0.2];
	this.w = [2 * Math.PI * Math.random()*0.02,
		  2 * Math.PI * Math.random()*0.02, 2 * Math.PI * Math.random()*0.02];
}

Light.prototype.setIsCaught = function(p){
	this.is_caught = p.slice(0);
}
Light.prototype.setPosition = function(p){
	this.position = p.slice(0);
}
Light.prototype.setDiffuse = function (d){
	this.diffuse = d.slice(0);
}

Light.prototype.setAmbient = function(a){
	this.ambient = a.slice(0);
}

Light.prototype.setSpecular = function(s){
	this.specular = s.slice(0);
}

Light.prototype.setProperty = function(pName, pValue){
	if(typeof pName == 'string'){
		if (pValue instanceof Array){
			this[pName] = pValue.slice(0);
		}
		else {
			this[pName] = pValue;
		}
	}
	else{
		throw 'The property name must be a string';
	}
}

var Lights = {
	list : [],
	add : function(light){
		if (!(light instanceof Light)){
			alert('the parameter is not a light');
			return;
		}
		this.list.push(light);
	},
	
	getArray: function(type){
		var a = [];
		for(var i = 0, max = this.list.length; i < max; i+=1){
			a = a.concat(this.list[i][type]);
		}
		return a;
	},

	get: function(idx){
		if ((typeof idx == 'number') && idx >= 0 && idx < this.list.length){
			return this.list[idx];
		}
		else if (typeof idx == 'string'){
			for(var i=0, max = this.list.length; i < max; i+=1){
				if (this.list[i].id == idx) return this.list[i];
			}
			throw 'Light ' + idx + ' does not exist';
		}
		else {
			throw 'Unknown parameter';
		}
	},

	dimLights: function(delta){
		this.list[jarlightidx].is_caught[1] =
			Math.max(this.list[jarlightidx].is_caught[1] - delta, 0.0);
		return;
	},
	
	catchLight: function(idx, pos){
		console.log('position was ' + this.list[idx].startposition);
		this.list[idx].startposition = pos.slice(0);
		this.list[idx].position = pos.slice(0);
		console.log('new pos is ' + pos);
		this.list[jarlightidx].is_caught[1] = Math.max(this.list[jarlightidx].is_caught[1] + djarintensity,jarcapacity);
		return;		
	},
	
	animateLights: function (){
		t += 1.0;
		for(var i = 0, max = this.list.length; i < max; i+=1){
			// if the light is not caught then move it
			if(this.list[i].is_caught[0] == 0.0) {
				for(var j = 0; j < 3; j+=1){
					this.list[i].position[j] = this.list[i].startposition[j] +
						(this.list[i].dr[j] * 0.5 *
						(Math.sin(this.list[i].w[j] * Math.sin(this.list[i].w[j]* .01 * t) * t) +
						Math.cos(this.list[i].w[j]*t)));
				}
			}
		}
		return;
	},
	
	setJarLight: function (idx){
		jarlightidx = idx;
		this.list[idx].position = caughtpos;
		this.list[idx].is_caught = [1.0,5.0];
		return;
	},
	
	checkJarLight: function (){
		return this.list[jarlightidx].is_caught[1]/jarcapacity;
	}
}