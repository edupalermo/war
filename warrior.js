// Class Warrior
function Warrior(initialX, initialY) {

	var RADIUS = 5;
	this.x = initialX;
	this.y = initialY;
	
	this.maxHealth = 1000;
	this.health = 1000;
	this.level = 1;
	
	this.velocity = 1;
	
	this.attack = 10;
	this.deffense = 10;
	
	this.target = undefined;
	

	this.draw = function(ctx, team) {
	
		if (this.isAlive()) {
			ctx.strokeStyle = "black";
		}
		else {
			ctx.strokeStyle = "lightgrey";
		}
		ctx.lineWidth = "1";
		
		var barWidth = 16;
		
		ctx.beginPath();
		ctx.rect(Math.round(this.x - (barWidth/2)) , Math.round(this.y) - (RADIUS + 5), barWidth, 3);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.stroke();
	
		ctx.beginPath();
		ctx.rect(Math.round(this.x - (barWidth/2)), Math.round(this.y) - (RADIUS + 5), Math.round(barWidth * (this.health / this.maxHealth)), 3);
		if (this.health <= (0.3 * this.maxHealth)) {
			ctx.fillStyle = "red";
		}
		else {
			ctx.fillStyle = "yellow";
		}
		ctx.fill();
		ctx.stroke();
	
		ctx.beginPath();
		ctx.arc(Math.round(this.x), Math.round(this.y), RADIUS, 0, 2 * Math.PI);
		if (this.isAlive()) {
			ctx.fillStyle = getTeamColor(team);
		}
		else {
			ctx.fillStyle = "lightgrey";
		}
		ctx.fill();
		ctx.stroke();
	};
	
	this.isAlive = function() {
		return this.health > 0;
	}
	
	this.move = function(battle, team) {
		if (this.isAlive()) {
			if ((this.target) && (this.target.isAlive())) {
				if (this.isNearForAnAttack(this.target)) {
					this.target.takeAttack(this);
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
						this.target = nearest;
					}				
					else {
						this.stepToward(nearest);
					}
				}
			}
		}
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
		return distance <= RADIUS * 4 ;
	};
	
	this.isNearEnoughToStartAnAttack = function(warrior) {
		var distance = calcDistance(this, warrior);
		return distance <= RADIUS * 3 ;
	}
	
	this.takeAttack = function(warrior) {
		var newHealth = this.health - Math.max(0, (Math.random() * warrior.attack) - (Math.random() * this.deffense)); 
		this.health = Math.max(0, newHealth);
	}
	
	this.moveFromAlly = function(battle, team) {
		var overlapped = getOverlap(battle, team, this, RADIUS);
		
		if (overlapped) {
			//var actualAngle = Math.atan((this.y - this.target.y) / (this.x - this.target.x));
			var distanceFromTarget = calcDistance(this, this.target);
			
			if (distanceFromTarget == 0) {
				return;
			}
			
			if (distanceFromTarget < this.velocity) {
				return;
			}
			
			//var distanceFromOverlapped = calcDistance(this, overlapped);
			var deltaAngle = Math.acos(1 - (Math.pow(this.velocity, 2) / (2 * Math.pow(distanceFromTarget, 2))));
			
			var deltaX = this.x - this.target.x; 
			var deltaY = this.y - this.target.y; 
			
			var x1 = this.target.x + (deltaX * Math.cos(deltaAngle) - deltaY * Math.sin(deltaAngle));
			var y1 = this.target.y + (deltaX * Math.sin(deltaAngle) + deltaY * Math.cos(deltaAngle));
			
			var x2 = this.target.x + (deltaX * Math.cos(-1 * deltaAngle) - deltaY * Math.sin(-1 * deltaAngle));
			var y2 = this.target.y + (deltaX * Math.sin(-1 * deltaAngle) + deltaY * Math.cos(-1 * deltaAngle));
			
			//console.log("Distance to Target 1: " + calcDistanceFromPoints(this.target.x, this.target.y, x1, y1) + " " + calcDistanceFromPoints(this.x, this.y, x1, y1));
			//console.log("Distance to Target 2: " + calcDistanceFromPoints(this.target.x, this.target.y, x2, y2) + " " + calcDistanceFromPoints(this.x, this.y, x1, y1));
			
			if (calcDistanceFromPoints(overlapped.x, overlapped.y, x1, y1) > calcDistanceFromPoints(overlapped.x, overlapped.y, x2, y2)) {
				this.x = x1;
				this.y = y1;
			}
			else {
				this.x = x2;
				this.y = y2;
			}
			
			if (isNaN(this.x) || isNaN(this.y)) {
				console.log("Quebrou!");
			}
			
		}
	}	
}
