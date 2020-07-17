mouseX = 0;
mouseY = 0;
mouseScroll = 0;
fontSize = 12;
isMouseDown = false;
framesSinceLastMouseDown = 1;
framesSinceLastClick = 1;
keysDown = [""];
keysPressed = [""];
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.pause();
  }
  this.restart = function() {
	  this.sound.currentTime = 0;
  }
  this.setVolume = function(vol) {
	  this.sound.volume = vol;
  }
}
var createImage = function(src, width, height) {
	var image = new Image(width, height);
	image.src = src;
	return image;
}
function initializeGraphics() {
    a.width = screen.width;
    a.height = screen.height;
}
function reinitializeGraphics() {
    a.style.width = screen.width+"px";
    a.style.height = screen.height+"px";
	partSizeX = 20/can.width*sw;
	partSizeY = 20/can.height*sh;
}
function saveGameVarAdd(varString,val) {
  eval(varString+"="+JSON.stringify(val));
  saveGameVars.push([varString,val]);
}
function saveGame(number) {
	saveString = "";
	for (i = 0; i < saveGameVars.length;i++) {
		eval("saveString += JSON.stringify("+saveGameVars[i][0]+")+'¿'");
	}
	fs.writeFileSync("game saves/save"+number.toString(10)+".txt",saveString);
	gameSaves[number] = true;
	fs.writeFileSync("game saves/gameSaves.txt",JSON.stringify(gameSaves));
}
function loadGame(number) {
	loadString = fs.readFileSync("game saves/save"+number.toString(10)+".txt",'utf8');
	loadString = loadString.split("¿");
	for (i = 0; i < saveGameVars.length;i++) {
		eval(saveGameVars[i][0]+"="+loadString[i]);
	}
}
var Xadjust = function(arg) {
	return arg/sw*can.width;
}
var Yadjust = function(arg) {
	return arg/sh*can.height;
}
var Xadjust2 = function(arg) {
	return arg*sw/can.width;
}
var Yadjust2 = function(arg) {
	return arg*sh/can.height;
}
var gameAlert = function(string) {
	alertMessage = string;
	alertFrames = 180;
}
var setFont = function(size,type) { //example: "30px Arial"
	fontSize = size;
	ctx.font = Yadjust(size).toString(10)+"px "+type;
}
var setAlpha = function(arg) {
	ctx.globalAlpha = arg;
}
var textWidth = function(arg) {
	return (ctx.measureText(arg).width)/2;
}
var setColor = function(arg) {
	ctx.fillStyle = arg;
	ctx.strokeStyle = arg;
}

//Graphics

