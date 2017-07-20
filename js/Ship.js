function Ship() {
    this.r = 0.03; //ray
    this.rear_a = 50; //rear ray
    this.a = 0; //angle
    this.x = VAR.W / 2; // center horizontally
    this.y = VAR.H / 2; // center vertically
    this.modX = 0; // modification X
    this.modY = 0; // modifucation Y
    this.acc = 0.0004; // acceleration
    this.maxMod = 0.018;
    this.points = [{},{},{}]; // points of ship
}

Ship.prototype.hitTest = function() {
    for (var i = 0; i < this.points.length; i++) {
        for(var r in Rock.all) {
            if(Rock.all[r].hitTest(this.points[i].x, this.points[i].y)) {
                Rock.all[r].remove();
                return true;
            }
        }
    }
    return false;
};

Ship.prototype.draw = function() {
    if(!this.destroyed) {
        if (this.hitTest()) {
            this.destroyed = true;
            Game.stop();
        } else {
            if (Game.key_37 || Game.key_39) {
                this.a = this.a + 8 * (Game.key_37 ? -1 : 1);
            }
            if (Game.key_38) {
                this.modX = Math.max(-this.maxMod * VAR.d, Math.min(this.maxMod * VAR.d, this.modX + Math.sin(Math.PI / 180 * this.a) * this.acc * VAR.d));
                this.modY = this.modY + -Math.cos(Math.PI / 180 * this.a) * this.acc * VAR.d;
            } else {
                this.modX = this.modX * 0.98;
                this.modX = Math.abs(this.modX) < 0.001 ? 0 : this.modX;
                this.modY = this.modY * 0.98;
                this.modY = Math.abs(this.modY) < 0.001 ? 0 : this.modY;
            }
            this.x += this.modX;
            this.y += this.modY;

            Game.ctx.beginPath();
            for (var i = 0; i < 3; i++) {
                this.tmp_a = i === 0 ? this.a : (this.a + 180 + (i == 1 ? this.rear_a : -this.rear_a));
                this.tmp_r = i === 0 ? this.r : this.r * 0.5;
                this.points[i].x = Math.sin(Math.PI / 180 * this.tmp_a) * this.tmp_r * VAR.d + this.x;
                this.points[i].y = -Math.cos(Math.PI / 180 * this.tmp_a) * this.tmp_r * VAR.d + this.y;
                Game.ctx[i === 0 ? 'moveTo' : 'lineTo'](this.points[i].x, this.points[i].y);
            }
            Game.ctx.closePath();
            Game.ctx.stroke();

            if (Game.key_38 && this.draw_thrust) {
                this.draw_thrust = false;
                Game.ctx.beginPath();
                for (var j = 0; j < 3; j++) {
                    this.tmp_a = j != 1 ? this.a + 180 + (j === 0 ? -this.rear_a + 14 : this.rear_a - 14) : this.a + 180;
                    this.tmp_r = j == 1 ? this.r : this.r * 0.4;
                    Game.ctx[j === 0 ? 'moveTo' : 'lineTo'](
                        Math.sin(Math.PI / 180 * this.tmp_a) * this.tmp_r * VAR.d + this.x,
                        -Math.cos(Math.PI / 180 * this.tmp_a) * this.tmp_r * VAR.d + this.y
                    );
                }
                Game.ctx.stroke();
            } else if(Game.key_38 && !this.draw_thrust) {
                this.draw_thrust = true;
            }

            if (this.points[0].x < 0 && this.points[1].x < 0 && this.points[2].x < 0) {
                this.x += VAR.W - Math.min(this.points[0].x, this.points[1].x, this.points[2].x) * 0.9;
            } else if (this.points[0].x > VAR.W && this.points[1].x > VAR.W && this.points[2].x > VAR.W) {
                this.x -= VAR.W - (VAR.W - Math.max(this.points[0].x, this.points[1].x, this.points[2].x)) * 0.9;
            }
            if (this.points[0].y < 0 && this.points[1].y < 0 && this.points[2].y < 0) {
                this.y += VAR.H - Math.min(this.points[0].y, this.points[1].y, this.points[2].y) * 0.9;
            } else if (this.points[0].y > VAR.H && this.points[1].y > VAR.H && this.points[2].y > VAR.H) {
                this.y -= VAR.H - (VAR.H - Math.max(this.points[0].y, this.points[1].y, this.points[2].y)) * 0.9;
            }
        }
    }
};
