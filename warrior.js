// Class Warrior
var Warrior = function(initialX, initialY) {

	this.radius = 5;
	
	this.x = initialX;
	this.y = initialY;
	
	this.maxHealth = 100;
	this.health = 100;
	this.level = 1;
	
	this.velocity = 1;
	
	this.attack = 20;
	this.deffense = 10;
	
	this.target = undefined;
	this.targetReached;
	this.timeNeededToAttack = 800;
	

	this.draw = function(ctx, team) {
	
		if (this.isAlive()) {
			ctx.strokeStyle = "black";
		}
		else {
			ctx.strokeStyle = "lightgrey";
		}
		ctx.lineWidth = "1";
		
		this.drawHealthBar(ctx, 16);
		this.drawAttackBar(ctx, 16);
		this.drawPlayer(ctx, team);
		
	};
		
	this.drawHealthBar = function(ctx, barWidth) {
		ctx.beginPath();
		ctx.rect(Math.round(this.x - (barWidth/2)) , Math.round(this.y) - (this.radius + 5), barWidth, 3);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.stroke();
	
		ctx.beginPath();
		ctx.rect(Math.round(this.x - (barWidth/2)), Math.round(this.y) - (this.radius + 5), Math.round(barWidth * (this.health / this.maxHealth)), 3);
		if (this.health <= (0.3 * this.maxHealth)) {
			ctx.fillStyle = "red";
		}
		else {
			ctx.fillStyle = "yellow";
		}
		ctx.fill();
		ctx.stroke();		
	};

	this.drawAttackBar = function(ctx, barWidth) {
		if (this.isAlive() && (this.target) && (this.target.isAlive())) {
			
			/*
			ctx.beginPath();
			ctx.rect(Math.round(this.x - (barWidth/2)) , Math.round(this.y) - (RADIUS + 9), barWidth, 3);
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.stroke();
			*/
		
			ctx.beginPath();
			var width = Math.round(barWidth * (Math.min((getTimemills() - this.targetReached), this.timeNeededToAttack) / this.timeNeededToAttack));
			ctx.rect(Math.round(this.x - (barWidth/2)), Math.round(this.y) - (this.radius + 9), width, 3);
			ctx.fillStyle = "brown";
			ctx.fill();
			ctx.stroke();		
			
		}

	};

	this.isAlive = function() {
		return this.health > 0;
	};
		
	this.stepToward = function(warrior) {
		var dx = warrior.x - this.x;
		var dy = warrior.y - this.y;
		var a = Math.sqrt(Math.pow(this.velocity, 2) / (Math.pow(dx, 2) + Math.pow(dy, 2)));
		this.x = a * dx + this.x;
		this.y = a * dy + this.y;
	};
	
	this.isNearForAnAttack = function(warrior) {
		var distance = calcDistance(this, warrior);
		return distance <= this.radius * 4 ;
	};
	
	this.isNearEnoughToStartAnAttack = function(warrior) {
		var distance = calcDistance(this, warrior);
		return distance <= this.radius * 3 ;
	};
	
	this.takeAttack = function(attackPower) {
		var newHealth = this.health - Math.max(0, (Math.random() * attackPower) - (Math.random() * this.deffense)); 
		this.health = Math.max(0, newHealth);
	};
	
	this.moveFromAlly = function(battle, team) {
		var overlapped = getOverlap(battle, team, this, this.radius);
		
		if (overlapped) {
			var distanceFromTarget = calcDistance(this, this.target);
			
			if (distanceFromTarget == 0) {
				return;
			}
			
			if (distanceFromTarget < this.velocity) {
				return;
			}
			
			var deltaAngle = Math.acos(1 - (Math.pow(this.velocity, 2) / (2 * Math.pow(distanceFromTarget, 2))));
			
			var deltaX = this.x - this.target.x; 
			var deltaY = this.y - this.target.y; 
			
			var x1 = this.target.x + (deltaX * Math.cos(deltaAngle) - deltaY * Math.sin(deltaAngle));
			var y1 = this.target.y + (deltaX * Math.sin(deltaAngle) + deltaY * Math.cos(deltaAngle));
			
			var x2 = this.target.x + (deltaX * Math.cos(-1 * deltaAngle) - deltaY * Math.sin(-1 * deltaAngle));
			var y2 = this.target.y + (deltaX * Math.sin(-1 * deltaAngle) + deltaY * Math.cos(-1 * deltaAngle));
						
			if (calcDistanceFromPoints(overlapped.x, overlapped.y, x1, y1) > calcDistanceFromPoints(overlapped.x, overlapped.y, x2, y2)) {
				this.x = x1;
				this.y = y1;
			}
			else {
				this.x = x2;
				this.y = y2;
			}
			
			if (isNaN(this.x) || isNaN(this.y)) {
				console.log("Houston we have problem!");
			}
			
		}
	};
}


Warrior.prototype.drawPlayer = function (ctx, team) {
	ctx.beginPath();
	ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2 * Math.PI);
	if (this.isAlive()) {
		ctx.fillStyle = getTeamColor(team);
	}
	else {
		ctx.fillStyle = "lightgrey";
	}
	ctx.fill();
	ctx.stroke();
}

Warrior.prototype.move = function(battle, team) {
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
		else {
			var nearest = getNearest(battle, team, this);
			if (nearest) {
				var distance = calcDistance(this, nearest);
				
				if (this.isNearEnoughToStartAnAttack(nearest)) {
					this.targetReached = getTimemills();
					this.target = nearest;
				}				
				else {
					this.stepToward(nearest);
				}
			}
		}
	}
}

Warrior.prototype.isAroundPosition = function(x, y) {
	return calcDistanceFromPoints(this.x, this.y, x, y) <= this.radius;
}
