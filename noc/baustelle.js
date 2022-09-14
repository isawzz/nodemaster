
function createTM(canvas,context){
	// private
	var self;
	var m=[1,0,0,1,0,0];
	var cv=canvas;
	var ctx=context
	var reset=function(){ var m=[1,0,0,1,0,0]; }
	var multiply=function(mat){
			var m0=m[0]*mat[0]+m[2]*mat[1];
			var m1=m[1]*mat[0]+m[3]*mat[1];
			var m2=m[0]*mat[2]+m[2]*mat[3];
			var m3=m[1]*mat[2]+m[3]*mat[3];
			var m4=m[0]*mat[4]+m[2]*mat[5]+m[4];
			var m5=m[1]*mat[4]+m[3]*mat[5]+m[5];
			m=[m0,m1,m2,m3,m4,m5];
	}
	var screenPoint=function(transformedX,transformedY){
			// invert
			var d =1/(m[0]*m[3]-m[1]*m[2]);
			im=[ m[3]*d, -m[1]*d, -m[2]*d, m[0]*d, d*(m[2]*m[5]-m[3]*m[4]), d*(m[1]*m[4]-m[0]*m[5]) ];
			// point
			return({
					x:transformedX*im[0]+transformedY*im[2]+im[4],
					y:transformedX*im[1]+transformedY*im[3]+im[5]
			});
	}
	var transformedPoint=function(screenX,screenY){
			return({
					x:screenX*m[0] + screenY*m[2] + m[4],
					y:screenX*m[1] + screenY*m[3] + m[5]
			});    
	}
	// public
	function TransformationMatrix(){
			self=this;
	}
	// shared methods
	TransformationMatrix.prototype.translate=function(x,y){
			var mat=[ 1, 0, 0, 1, x, y ];
			multiply(mat);
	};
	TransformationMatrix.prototype.rotate=function(rAngle){
			var c = Math.cos(rAngle);
			var s = Math.sin(rAngle);
			var mat=[ c, s, -s, c, 0, 0 ];    
			multiply(mat);
	};
	TransformationMatrix.prototype.scale=function(x,y){
			var mat=[ x, 0, 0, y, 0, 0 ];        
			multiply(mat);
	};
	TransformationMatrix.prototype.skew=function(radianX,radianY){
			var mat=[ 1, Math.tan(radianY), Math.tan(radianX), 1, 0, 0 ];
			multiply(mat);
	};
	TransformationMatrix.prototype.reset=function(){
			reset();
	}
	TransformationMatrix.prototype.setContextTransform=function(ctx){
			ctx.setTransform(m[0],m[1],m[2],m[3],m[4],m[5]);
	}
	TransformationMatrix.prototype.resetContextTransform=function(ctx){
			ctx.setTransform(1,0,0,1,0,0);
	}
	TransformationMatrix.prototype.getTransformedPoint=function(screenX,screenY){
			return(transformedPoint(screenX,screenY));
	}
	TransformationMatrix.prototype.getScreenPoint=function(transformedX,transformedY){
			return(screenPoint(transformedX,transformedY));
	}
	TransformationMatrix.prototype.getMatrix=function(){
			var clone=[m[0],m[1],m[2],m[3],m[4],m[5]];
			return(clone);
	}
	// return public
	return(TransformationMatrix);
}



function create_flower(){

}
function flower_draw(x, y, color, angle = 0, petalCount = 1, lineWidth = 3, sz = 10) { 
	function createPetal(length, width) {
		const path = new Path2D();
		path.moveTo(0, 0); // draw outer line
		path.lineTo(length * 0.3, -width);
		path.lineTo(length * 0.8, -width);
		path.lineTo(length, 0);
		path.lineTo(length * 0.8, width);
		path.lineTo(length * 0.3, width);
		path.closePath(); // close the path so that it goes back to start

		// create the line down the middle.
		path.moveTo(0, 0);
		path.lineTo(length, 0);
		return path;
	}
	function drawPetals(x, y, count, startAt, petal) {
		// x,y is center
		// count number of petals
		// startAt is the angle of the first
		const step = (Math.PI * 2) / count;
		CX.setTransform(1, 0, 0, 1, x, y); // set center
		CX.rotate(startAt);  // set start angle
		for (var i = 0; i < count; i += 1) {
			CX.stroke(petal);  // draw a petal
			CX.rotate(step);   // rotate to the next
		}
		CX.setTransform(1, 0, 0, 1, 0, 0);  // restore default
	}
	CX.strokeStyle = color;
	CX.lineWidth = lineWidth;
	const size = 50;// Math.min(cx.canvas.width, cx.canvas.height) * fitScale * 0.5;
	drawPetals(x, y, petalCount, angle, createPetal(sz, sz * .2)); //cx.canvas.width / 2, cx.canvas.height / 2, 5, 0, createPetal(size, size * 0.2));
	CX.beginPath();
	CX.arc(x, y, sz * .15, 0, Math.PI * 2); //cx.canvas.width / 2, cx.canvas.height / 2, size * 0.15, 0, Math.PI * 2);
	CX.fillStyle = color;
	CX.fill();
}











