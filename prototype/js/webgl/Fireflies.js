function Firefly(name){
	this.id = name;
	this.position = [0.0,0.0,0.0];
	this.ambient = [0.0,0.0,0.0,0.0];
	this.diffuse = [0.0,0.0,0.0,0.0];
	this.specular = [0.0,0.0,0.0,0.0];
	this.is_caught = [0.0, 0.0];
}

Firefly.prototype.setIsCaught = function(p){
	this.is_caught = p.slice(0);
}
Firefly.prototype.setPosition = function(p){
	this.position = p.slice(0);
}
Firefly.prototype.setDiffuse = function (d){
	this.diffuse = d.slice(0);
}

Firefly.prototype.setAmbient = function(a){
	this.ambient = a.slice(0);
}

Firefly.prototype.setSpecular = function(s){
	this.specular = s.slice(0);
}

Firefly.prototype.setProperty = function(pName, pValue){
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

var Fireflies = {
	list : [],
	add : function(Firefly){
		if (!(Firefly instanceof Firefly)){
			alert('the parameter is not a Firefly');
			return;
		}
		this.list.push(Firefly);
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
			throw 'Firefly ' + idx + ' does not exist';
		}
		else {
			throw 'Unknown parameter';
		}
	}
}