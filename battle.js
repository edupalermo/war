// Class Battle
function Battle() {

	var team;
	
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
		// Draw dead ones
		for (var t = 0; t < this.team.length; t++) {
			for (var i = 0; i < this.team[t].length; i++) {
				if (!this.team[t][i].isAlive()) {
					this.team[t][i].draw(ctx, t);
				}
			}			
		}
		
		// Draw live ones
		for (var t = 0; t < this.team.length; t++) {
			for (var i = 0; i < this.team[t].length; i++) {
				if (this.team[t][i].isAlive()) {
					this.team[t][i].draw(ctx, t);
				}
			}			
		}
		
		var barWidth = 1000 - 20;
		
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
		
	};
	
	this.movePieces = function() {
		for (var t = 0; t < this.team.length; t++) {
			for (var i = 0; i < this.team[t].length; i++) {
				this.team[t][i].move(this, t);
			}			
		}
	};

}
