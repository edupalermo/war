var Arrow = function(sourceX, sourceY, targetX, targetY){  
	this.attack = 35;
	
	this.velocity = 15;
	
	this.x = sourceX;
	this.y = sourceY;
	
	this.sourceX = sourceX;
	this.sourceY = sourceY;
	
	this.targetX = targetX;
	this.targetY = targetY;	
	
	this.live = true;
};

Arrow.prototype.move = function(battle) {
	
	if (this.live) {
		var dx = this.targetX - this.sourceX;
		var dy = this.targetY - this.sourceY;
		var a = Math.sqrt(Math.pow(this.velocity, 2) / (Math.pow(dx, 2) + Math.pow(dy, 2)));
		this.x = dx >= 0 ? Math.min(a * dx + this.x, this.targetX) : Math.max(a * dx + this.x, this.targetX);
		this.y = dy >= 0 ? Math.min(a * dy + this.y, this.targetY) : Math.max(a * dy + this.y, this.targetY);	
		
		if ((this.x == this.targetX) && (this.y == this.targetY)) {
			this.live = false;
			
			for (var t = 0; t < battle.team.length; t++) {
				for (var i = 0; i < battle.team[t].length; i++) {
					if (battle.team[t][i].isAroundPosition(this.x, this.y)) {
						battle.team[t][i].takeAttack(this.attack);
					}
				}
			}
			
		}		
	}
	
}

Arrow.prototype.draw = function(ctx) {
	if (this.live) {
		ctx.fillStyle = "green";
		ctx.strokeStyle = "black";

	}
	else {
		ctx.strokeStyle = "lightgrey";
		ctx.fillStyle = "lightgray";
	}
	ctx.beginPath();
	ctx.rect(Math.round(this.x), Math.round(this.y), 3, 3);
	ctx.fill();
	ctx.stroke();
}

Arrow.prototype.isAlive = function(ctx) {
	return this.live;
}