var fillText = function(arg, x, y, bool) {
	if (bool == true) {
		ctx.fillText(arg, Xadjust(x)-textWidth(arg), Yadjust(y+fontSize/3)); //x-centered, y-centered
	} else if (bool == false) {
		ctx.fillText(arg, Xadjust(x), Yadjust(y+fontSize/3)); //x not centered, y-centered
	}
}
var drawText = function(arg, x, y, lineWidth, bool) {
	ctx.lineWidth = lineWidth;
	if (bool == true) {
		ctx.strokeText(arg, Xadjust(x)-textWidth(arg), Yadjust(y+fontSize/3));
	} else if (bool == false) {
		ctx.strokeText(arg, Xadjust(x), Yadjust(y));
	}
}
var fill = function(color) {
	ctx.fillStyle = color;
	ctx.fillRect(0,0,can.width,can.height);
}
var fillRect = function(x, y, w, h, isCentered) {
	x -= isCentered*w/2;
	y -= isCentered*h/2;
	ctx.fillRect(Xadjust(x), Yadjust(y), Xadjust(w), Yadjust(h));
}
var drawRect = function(x, y, w, h, isCentered, lineWidth) {
	ctx.lineWidth = lineWidth;
	x -= isCentered*w/2;
	y -= isCentered*h/2;
	ctx.beginPath();
	ctx.rect(Xadjust(x), Yadjust(y), Xadjust(w), Yadjust(h));
	ctx.stroke();
}
var drawCircle = function(x, y, r, lineWidth) {
	ctx.lineWidth = lineWidth;
	ctx.beginPath();
	ctx.arc(Xadjust(x), Yadjust(y), Xadjust(r), 0, 2*Math.PI);
	ctx.stroke();
}
var fillCircle = function(x, y, r) {
	ctx.beginPath();
	ctx.arc(Xadjust(x), Yadjust(y), Xadjust(r), 0, 2*Math.PI);
	ctx.fill();
}
var drawLineWidth = function(x1, y1, x2, y2, width) {
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(Xadjust(x1),Yadjust(y1));
	ctx.lineTo(Xadjust(x2),Yadjust(y2));
	ctx.stroke();
	ctx.lineWidth = 1;
}
var drawLine = function(x1, y1, x2, y2) {
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(Xadjust(x1),Yadjust(y1));
	ctx.lineTo(Xadjust(x2),Yadjust(y2));
	ctx.stroke();
}
var drawRoundedRect = function(x,y,width,height,radius,lineWidth,isCentered) {
	ctx.lineWidth = lineWidth;
	x -= isCentered*width/2;
	y -= isCentered*height/2;
    ctx.beginPath();
    ctx.moveTo(Xadjust(x+radius),Yadjust(y));
    ctx.arcTo(Xadjust(x+width),Yadjust(y),Xadjust(x+width),Yadjust(y+radius),Xadjust(radius));
    ctx.arcTo(Xadjust(x+width),Yadjust(y+height),Xadjust(x+width-radius),Yadjust(y+height),Xadjust(radius)); 
    ctx.arcTo(Xadjust(x),Yadjust(y+height),Xadjust(x),Yadjust(y+height-radius),Xadjust(radius));
    ctx.arcTo(Xadjust(x),Yadjust(y),Xadjust(x+radius),Yadjust(y),Xadjust(radius));
    ctx.stroke();
	ctx.lineWidth = 1;
}
var fillRoundedRect = function(x,y,width,height,radius,isCentered) {
    x -= isCentered*width/2;
	y -= isCentered*height/2;
	ctx.beginPath();
    ctx.moveTo(Xadjust(x+radius),Yadjust(y));
    ctx.arcTo(Xadjust(x+width),Yadjust(y),Xadjust(x+width),Yadjust(y+radius),Xadjust(radius));
    ctx.arcTo(Xadjust(x+width),Yadjust(y+height),Xadjust(x+width-radius),Yadjust(y+height),Xadjust(radius)); 
    ctx.arcTo(Xadjust(x),Yadjust(y+height),Xadjust(x),Yadjust(y+height-radius),Xadjust(radius));
    ctx.arcTo(Xadjust(x),Yadjust(y),Xadjust(x+radius),Yadjust(y),Xadjust(radius));
    ctx.fill();
}
var drawRotatedImage = function(arg, x, y, rad) {
	ctx.save();
	ctx.translate(Xadjust(x), Yadjust(y));
	ctx.rotate(rad);
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(arg, Xadjust(-(arg.width/2)), Yadjust(-(arg.height/2)),Xadjust(arg.width),Yadjust(arg.height));
	ctx.restore();
}
var drawRotatedImageSize = function(arg, x, y, w, h, rad) {
	ctx.save();
	ctx.translate(Xadjust(x), Yadjust(y));
	ctx.rotate(rad);
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(arg, Xadjust(-w/2), Yadjust(-h/2),Xadjust(w),Yadjust(h));
	ctx.restore();
}
var drawImage = function(arg, x, y, isCentered, isNewScreen) {
	x -= isCentered*arg.width/2;
	y -= isCentered*arg.height/2;
	ctx.imageSmoothingEnabled = false;
	if (isNewScreen) {
		ctx.drawImage(arg, Xadjust(x), Yadjust(y),Xadjust(arg.width),Yadjust(arg.height));
	} else {
		ctx.drawImage(arg,x,y,arg.width,arg.height);
	}
}
var drawImageSize = function(arg, x, y, w, h, isCentered, isNewScreen) {
	x -= isCentered*w/2;
	y -= isCentered*h/2;
	ctx.imageSmoothingEnabled = false;
	if (isNewScreen) {
		ctx.drawImage(arg, Xadjust(x), Yadjust(y),Xadjust(w),Yadjust(h));
	} else {
		ctx.drawImage(arg,x,y,w,h);
	}
}

//Collision

var isRectOverlap = function(x1,y1,w1,h1,x2,y2,w2,h2,isInclusive) { // X/Yadjust does not matter
	xMin = Math.max(x1,x2);
	xMax = Math.min(x1+w1,x2+w2);
	yMin = Math.max(y1,y2);
	yMax = Math.min(y1+h1,y2+h2);
	if (isInclusive) {
		return xMin <= xMax && yMin <= yMax;
	} else {
		return xMin < xMax && yMin < yMax;
	}
}

//Events

function getMouseX(evt) {
    var rect = a.getBoundingClientRect();
    var temp = evt.clientX - rect.left;
	return temp*sw/can.width;
}
function getMouseY(evt) {
    var rect = a.getBoundingClientRect();
    var temp = evt.clientY - rect.top;
	return temp*sh/can.height;
}
var doKeyDown = function(c2) {
	c = c2.key;
	if (!keysPressed.includes(c) && !keysDown.includes(c)) {
		keysPressed.push(c);
	}
	if (!keysDown.includes(c)) {
		keysDown.push(c);
	}
}
var doKeyUp = function(c2) {
	c = c2.key;
	keysDown.splice(keysDown.indexOf(c),1);
}
var doMouseMove = function(evt) {
	mouseX = getMouseX(evt);
	mouseY = getMouseY(evt);
}
var doMouseWheel = function(evt) {
  mouseScroll = evt.deltaY;
}
var doMouseUp = function() {
	isMouseDown = false;
	mouseDownBeingUsed = false;
}
var doMouseDown = function() {
	isMouseDown = true;
	framesSinceLastMouseDown = 0;
}
var isMouseClick = function() {
	return framesSinceLastClick == 0;
}
var doMouseClick = function() {
	framesSinceLastClick = 0;
}
var isKeyDown = function(thang) {
	for(var i = 0; i < keysDown.length; i++) {
		if (keysDown[i] == thang) {
			return true;
			break;
		}
	}
}
var isKeyPressed = function(thang) {
	for(var i = 0; i < keysPressed.length; i++) {
		if (keysPressed[i] == thang) {
			return true;
		}
	}
}