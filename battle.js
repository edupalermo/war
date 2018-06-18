// Class Battle
function Battle() {

	var team;

	this.arrows = new Array();
	
	var layers;
	
	var width;
	var height;
	
	this.addWarrior = function(team, warrior) {
		if (!this.team) {
			this.team = new Array();
		}
		if (!this.team[team]) {
			this.team[team] = new Array();
		}
		this.team[team].push(warrior);
	};

	this.draw = function(ctx) {
		
		this.clearLayers();
		
		for (var t = 0; t < this.team.length; t++) {
			for (var i = 0; i < this.team[t].length; i++) {
				if (this.team[t][i].isAlive()) {
					this.team[t][i].draw(this.layers[1].getContext('2d'), t);
				}
				else {
					this.team[t][i].draw(this.layers[0].getContext('2d'), t);
					this.team[t].splice(i--, 1);
				}
			}			
		}
		
		
		for (var a = 0; a < this.arrows.length; a++) {
			if (this.arrows[a].isAlive()) {
				this.arrows[a].draw(this.layers[2].getContext('2d'));
			}
			else {
				this.arrows[a].draw(this.layers[0].getContext('2d'));
				this.arrows.splice(a--, 1);
			}
		}

		
		this.drawInterface(this.layers[3].getContext('2d'));
		
		for (var i=0;i<this.layers.length;i++) {
			ctx.drawImage(this.layers[i], 0, 0);
		}
		
	};
	
	this.drawInterface = function(ctx) {
		var barWidth = this.width - 20;
		
		for (var t = 0; t < this.team.length; t++) {		
			ctx.beginPath();
			ctx.rect(10 , (t * 12) + 5, barWidth, 8);
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.stroke();
		
			ctx.beginPath();
			ctx.rect(10, (t * 12) + 5, Math.round(barWidth * (getHealthFromTeam(this, t) / getMaxHealthFromTeam(this, t))), 8);
			ctx.fillStyle = getTeamColor(t);
			ctx.fill();
			ctx.stroke();
		}
	}
	
	this.movePieces = function() {
		for (var t = 0; t < this.team.length; t++) {
			for (var i = 0; i < this.team[t].length; i++) {
				this.team[t][i].move(this, t);
			}			
		}
		
		for (var a = 0; a < this.arrows.length; a++) {
			this.arrows[a].move(this);
		}

	};
	
	this.setCanvasSize = function(width, height) {
		this.width = width;
		this.height = height;
		this.layers = new Array();
	
		// Layer 0 dead warriors
		// Layer 1 live warriors
		// Layer 2 arrows
		// Layer 3 interface
	
		for (var i = 0; i < 4;i++) {
			var canvas = document.createElement('Canvas');
			canvas.width = width;
			canvas.height = height;
			
			this.layers.push(canvas);
		}
	};
	
	this.clearLayers = function() {
		if (this.layers) {
			// Background layer is not cleared!
			for (var i=1;i<this.layers.length;i++) {
				var doubleBufferContext = this.layers[i].getContext('2d');
				doubleBufferContext.clearRect(0, 0, this.layers[i].width, this.layers[i].height);				
			}
		}
	};

}

Battle.prototype.addArrow = function(arrow) {
	this.arrows.push(arrow);
}