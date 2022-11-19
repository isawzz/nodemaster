
function mTag(tag,inner=null,dParent=null,styles={},id=null,classes=null){

	let el=mCreate(tag);
	if (isdef(dParent)) mAppend(el,dParent);
	if (isdef(styles)) mStyle(el,styles);
	if (isdef(id)) el.id=id;
	if (isdef(inner)) el.innerHTML = inner;
	if (isdef(classes)) mClass(el,classes);
	return el;

}






















