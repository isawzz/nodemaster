
function Star(p) {
  this.x = p.random(-p.width, p.width);
  this.y = p.random(-p.height, p.height);
  this.z = p.random(p.width);
  this.pz = this.z;

  this.update = function(p) {
    this.z = this.z - speed;
    if (this.z < 1) {
      this.z = p.width;
      this.x = p.random(-p.width, p.width);
      this.y = p.random(-p.height, p.height);
      this.pz = this.z;
    }
  };

  this.show = function(p) {
    p.fill(255);
    p.noStroke();

    var sx = p.map(this.x / this.z, 0, 1, 0, width);
    var sy = p.map(this.y / this.z, 0, 1, 0, height);

    var r = p.map(this.z, 0, width, 16, 0);
    p.ellipse(sx, sy, r, r);

    var px = p.map(this.x / this.pz, 0, 1, 0, width);
    var py = p.map(this.y / this.pz, 0, 1, 0, height);

    this.pz = this.z;

    p.stroke(255);
    p.line(px, py, sx, sy);
  };
}
