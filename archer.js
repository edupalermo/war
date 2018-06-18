var Archer = function(initialX, initialY){
	Warrior.call(this, initialX, initialY);

	this.timeNeededToAttack = 800;
  
	this.attack = 10;
	this.deffense = 5;
	
	this.velocity = 0.5;
	
	
	this.timeNeededToArrow = 4000;
	this.arrowAttack = 20;
	this.arrowTarget = undefined;
	this.arrowTargetReached = 0;


};

Archer.prototype = chain(Warrior.prototype);

//Archer.prototype = Warrior.prototype;  
//Archer.prototype.constructor = Warrior;



Archer.prototype.move = function(battle, team) {
	if (this.isAlive()) {
		if ((this.target) && (this.target.isAlive())) {
			if (this.isNearForAnAttack(this.target)) {
				if (getTimemills() - this.targetReached >= this.timeNeededToAttack) {
					this.target.takeAttack(this.attack);
					this.targetReached = getTimemills();
				}
				this.moveFromAlly(battle, team);
			}
			else {
				this.target = undefined;
			}
		}
		else if ((this.arrowTarget) && (this.arrowTarget.isAlive())) {
			if (getTimemills() - this.arrowTargetReached >= this.timeNeededToArrow) {
				//this.target.takeAttack(this);
				battle.addArrow(new Arrow(this.x, this.y, this.arrowTarget.x, this.arrowTarget.y));
				this.arrowTarget = undefined;
			}
		}
		else {
			var nearest = getNearest(battle, team, this);
			if (nearest) {
				var distance = calcDistance(this, nearest);
				
				if (this.isNearEnoughToStartAnAttack(nearest)) {
					this.targetReached = getTimemills();
					this.target = nearest;
				}				
				else {
					this.arrowTargetReached = getTimemills();
					this.arrowTarget = nearest;
				}
			}
		}
	}
}

Archer.prototype.drawPlayer = function (ctx, team) {
	if (this.isAlive()) {
		ctx.fillStyle = getTeamColor(team);
	}
	else {
		ctx.fillStyle = "lightgrey";
	}
	
	var h = this.radius * Math.cos(Math.PI / 3); // 60
	var d = this.radius * Math.cos(Math.PI / 6); // 30
	ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.radius);
    ctx.lineTo(this.x - d, this.y + h);
    ctx.lineTo(this.x + d, this.y + h);
    ctx.lineTo(this.x, this.y - this.radius);
	ctx.fill();
	ctx.stroke();
}

