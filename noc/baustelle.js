
function abaxis(x,min1,max1,min2,max2){
	//returns x E [min1,max2] abgebildet auf [min2,max2]
	return (x-min1)*((max2-min2)/(max1-min1)) + min2;
}
var SICHERER=100;
function search_end_point(f,min,max){
	if (SICHERER-- <0) {console.log('!!!!!!!!!!');return 0;}
	let x=min + (max-min)/2;
	let y = f(x);
	if (y>.1){return search_end_point(f,x,max);}
	else if (y<.02){return search_end_point(f,min,x);}
	else return x;
}















