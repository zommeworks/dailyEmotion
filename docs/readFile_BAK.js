/********************
 VARIABLE DECLARATION
*********************/
// constants
var DAY_LENGTH = 60;
var LIST_LEFT;
var USER_LANG = navigator.language || navigator.userLanguage;
var ID_SCROLL_PREV = 'box_prev';
var ID_SCROLL_NEXT = 'box_next';
var ID_DAYLIST = 'box-daylist';
var ID_VIEWPORT = 'layer_viewport';
var ID_NEEDLE = 'obj_needle';
var FRAMERATE = 1000/50;
var HOVERSPEED = 20;
var ACC_T_INCREASE = 30;
var ACC_T_ZERO = 20;
var ACC_T_DECREASE = 10;
// control variables
var listSpeed;
var v0 = 0;
var acc = 0;
var acc_t_count = 0;
// object
var daylist = document.createElement('div');
	daylist.id = ID_DAYLIST;
	daylist.classList.add('container-daylist');
var viewport = document.createElement('div');
	viewport.id = ID_VIEWPORT;
	viewport.classList.add('container-viewport');
var dayBox = [];
var stitchBox = [];
var stitch = [];
// decorative objects
var dimLeft = document.createElement('div');
	dimLeft.classList.add('container-left');
var dimRight = document.createElement('div');
	dimRight.classList.add('container-right');
var scrollBoxPrev = document.createElement('div');
	scrollBoxPrev.setAttribute('id', ID_SCROLL_PREV);
	scrollBoxPrev.classList.add('container-scroll-prev');
var scrollBoxNext = document.createElement('div');
	scrollBoxNext.setAttribute('id', ID_SCROLL_NEXT);
	scrollBoxNext.classList.add('container-scroll-next');
var needleBox = document.createElement('div');
	needleBox.classList.add('container-needle');
var needleImage = document.createElement('object');
	needleImage.setAttribute('id', ID_NEEDLE);
	needleImage.setAttribute('data', 'assets/needle.svg');
	needleImage.setAttribute('type', 'image/svg+xml');
	needleImage.classList.add('img-needle');


if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
 alert('mobile browser!');
}

/**************************
 * PUT COMPONENTS ON SCREEN
 **************************/
for(i = 0; i < DAY_LENGTH; i++){
	dayBox.push(document.createElement('div'));
	if(i != DAY_LENGTH-1){
		stitchBox.push(document.createElement('div'));
		stitch.push(document.createElement('div'));
		stitchBox[i].classList.add('container-stitch');
		stitch[i].classList.add('fill-stitch');
		stitchBox[i].appendChild(stitch[i]);
	}
	dayBox[i].classList.add('container-day');
	if(i == DAY_LENGTH-1){
		needleBox.appendChild(needleImage);
		dayBox[i].appendChild(needleBox);
	}else{
		dayBox[i].appendChild(stitchBox[i]);
	}
	daylist.appendChild(dayBox[i]);
}
viewport.appendChild(daylist);
document.getElementsByClassName('container-body')[0].appendChild(viewport);
document.getElementsByClassName('container-body')[0].appendChild(dimLeft);
document.getElementsByClassName('container-body')[0].appendChild(dimRight);
document.getElementsByClassName('container-body')[0].appendChild(scrollBoxPrev);
document.getElementsByClassName('container-body')[0].appendChild(scrollBoxNext);
LIST_LEFT = daylist.getBoundingClientRect().left;
document.getElementsByClassName('container-body')[0].onresize = function(){
	LIST_LEFT = daylist.getBoundingClientRect().left;
};
/******************
 * DYNAMIC CONTROLS
 ******************/

var eventRepeater = setInterval(function(){moveX(daylist)}, FRAMERATE);
scrollBoxPrev.onmousemove = function(e){
	var w = this.getBoundingClientRect().width;
	var mX = e.clientX;
	var d = w - mX;
	v0 = HOVERSPEED*d/w;
	/*
	var d = this.getBoundingClientRect().width;
	var mX = e.clientX;
	v0 = HOVERSPEED*(mX-d)/d;
	*/
};
scrollBoxPrev.onmouseout = function(e){
	v0 = 0;
};
scrollBoxNext.onmousemove = function(e){
	var w = this.getBoundingClientRect().width;
	var mX = e.clientX;
	var d = window.innerWidth - w - mX;
	v0 = HOVERSPEED*d/w;
	/*
	var w = this.getBoundingClientRect().width;
	var mX = e.clientX;
	var d = window.innerWidth - w;
	v0 = HOVERSPEED*(mX-d)/w;
	*/
};
scrollBoxNext.onmouseout = function(e){
	v0 = 0;
};
document.onwheel = function(e){
	acc = (-0.2)*e.deltaY;
	acc_t_count = ACC_T_INCREASE;
}


////////////////////////////////////////////////////////////////////////////////
/***********
 * FUNCTIONS
 ***********/
function moveX(obj){
	var x0 = obj.getBoundingClientRect().left;
	var x = x0 + v0 + vAcc();
	if(x > 0){
		x = 0;
	}
	else if(x < LIST_LEFT){
		x = window.innerWidth - w0;
	}
	else{
		//do nothing
	}
	setX(obj, x);
}
function vAcc(){
	var vA;
	if(acc_t_count > ACC_T_ZERO){
		vA = acc*(ACC_T_INCREASE - acc_t_count)/(ACC_T_INCREASE - ACC_T_ZERO)/2;
		acc_t_count--;
	}
	else if(acc_t_count > ACC_T_DECREASE){
		vA = acc;
		acc_t_count--;
	}
	else if(acc_t_count > 0){
		vA = acc -acc*(ACC_T_DECREASE - acc_t_count)/(ACC_T_ZERO - ACC_T_DECREASE)/2;
		acc_t_count--;
	}
	else{
		//do nothing
		vA = 0;
		acc = 0;
	}
	return vA;
}
function setX(obj, x){
	obj.style.left = x + "px";
}