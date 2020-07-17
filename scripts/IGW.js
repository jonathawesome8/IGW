//Starting making IGW remake: 6/6/2020

//Sounds
gameMusic = new sound("sounds/ToTheDepths.mp3");
battleMusic = new sound("sounds/battleAgainstTime.mp3");
explosionSound = new sound("sounds/explosion.mp3");
//variables that do not change with game save
fs = require('fs');
gameScreen = 0;
resourcesNames = ["Steel","Titanium","Tungsten","Silicon","Fuel"];
resourcesImages = [createImage("images/Steel.png",16,16),createImage("images/Titanium.png",16,16),createImage("images/Tungsten.png",16,16),createImage("images/Silicon.png",16,16),createImage("images/FuelResource.png",16,16)];
partImages = [createImage("images/Command Module.png",40,20),createImage("images/Ammo.png",20,40),createImage("images/Living Quarters.png",40,40),createImage("images/Food.png",40,20),createImage("images/Water.png",40,20),createImage("images/Small Gun.png",20,40),createImage("images/Small Engine.png",20,20),createImage("images/Medium Engine.png",40,40),createImage("images/Fuel.png",40,20),createImage("images/Cargo.png",60,60)];
explosionImage = createImage("images/explosion.png",500,500);
galaxyImage = createImage("images/galaxy1.png",2700,2700);
parts = [["Command Module",partImages[0],2,1,100],["Ammo",partImages[1],1,2,100],["Living Quarters",partImages[2],2,2,200],["Food",partImages[3],2,1,100],["Water",partImages[4],2,1,100],["Small Gun",partImages[5],1,2,200],["Small Engine",partImages[6],1,1,100],["Medium Engine",partImages[7],2,2,400],["Fuel",partImages[8],2,1,100],["Cargo",partImages[9],3,3,500]]; //name, image, width, height, hp
weaponsDamage = {
	"Small Gun" : 50,
	"Medium Gun" : 200
}
weaponsFOV = [];
weaponsPointer = {};
gameSaves = JSON.parse(fs.readFileSync("game saves/gameSaves.txt",'utf8')); //which of the 3 game saves have been used
partSizeX = 20/can.width*sw;
partSizeY = 20/can.height*sh;
saveGameVars = [];
partDragOffsetX = 0;
partDragOffsetY = 0;
//variables that change with game save
saveGameVarAdd('ships',[]); //all ships
saveGameVarAdd('shipParts',[]); //parts of the ship being built: number, x, y, w, h, rotation, hp, wall level
saveGameVarAdd('enemyShipParts',[]);
saveGameVarAdd('resourcesAmounts',[5000,1500,1000,500,20000]);
saveGameVarAdd('currentGalaxy',0);
saveGameVarAdd('currentSystem',0);
saveGameVarAdd('currentPlanet',0);
saveGameVarAdd('money',50000);
saveGameVarAdd('shipCost',[0,0,0,0]);
saveGameVarAdd('previousShipPart',[0,0,0,0,0,0,0,0]); //ship part that you just picked up off of your ship
saveGameVarAdd('isDraggingPreviousShipPart',false);
saveGameVarAdd('hasCommandModule',false);
saveGameVarAdd('partsMenuY',100);
saveGameVarAdd('shipPartsSplice',-1);
saveGameVarAdd('draggingPartRotation',0);
saveGameVarAdd('shipOffsetX',0);
saveGameVarAdd('shipOffsetY',0);
saveGameVarAdd('shipOffsetOffsetX',0);
saveGameVarAdd('shipOffsetOffsetY',0);
saveGameVarAdd('tempShipOffsetX',0);
saveGameVarAdd('tempShipOffsetY',0);
saveGameVarAdd('mouseIsOnPart',false);
saveGameVarAdd('isDraggingOffset',false);
saveGameVarAdd('draggingPart',-1); //the number of the part that is currently being dragged, -1 when no part is being dragged
saveGameVarAdd('zoomSize',20); //in pixels
saveGameVarAdd('alertFrames',0);
saveGameVarAdd('alertMessage',"");
saveGame(0); //0 is no progress

initializeGraphics(); //Window resize events may re-trigger this function.
window.addEventListener("keydown", doKeyDown, true);
window.addEventListener("keyup", doKeyUp, true);
window.addEventListener("mousemove", doMouseMove, true);
window.addEventListener("click", doMouseClick, true);
window.addEventListener("mouseup", doMouseUp, true);
window.addEventListener("mousedown", doMouseDown, true);
window.addEventListener("wheel", doMouseWheel, true);
//Main Loop
var oneachframe = function() {
	reinitializeGraphics();
	if (isKeyPressed("Escape")) { process.exit(1) }
	if (gameScreen != 7) { //Music
		battleMusic.stop();
		gameMusic.play();
	} else {
		gameMusic.stop();
		battleMusic.play();
	}
	if (isKeyPressed('4')) {
		gameScreen = 13;
		planetRads = [50,100,200]; //orbital radius
		planetMotionFrames = 0;
		zoomSize = 1;
		offsetX = 0;
		offsetY = 0;
		offsetPlanetX = 0; //offset that planet makes by being clicked on
		offsetPlanetY = 0;
		tempOffsetX = 0;
		tempOffsetY = 0;
		offsetOffsetX = 0;
		offsetOffsetY = 0;
		isDraggingOffset = false;
		planetFocus = -1;
//		shipR = 50; //1 pixel = 1 million miles
//		shipV = Math.sqrt(1/shipR)+.02;
		shipR = 93;
		shipV = Math.sqrt(1/shipR);
		shipR2 = 70; //planet 2 radius
	}
	if (isKeyPressed('3')) {
		gameScreen = 12;
	}
	if (isKeyPressed('2')) {
		loadGame(1);
		gameScreen = 7;
		battleMusic.restart();
		enemyShipParts = [...shipParts];
		zoomSize = 1;
		partUsing = -1;
		isDD3 = false;
		firingBlockStats = [false,0,0,0,0,0]; //is firing, lineXd, lineYd, startX, startY, frame
		isExploding = false;
		blockHit = -1;
		fireMessage = "Select a block to fire at";
		fireMessageColor = "white";
	}
	if (isKeyPressed('1')) {
		gameScreen = 1;
		zoomSize = 20;
	}
	if (gameScreen == 0) {
		fill("black");
		setFont(48,"Arial");
		setColor("white");
		fillText("INTERGALACTIC WARFARE",400,35,true);
		setColor("red");
		drawText("INTERGALACTIC WARFARE",400,35,2,true);
		setColor("white");
		setFont(18,"Arial");
		fillText("New Game",400,175,true);
		fillText("Load Game",400,225,true);
		fillText("Settings",400,275,true);
		if (mouseX >= 340 && mouseX <= 460 && mouseY >= 160 && mouseY <= 190) {
			setColor("red");
			if (framesSinceLastMouseDown == 0) {
				loadGame(0); //no progress
				gameScreen = 1;
			}
		}
		drawRoundedRect(400,175,120,30,5,1,true);
		setColor("white");
		if (mouseX >= 340 && mouseX <= 460 && mouseY >= 210 && mouseY <= 240) {
			setColor("red");
			if (framesSinceLastMouseDown == 0) {
				gameScreen = 2;
			}
		}
		drawRoundedRect(400,225,120,30,5,1,true);
		setColor("white");
		if (mouseX >= 340 && mouseX <= 460 && mouseY >= 260 && mouseY <= 290) {
			setColor("red");
			if (framesSinceLastMouseDown == 0) {
				gameScreen = 3;
			}
		}
		drawRoundedRect(400,275,120,30,5,1,true);
	} else if (gameScreen == 1) { //ship building screen
		fill("black");
		setAlpha(.5);
		setColor("white");
		temp1 = shipOffsetX%20*zoomSize/20;
		temp2 = shipOffsetY%20*zoomSize/20;
		for (i = 0; i < Math.ceil(400/zoomSize)+2; i++) {
			drawLine(temp1+400+i*zoomSize,0,temp1+400+i*zoomSize,450);
		}
		for (i = 1; i < Math.ceil(400/zoomSize)+2; i++) {
			drawLine(temp1+400-i*zoomSize,0,temp1+400-i*zoomSize,450);
		}
		for (i = 0; i < Math.ceil(225/zoomSize)+2; i++) {
			drawLine(0,temp2+225+i*zoomSize,800,temp2+225+i*zoomSize);
		}
		for (i = 1; i < Math.ceil(225/zoomSize)+2; i++) {
			drawLine(0,temp2+225-i*zoomSize,800,temp2+225-i*zoomSize);
		}
		setAlpha(1);
		mouseIsOnPart = false;
		for (i = 0; i < shipParts.length; i++) { //ship parts render
			isDD = (shipParts[i][5]/2 != Math.round(shipParts[i][5]/2));
			drawRotatedImageSize(partImages[shipParts[i][0]],shipOffsetX*zoomSize/20+(shipParts[i][1]+shipParts[i][3+isDD]/2)*zoomSize+400,shipOffsetY*zoomSize/20+(shipParts[i][2]+shipParts[i][4-isDD]/2)*zoomSize+225,shipParts[i][3]*zoomSize,shipParts[i][4]*zoomSize,shipParts[i][5]/2*Math.PI);
			if (mouseX >= shipOffsetX*zoomSize/20+shipParts[i][1]*zoomSize+400 && mouseX <= shipOffsetX*zoomSize/20+(shipParts[i][1]+shipParts[i][3+isDD])*zoomSize+400 && mouseY >= shipOffsetY*zoomSize/20+shipParts[i][2]*zoomSize+225 && mouseY <= shipOffsetY*zoomSize/20+(shipParts[i][2]+shipParts[i][4-isDD])*zoomSize+225) {
				if (!framesSinceLastMouseDown) {
					shipPartsSplice = i;
					if (shipParts[shipPartsSplice][0] == 0) {
						hasCommandModule = false;
					}
					draggingPart = shipParts[i][0];
					draggingPartRotation = shipParts[i][5];
					isDraggingPreviousShipPart = true;
					partDragOffsetX = shipOffsetX*zoomSize/20+(shipParts[i][1]+shipParts[i][3+isDD]/2)*zoomSize+400 - mouseX;
					partDragOffsetY = shipOffsetY*zoomSize/20+(shipParts[i][2]+shipParts[i][4-isDD]/2)*zoomSize+225 - mouseY;
				}
				mouseIsOnPart = true;
			}
		}
		setAlpha(1);
		setColor("black");
		fillRect(0,0,100,450,false);
		partsMenuY -= mouseScroll*(mouseX<=100 && (mouseScroll < 0 && partsMenuY < 100 || mouseScroll >= 0 && partsMenuY > -400))/2;
		zoomSize /= 1+mouseScroll/1000*(mouseX>100 && (mouseScroll < 0 && zoomSize < 70 || mouseScroll >= 0 && zoomSize > 10));
		partMenuHovering = -1;
		for (i = 0; i < parts.length; i++) { //parts menu
			tempAlpha = 1-.5*(hasCommandModule&&!i||(!draggingPart&&isDraggingPreviousShipPart))-.5*(!hasCommandModule&&i>0)+(i>0&&(!draggingPart&&isDraggingPreviousShipPart));
			setAlpha(tempAlpha);
			drawImageSize(parts[i][1],50,partsMenuY+i*100,Xadjust2(parts[i][2]*40),Yadjust2(parts[i][3]*40),true,true);
			setAlpha(1);
			if (mouseX >= 50-parts[i][2]*partSizeX && mouseX <= 50+parts[i][2]*partSizeX && mouseY >= partsMenuY+i*100-parts[i][3]*partSizeY && mouseY <= partsMenuY+i*100+parts[i][3]*partSizeY && tempAlpha == 1) {
				if (!framesSinceLastMouseDown) {
					draggingPart = i;
				} else if (!isMouseDown) {
					partMenuHovering = i;
				}
			}
		}
		if (mouseX > 100 && (mouseX < 770 || mouseY > 30) && !mouseIsOnPart && !framesSinceLastMouseDown) {
			shipOffsetOffsetX = mouseX;
			shipOffsetOffsetY = mouseY;
			tempShipOffsetX = shipOffsetX;
			tempShipOffsetY = shipOffsetY;
			isDraggingOffset = true;
		}
		if (isMouseDown && isDraggingOffset) {
			shipOffsetX = tempShipOffsetX+(mouseX-shipOffsetOffsetX)/zoomSize*20;
			shipOffsetY = tempShipOffsetY+(mouseY-shipOffsetOffsetY)/zoomSize*20;
		} else {
			isDraggingOffset = false;
		}
		if (shipPartsSplice != -1) {
			previousShipPart = shipParts.splice(shipPartsSplice,1)[0];
			shipPartsSplice = -1;
		}
		if (draggingPart != -1) { //dragging part render , end of block
			drawRotatedImageSize(partImages[draggingPart],mouseX+partDragOffsetX,mouseY+partDragOffsetY,zoomSize*parts[draggingPart][2],zoomSize*parts[draggingPart][3],draggingPartRotation/2*Math.PI);
		}
		draggingPartColor = "white";
		shipPartsAdd = false; //will add part that was dragging back to ship because cannot place part somewhere
		if (draggingPart != -1) { //mouse release on part
			if (mouseX+partDragOffsetX > 100+parts[draggingPart][2]*zoomSize/2) {
				isDD = (draggingPartRotation/2 != Math.round(draggingPartRotation/2)); //checks if the dimentions are different than original part
				topLeftX = mouseX+partDragOffsetX-parts[draggingPart][2+isDD]*zoomSize/2;
				topLeftY = mouseY+partDragOffsetY-parts[draggingPart][3-isDD]*zoomSize/2;
				topLeftX = Math.round((topLeftX-400-shipOffsetX*zoomSize/20)/zoomSize);
				topLeftY = Math.round((topLeftY-225-shipOffsetY*zoomSize/20)/zoomSize);
				if (mouseY+partDragOffsetY-parts[draggingPart][3-isDD]*zoomSize/2 < 30 || mouseX+partDragOffsetX+parts[draggingPart][2+isDD]*zoomSize/2 > 630 && mouseY+partDragOffsetY-parts[draggingPart][3-isDD]*zoomSize/2 < 210) {
					draggingPartColor = "red";
				}
				for (i = 0;i < shipParts.length;i++) {
					isDD2 = (shipParts[i][5]/2 != Math.round(shipParts[i][5]/2)); //for ship part
					if (isRectOverlap(topLeftX,topLeftY,parts[draggingPart][2+isDD],parts[draggingPart][3-isDD],shipParts[i][1],shipParts[i][2],shipParts[i][3+isDD2],shipParts[i][4-isDD2],false)) {
						draggingPartColor = "red";
						if (!isMouseDown) {
							gameAlert("Cannot place part here");
							if (isDraggingPreviousShipPart) {
								shipPartsAdd = true;
							}
						}
					}
				}
				if (!isMouseDown) {
					if (alertFrames < 180 || alertMessage != "Cannot place part here") {
						shipParts.push([draggingPart,topLeftX,topLeftY,parts[draggingPart][2],parts[draggingPart][3],draggingPartRotation,parts[draggingPart][4],0]);
						if (!isDraggingPreviousShipPart) {
							shipCost[0] += partCosts[draggingPart][0];
							shipCost[1] += partCosts[draggingPart][1];
							shipCost[2] += partCosts[draggingPart][2];
							shipCost[3] += partCosts[draggingPart][3];
						}
					}
					if (!draggingPart) {
						hasCommandModule = true;
					}
				}
			} else if (isDraggingPreviousShipPart && !isMouseDown) {
				shipCost[0] -= partCosts[draggingPart][0];
				shipCost[1] -= partCosts[draggingPart][1];
				shipCost[2] -= partCosts[draggingPart][2];
				shipCost[3] -= partCosts[draggingPart][3];
			}
			if (!isMouseDown) {
				partDragOffsetX = 0;
				partDragOffsetY = 0;
				draggingPartRotation = 0;
				draggingPart = -1;
				isDraggingPreviousShipPart = false;
			}
		}
		if (shipPartsAdd) {
			shipPartsAdd = false;
			shipParts.push(previousShipPart);
		}
		if (alertFrames > 0) { //in game alert
			if (alertFrames < 120) {
				setAlpha(alertFrames/120)
			} else {
				setAlpha(1);
			}
			alertFrames--;
			setColor("red");
			setFont(24,"Arial");
			fillText(alertMessage,400,50,true);
		}
		setAlpha(1);
		setColor("black");
		fillRect(100,0,700,30,false);
		setColor("red");
		drawLineWidth(100,0,100,450,2);
		drawLineWidth(770,0,770,30,2); //pause button
		drawLineWidth(100,30,770,30,2);
		setColor("white");
		if (mouseX < 770 || mouseY > 30) {
			setColor("grey");
		}
		fillRoundedRect(780,15,5,20,2,true); //resources for ship
		fillRoundedRect(790,15,5,20,2,true);
		setColor("black");
		fillRoundedRect(630,30,200,180,5,false);
		setColor("red");
		drawRoundedRect(630,30,200,180,5,2,false);
		drawLineWidth(630,180,800,180,2);
		setFont(18, "Arial");
		setColor("grey");
		fillText("Total Ship Cost:",640,45,false);
		temp = ["white","red"];
		setColor(temp[0|shipCost[0]>resourcesAmounts[0]]);
		fillText("Steel: "+shipCost[0],640,75,false);
		setColor(temp[0|shipCost[1]>resourcesAmounts[1]]);
		fillText("Titanium: "+shipCost[1],640,105,false);
		setColor(temp[0|shipCost[2]>resourcesAmounts[2]]);
		fillText("Tungsten: "+shipCost[2],640,135,false);
		setColor(temp[0|shipCost[3]>resourcesAmounts[3]]);
		fillText("Silicon: "+shipCost[3],640,165,false);
		setColor("grey");  //build ship button
		if (mouseX >= 630 && mouseX <= 800 && mouseY >= 180 && mouseY <= 210) {
			setColor("white");
		}
		fillText("Build Ship",715,195,true);
		setColor("white");
		fillText("Steel: "+resourcesAmounts[0],120,15,false); //resources
		fillText("Titanium: "+resourcesAmounts[1],290,15,false);
		fillText("Tungsten: "+resourcesAmounts[2],460,15,false);
		fillText("Silicon: "+resourcesAmounts[3],630,15,false);
		if (draggingPart != -1) { //dragging part render , end of block
			if (isKeyPressed("a")) {
				draggingPartRotation--;
				temp = -partDragOffsetX;
				partDragOffsetX = partDragOffsetY;
				partDragOffsetY = temp;
			}
			if (isKeyPressed("d")) {
				draggingPartRotation++;
				temp = partDragOffsetX;
				partDragOffsetX = -partDragOffsetY;
				partDragOffsetY = temp;
			}
			drawRotatedImageSize(partImages[draggingPart],mouseX+partDragOffsetX,mouseY+partDragOffsetY,zoomSize*parts[draggingPart][2],zoomSize*parts[draggingPart][3],draggingPartRotation/2*Math.PI);
			if (draggingPartColor == "red") {
				setAlpha(.5);
				setColor("red");
				fillRect(mouseX+partDragOffsetX,mouseY+partDragOffsetY,zoomSize*parts[draggingPart][2+isDD],zoomSize*parts[draggingPart][3-isDD],true);
				setAlpha(1);
			}
		}
		if (mouseX >= 630 && mouseX <= 800 && mouseY >= 180 && mouseY <= 210) { //put this at end of block
			if (!framesSinceLastMouseDown) {
				if (!hasCommandModule) {
					gameAlert("Ship has no command module");
				} else {
					gameScreenJustChangedTo8 = true;
					gameScreen = 8;
				}
			} else {
				setColor("white");
			}
		}
		if (partMenuHovering != -1) { //part menu with prices (put this at end of block)
			partCost = [];
			for (i2 = 0;i2 < partCosts[0].length;i2++) {
				if (partCosts[partMenuHovering][i2]) {
					partCost.push([resourcesNames[i2],partCosts[partMenuHovering][i2]]);
				}
			}
			rectX = 50+parts[partMenuHovering][2]*20/can.width*sw;
			rectY = partsMenuY+partMenuHovering*100-parts[partMenuHovering][3]*10-30;
			setColor("black");
			setFont(18, "Arial");
			fillRoundedRect(rectX,rectY,200,30+30*partCost.length,5,false);
			setColor("red");
			drawRoundedRect(rectX,rectY,200,30+30*partCost.length,5,2,false);
			setColor("grey");
			fillText(parts[partMenuHovering][0],rectX+100,rectY+15,true);
			setColor("white");
			for (i2 = 0;i2 < partCost.length;i2++) {
				fillText(partCost[i2][0]+": "+partCost[i2][1],rectX+10,rectY+45+30*i2,false);
			}
		}
		if (mouseX >= 770 && mouseY <= 30 && !framesSinceLastMouseDown) { //end of block
			setAlpha(.5);
			fill("grey");
			gameScreen = 4;
			setAlpha(1);
		}
	} else if (gameScreen == 2) { //load game screen
		fill("black");
		setFont(48,"Arial");
		setColor("white");
		fillText("File 1",400,100,true);
		fillText("File 2",400,225,true);
		fillText("File 3",400,350,true);
		if (mouseX >= 100 && mouseX <= 700 && mouseY >= 50 && mouseY <= 150) {
			setColor("red");
			if (!framesSinceLastMouseDown) {
				loadGame(1);
				gameScreen = 1;
			}
		}
		drawRoundedRect(400,100,600,100,5,2,true);
		setColor("white");
		if (mouseX >= 100 && mouseX <= 700 && mouseY >= 175 && mouseY <= 275) {
			setColor("red");
			if (!framesSinceLastMouseDown) {
				loadGame(2);
				gameScreen = 1;
			}
		}
		drawRoundedRect(400,225,600,100,5,2,true);
		setColor("white");
		if (mouseX >= 100 && mouseX <= 700 && mouseY >= 300 && mouseY <= 400) {
			setColor("red");
			if (!framesSinceLastMouseDown) {
				loadGame(3);
				gameScreen = 1;
			}
		}
		drawRoundedRect(400,350,600,100,5,2,true);
	} else if (gameScreen == 3) {
	} else if (gameScreen >= 4 && gameScreen <= 6) { //pause menu
		if ((mouseX < 150 || mouseX > 650 || mouseY < 75 || mouseY > 375) && !framesSinceLastMouseDown) {
			gameScreen = 1;
		}
		setAlpha(1);
		setColor("black");
		fillRoundedRect(400,225,500,300,5,true);
		setColor("red");
		drawRoundedRect(400,225,500,300,5,2,true);
		setFont(18,"Arial");
		setColor("white");
		fillText("Main Menu",235,115,true);
		if (mouseX >= 175 && mouseX <= 295 && mouseY >= 100 && mouseY <= 130) {
			setColor("red");
			if (framesSinceLastMouseDown == 0) {
				gameScreen = 0;
			}
		}
		drawRoundedRect(235,115,120,30,5,2,true);
		setColor("white");
		setAlpha(.5+.5*(gameScreen != 5));
		fillText("Save Game",400,115,true);
		if (mouseX >= 340 && mouseX <= 460 && mouseY >= 100 && mouseY <= 130 && gameScreen != 5) {
			setColor("red");
			if (framesSinceLastMouseDown == 0) {
				gameScreen = 5;
			}
		}
		drawRoundedRect(400,115,120,30,5,2,true);
		setAlpha(1);
		setColor("white");
		setAlpha(.5+.5*(gameScreen != 6));
		fillText("Load Game",565,115,true);
		if (mouseX >= 505 && mouseX <= 625 && mouseY >= 100 && mouseY <= 130 && gameScreen != 6) {
			setColor("red");
			if (framesSinceLastMouseDown == 0) {
				gameScreen = 6;
			}
		}
		drawRoundedRect(565,115,120,30,5,2,true);
		setAlpha(1);
		if (gameScreen == 5 || gameScreen == 6) { // save/load game option
			setColor("white");
			isRed = false;
			if (mouseX >= 175 && mouseX <= 625 && mouseY >= 155 && mouseY <= 220 && (gameScreen == 5 || gameSaves[0])) {
				setColor("red");
				if (!framesSinceLastMouseDown) {
					mouseDownBeingUsed = true;
					if (gameScreen == 5) { saveGame(1) }
					if (gameScreen == 6) { loadGame(1); gameScreen = 1 }
				}
			}
			setAlpha(.5+.5*(gameScreen == 5 || gameSaves[0]));
			drawLineWidth(175,155,625,155,2); //1st horizontal
			drawLineWidth(175,155,175,220,2); //top left
			temp = ctx.fillStyle;
			ctx.fillStyle = "white";
			fillText("File 1",400,187.5,true);
			ctx.fillStyle = temp;
			drawLineWidth(625,155,625,220,2); //top right
			if (mouseX >= 175 && mouseX <= 625 && mouseY >= 220 && mouseY <= 285 && (gameScreen == 5 || gameSaves[1])) {
				setColor("red");
				isRed = true;
				if (!framesSinceLastMouseDown) {
					mouseDownBeingUsed = true;
					if (gameScreen == 5) { saveGame(2) }
					if (gameScreen == 6) { loadGame(2); gameScreen = 1; }
				}
			}
			setAlpha(.5+.5*(gameScreen == 5 || gameSaves[0] || gameSaves[1]));
			drawLineWidth(175,220,625,220,2); //2nd horizontal
			if (!isRed) { setColor("white") }
			setAlpha(.5+.5*(gameScreen == 5 || gameSaves[1]));
			drawLineWidth(175,220,175,285,2); //middle left
			temp = ctx.fillStyle;
			ctx.fillStyle = "white";
			fillText("File 2",400,252.5,true);
			ctx.fillStyle = temp;
			drawLineWidth(625,220,625,285,2); //middle right
			isRed = false;
			if (mouseX >= 175 && mouseX <= 625 && mouseY >= 285 && mouseY <= 350 && (gameScreen == 5 || gameSaves[2])) {
				setColor("red");
				isRed = true;
				if (!framesSinceLastMouseDown) {
					mouseDownBeingUsed = true;
					if (gameScreen == 5) { saveGame(3) }
					if (gameScreen == 6) { loadGame(3); gameScreen = 1 }
				}
			}
			setAlpha(.5+.5*(gameScreen == 5 || gameSaves[1] || gameSaves[2]));
			drawLineWidth(175,285,625,285,2); //3rd horizontal
			if (!isRed) { setColor("white") }
			setAlpha(.5+.5*(gameScreen == 5 || gameSaves[2]));
			drawLineWidth(175,285,175,350,2); //bottom left
			temp = ctx.fillStyle;
			ctx.fillStyle = "white";
			fillText("File 3",400,317.5,true);
			ctx.fillStyle = temp;
			drawLineWidth(625,285,625,350,2); //bottom right
			drawLineWidth(175,350,625,350,2); //4th horizontal
		}
	} else if (gameScreen == 7) { //Battle Screen, zoomSize on battle screen is multiplier, not in pixels
		fill("black");
		setColor("white");
		zoomSize /= 1+mouseScroll/1000*!firingBlockStats[0];
		mouseOnPart = -1;
		isDD2 = false;
		mouseIsOnPart = false;
		if (!firingBlockStats[0]) {
			firingBlock = -1;
		}
		fireLine = [-1,-1,-1,-1,"white"];
		for (i = 0; i < shipParts.length;i++) { //ship render
			partSizes = [partSizeX,partSizeY];
			isDD = (shipParts[i][5]/2 != Math.round(shipParts[i][5]/2));
			drawRotatedImageSize(partImages[shipParts[i][0]],shipOffsetX*zoomSize+400-150*zoomSize+(shipParts[i][1]+shipParts[i][3+isDD]/2)*partSizeX*zoomSize,shipOffsetY*zoomSize+225+(shipParts[i][2]+shipParts[i][4-isDD]/2)*partSizeY*zoomSize,partSizes[1-(isDD|0)]*shipParts[i][3]*zoomSize,partSizes[(isDD|0)]*shipParts[i][4]*zoomSize,shipParts[i][5]/2*Math.PI);
			if (mouseX >= shipOffsetX*zoomSize+400-150*zoomSize+shipParts[i][1]*partSizeX*zoomSize && mouseX <= shipOffsetX*zoomSize+400-150*zoomSize+(shipParts[i][1]+shipParts[i][3+isDD])*partSizeX*zoomSize && mouseY >= shipOffsetY*zoomSize+225+shipParts[i][2]*partSizeY*zoomSize && mouseY <= shipOffsetY*zoomSize+225+(shipParts[i][2]+shipParts[i][4+isDD])*partSizeY*zoomSize) {
				mouseOnPart = i;
				mouseIsOnPart = true;
				isDD2 = isDD;
				if (isMouseClick()) {
					partUsing = i;
					isDD3 = isDD;
				}
			}
		}
		if (partUsing != -1) {
			if (parts[shipParts[partUsing][0]][0] == "Small Gun") {
				setFont(18,"Arial");
				setColor("white");
				setColor(fireMessageColor);
				fillText(fireMessage,400,50,true);
				isDD = (shipParts[partUsing][5]/2 != Math.round(shipParts[partUsing][5]/2));
				gunX = shipOffsetX*zoomSize+400-150*zoomSize+(shipParts[partUsing][1]+shipParts[partUsing][3+isDD]/2)*partSizeX*zoomSize;
				gunY = shipOffsetY*zoomSize+225+(shipParts[partUsing][2]+shipParts[partUsing][4-isDD]/2)*partSizeY*zoomSize;
				lineIsObstructed = false;
				lineSlope = (mouseY-gunY)/(mouseX-gunX);
				quadrant = [(mouseX-gunX)>0,(mouseY-gunY)>0];
				for (i = 0;i < shipParts.length;i++) {
					isDD4 = (shipParts[i][5]/2 != Math.round(shipParts[i][5]/2));
					partX1 = shipOffsetX*zoomSize+400-150*zoomSize+shipParts[i][1]*partSizeX*zoomSize-gunX; //in relation to gunX/gunY
					partY1 = shipOffsetY*zoomSize+225+shipParts[i][2]*partSizeY*zoomSize-gunY;
					partX2 = shipOffsetX*zoomSize+400-150*zoomSize+(shipParts[i][1]+shipParts[i][3+isDD4])*partSizeX*zoomSize-gunX;
					partY2 = shipOffsetY*zoomSize+225+(shipParts[i][2]+shipParts[i][4-isDD4])*partSizeY*zoomSize-gunY;
					isInQuad = (partX1>0)==quadrant[0] && (partY1>0)==quadrant[1] || (partX1>0)==quadrant[0] && (partY2>0)==quadrant[1] || (partX2>0)==quadrant[0] && (partY1>0)==quadrant[1] || (partX2>0)==quadrant[0] && (partY2>0)==quadrant[1];
					if (i != partUsing && (partY2 >= lineSlope*partX1 || partY2 >= lineSlope*partX2) && (partY1 <= lineSlope*partX1 || partY1 <= lineSlope*partX2) && isInQuad) {
						lineIsObstructed = true;
					}
				}
				closestBlock = -1;
				closestBlockLength = 1000000;
				for (i = 0;i < enemyShipParts.length;i++) {
					isDD4 = (enemyShipParts[i][5]/2 != Math.round(enemyShipParts[i][5]/2));
					partX1 = shipOffsetX*zoomSize+400+150*zoomSize+enemyShipParts[i][1]*partSizeX*zoomSize-gunX; //in relation to gunX/gunY
					partY1 = shipOffsetY*zoomSize+225+enemyShipParts[i][2]*partSizeY*zoomSize-gunY;
					partX2 = shipOffsetX*zoomSize+400+150*zoomSize+(enemyShipParts[i][1]+enemyShipParts[i][3+isDD4])*partSizeX*zoomSize-gunX;
					partY2 = shipOffsetY*zoomSize+225+(enemyShipParts[i][2]+enemyShipParts[i][4-isDD4])*partSizeY*zoomSize-gunY;
					isInQuad = (partX1>0)==quadrant[0] && (partY1>0)==quadrant[1] || (partX1>0)==quadrant[0] && (partY2>0)==quadrant[1] || (partX2>0)==quadrant[0] && (partY1>0)==quadrant[1] || (partX2>0)==quadrant[0] && (partY2>0)==quadrant[1];
					intX1 = partY1/lineSlope; //X1 intercept with line
					intX2 = partY2/lineSlope;
					intY1 = partX1*lineSlope;
					intY2 = partX2*lineSlope;
					if (intX1 >= partX1 && intX1 <= partX2 && Math.sqrt(intX1**2+partY1**2) < closestBlockLength && isInQuad) {
						closestBlock = i;
						closestBlockLength = Math.sqrt(intX1**2+partY1**2);
					}
					if (intX2 >= partX1 && intX2 <= partX2 && Math.sqrt(intX2**2+partY2**2) < closestBlockLength && isInQuad) {
						closestBlock = i;
						closestBlockLength = Math.sqrt(intX2**2+partY2**2);
					}
					if (intY1 >= partY1 && intY1 <= partY2 && Math.sqrt(intY1**2+partX1**2) < closestBlockLength && isInQuad) {
						closestBlock = i;
						closestBlockLength = Math.sqrt(intY1**2+partX1**2);
					}
					if (intY2 >= partY1 && intY2 <= partY2 && Math.sqrt(intY2**2+partX2**2) < closestBlockLength && isInQuad) {
						closestBlock = i;
						closestBlockLength = Math.sqrt(intY2**2+partX2**2);
					}
				}
				mouseIsOnEnemyPart = false;
				firingColor = "red";
				for (i = 0;i < enemyShipParts.length;i++) {
					isDD4 = (enemyShipParts[i][5]/2 != Math.round(enemyShipParts[i][5]/2));
					partX1 = shipOffsetX*zoomSize+400+150*zoomSize+enemyShipParts[i][1]*partSizeX*zoomSize-gunX; //in relation to gunX/gunY
					partY1 = shipOffsetY*zoomSize+225+enemyShipParts[i][2]*partSizeY*zoomSize-gunY;
					partX2 = shipOffsetX*zoomSize+400+150*zoomSize+(enemyShipParts[i][1]+enemyShipParts[i][3+isDD4])*partSizeX*zoomSize-gunX;
					partY2 = shipOffsetY*zoomSize+225+(enemyShipParts[i][2]+enemyShipParts[i][4-isDD4])*partSizeY*zoomSize-gunY;
					isInQuad = (partX1>0)==quadrant[0] && (partY1>0)==quadrant[1] || (partX1>0)==quadrant[0] && (partY2>0)==quadrant[1] || (partX2>0)==quadrant[0] && (partY1>0)==quadrant[1] || (partX2>0)==quadrant[0] && (partY2>0)==quadrant[1];
					if (mouseX >= partX1+gunX && mouseX <= partX2+gunX && mouseY >= partY1+gunY && mouseY <= partY2+gunY && !firingBlockStats[0]) {
						mouseIsOnEnemyPart = true;
						firingBlock = i;
						if (firingBlock == closestBlock) {
							firingColor = "green";
						}
					}
				}
				if (!mouseIsOnEnemyPart && !framesSinceLastMouseDown) {
					partUsing = -1;
					isDD3 = false;
					firingBlockStats = [false,0,0,0,0,0];
				}
				if (firingColor == "green" && !lineIsObstructed) {
					if (isMouseClick()) {
						temp = Math.sqrt((mouseY-gunY)**2+(mouseX-gunX)**2);
						firingBlockStats = [true,(mouseX-gunX)/temp*zoomSize,(mouseY-gunY)/temp*zoomSize,(mouseX-gunX)/temp*partSizeX*zoomSize,(mouseY-gunY)/temp*partSizeY*zoomSize,1,closestBlockLength];
						explosionX = mouseX;
						explosionY = mouseY;
					}
					fireMessage = "Select a block to fire at";
					fireMessageColor = "white";
				} else {
					fireMessage = "Line of sight is obstructed";
					fireMessageColor = "red";
				}
				if (!mouseIsOnEnemyPart) {
					fireMessage = "Select a block to fire at";
					fireMessageColor = "white";
				}
				if (!firingBlockStats[0] && !isExploding) {
					fireLine = [gunX,gunY,mouseX,mouseY,"white"];
				}
				if (lineIsObstructed) {
					fireLine[4] = "red";
				}
			}
			if (firingBlockStats[0]) {
				setColor("grey");
				hasHit = true;
				blockHasTakenDamage = false;
				for (i = 0;i < firingBlockStats[5] && i < 100;i+=3) {
					if (Math.sqrt((firingBlockStats[1]*(firingBlockStats[5]-i)+firingBlockStats[3]+(i%12-6)/1*firingBlockStats[2])**2+(firingBlockStats[2]*(firingBlockStats[5]-i)+firingBlockStats[4]+(i%12-6)/1*firingBlockStats[1])**2) < firingBlockStats[6]) {
						fillCircle(gunX+firingBlockStats[1]*(firingBlockStats[5]-i)+firingBlockStats[3]+(i%12-6)/1*firingBlockStats[2],gunY+firingBlockStats[2]*(firingBlockStats[5]-i)+firingBlockStats[4]+(i%12-6)/1*firingBlockStats[1],zoomSize);
						hasHit = false;
					} else if (!isExploding) {
						if (enemyShipParts[firingBlock][6] <= 50) {
							isExploding = true;
							explosionSound.play();
							explosionMaxSize = (enemyShipParts[firingBlock][3]*partSizeX+enemyShipParts[firingBlock][4]*partSizeY)/2*((parts[enemyShipParts[firingBlock][0]][0] == "Ammo" | parts[enemyShipParts[firingBlock][0]][0] == "Fuel") + 1)*zoomSize;
							explosionSize = 0;
							blockHit = firingBlock;
						} else if (!blockHasTakenDamage) {
							blockHasTakenDamage = true;
						}
					}
				}
				if (hasHit && blockHasTakenDamage) {
					enemyShipParts[firingBlock][6] -= 50;
					partUsing = -1;
					isDD3 = false;
					firingBlockStats = [false,0,0,0,0,0]; //is firing, lineXd, lineYd, startX, startY, frame
				}
				firingBlockStats[5]+=3;
				if (hasHit) {
					firingBlockStats = [false,0,0,0,0,0];
				}
			}
		}
		setColor("red");
		if (mouseOnPart != -1) {
			drawRect(shipOffsetX*zoomSize+400-150*zoomSize+shipParts[mouseOnPart][1]*partSizeX*zoomSize,shipOffsetY*zoomSize+225+shipParts[mouseOnPart][2]*partSizeY*zoomSize,shipParts[mouseOnPart][3+isDD2]*partSizeX*zoomSize,shipParts[mouseOnPart][4+isDD2]*partSizeY*zoomSize,false,2);
		}
		for (i = 0; i < enemyShipParts.length;i++) { //enemy ship render
			partSizes = [partSizeX,partSizeY];
			isDD = (enemyShipParts[i][5]/2 != Math.round(enemyShipParts[i][5]/2));
			setAlpha(enemyShipParts[i][6]/parts[enemyShipParts[i][0]][4]);
			drawRotatedImageSize(partImages[enemyShipParts[i][0]],shipOffsetX*zoomSize+400+150*zoomSize+(enemyShipParts[i][1]+enemyShipParts[i][3+isDD]/2)*partSizeX*zoomSize,shipOffsetY*zoomSize+225+(enemyShipParts[i][2]+enemyShipParts[i][4-isDD]/2)*partSizeY*zoomSize,partSizes[1-(isDD|0)]*enemyShipParts[i][3]*zoomSize,partSizes[(isDD|0)]*enemyShipParts[i][4]*zoomSize,enemyShipParts[i][5]/2*Math.PI);
			setAlpha(1);
			if (mouseX >= shipOffsetX*zoomSize+400+150*zoomSize+enemyShipParts[i][1]*partSizeX*zoomSize && mouseX <= shipOffsetX*zoomSize+400+150*zoomSize+(enemyShipParts[i][1]+enemyShipParts[i][3+isDD])*partSizeX*zoomSize && mouseY >= shipOffsetY*zoomSize+225+enemyShipParts[i][2]*partSizeY*zoomSize && mouseY <= shipOffsetY*zoomSize+225+(enemyShipParts[i][2]+enemyShipParts[i][4+isDD])*partSizeY*zoomSize) {
				mouseIsOnPart = true;
			}
			if (firingBlock == i) {
				setColor(firingColor);
				drawRect(shipOffsetX*zoomSize+400+150*zoomSize+(enemyShipParts[i][1]+enemyShipParts[i][3+isDD]/2)*partSizeX*zoomSize,shipOffsetY*zoomSize+225+(enemyShipParts[i][2]+enemyShipParts[i][4-isDD]/2)*partSizeY*zoomSize,partSizeX*enemyShipParts[i][3+isDD]*zoomSize,partSizeY*enemyShipParts[i][4-isDD]*zoomSize,true,2);
			}
		}
		if (isExploding) {
			explosionSize+=.2;
			if (explosionSize/explosionMaxSize < .75) {
				setAlpha(1);
			} else {
				temp = 1-explosionSize/explosionMaxSize*4+3;
				if (temp > 0) {
					setAlpha(temp);
				} else {
					setAlpha(0);
				}
			}
			if (explosionSize >= explosionMaxSize) {
				explodingPartList = [];
				if (parts[enemyShipParts[blockHit][0]][0] == "Ammo" || parts[enemyShipParts[blockHit][0]][0] == "Fuel") {
					isDD2 = (enemyShipParts[blockHit][5]/2 != Math.round(enemyShipParts[blockHit][5]/2));
					for (i=0;i<enemyShipParts.length;i++) {
						isDD = (enemyShipParts[i][5]/2 != Math.round(enemyShipParts[i][5]/2));
						if (Math.sqrt((enemyShipParts[i][1]+enemyShipParts[i][3+isDD]/2-enemyShipParts[blockHit][1]-enemyShipParts[blockHit][3+isDD2]/2)**2+(enemyShipParts[i][2]+enemyShipParts[i][4-isDD]/2-enemyShipParts[blockHit][2]-enemyShipParts[blockHit][4-isDD2]/2)**2) <= 1.5 && i != blockHit) {
							enemyShipParts[i][6] -= 25;
						}
					}
				}
				enemyShipParts[blockHit][6] -= 50;
				isExploding = false;
				partUsing = -1;
				isDD3 = false;
				firingBlockStats = [false,0,0,0,0,0]; //is firing, lineXd, lineYd, startX, startY, frame
				enemyShipParts.splice(blockHit,1);
			}
			drawImageSize(explosionImage,explosionX,explosionY,explosionSize*3,explosionSize*3,true,true);
			setAlpha(1);
		}
		setColor(fireLine[4]);
		setAlpha(.5);
		drawLine(fireLine[0],fireLine[1],fireLine[2],fireLine[3]);
		setAlpha(1);
		setColor("black");
		fillCircle(fireLine[2],fireLine[3],2);
		setColor("white");
		drawCircle(fireLine[2],fireLine[3],2,1);
		if (!mouseIsOnPart && !framesSinceLastMouseDown && !firingBlockStats[0]) { //Offset drag
			shipOffsetOffsetX = mouseX;
			shipOffsetOffsetY = mouseY;
			tempShipOffsetX = shipOffsetX;
			tempShipOffsetY = shipOffsetY;
			isDraggingOffset = true;
		}
		if (isMouseDown && isDraggingOffset) {
			shipOffsetX = tempShipOffsetX+(mouseX-shipOffsetOffsetX)/zoomSize;
			shipOffsetY = tempShipOffsetY+(mouseY-shipOffsetOffsetY)/zoomSize;
		} else {
			isDraggingOffset = false;
		}
		if (shipParts.findIndex(function checkCommandModule(i) {return !i[0]}) == -1) { //end of block
			setAlpha(.5);
			fill("black");
			gameScreen = 10; //You lose
			setAlpha(1);
		}
		if (enemyShipParts.findIndex(function checkCommandModule(i) {return !i[0]}) == -1) {
			setAlpha(.5);
			fill("black");
			gameScreen = 11; //You win
			setAlpha(1);
		}
	} else if (gameScreen == 8) { //build ship confirmation
		notEnoughResources = [];
		goodResources = [];
		setFont(18,"Arial");
		for (i = 0;i < resourcesAmounts.length;i++) {
			if (shipCost[i] > resourcesAmounts[i]) {
				notEnoughResources.push(i);				
			} else if (shipCost[i] <= resourcesAmounts[i] && shipCost[i]) {
				goodResources.push(i);
			}
		}
		if (!notEnoughResources.length) { //build ship confirmation
			goodPartsList = [0]; //list of parts that are connected to the main ship
			lastGoodPartsList = [];
			while (goodPartsList.length != lastGoodPartsList.length) {
				lastGoodPartsList = [...goodPartsList];
				for (i = 0;i < goodPartsList.length;i++) {
					for (i2 = 0;i2 < shipParts.length;i2++) {
						isDD = (shipParts[goodPartsList[i]][5]/2 != Math.round(shipParts[goodPartsList[i]][5]/2));
						isDD2 = (shipParts[i2][5]/2 != Math.round(shipParts[i2][5]/2));
						x1 = shipParts[goodPartsList[i]][1];
						y1 = shipParts[goodPartsList[i]][2];
						w1 = shipParts[goodPartsList[i]][3+isDD];//+isDD
						h1 = shipParts[goodPartsList[i]][4-isDD];
						x2 = shipParts[i2][1];
						y2 = shipParts[i2][2];
						w2 = shipParts[i2][3+isDD2];//+isDD2
						h2 = shipParts[i2][4-isDD2];
						if ((x1+w1>x2&&x1<x2+w2&&(y1+h1==y2||y1==y2+h2)||y1+h1>y2&&y1<y2+h2&&(x1+w1==x2||x1==x2+w2))&&!goodPartsList.includes(i2)) {
							goodPartsList.push(i2);
						}
					}
				}
			}
			if (goodPartsList.length == shipParts.length) {
				if (gameScreenJustChangedTo8) {
					setAlpha(.5);
					fill("black");
				}
				tempText = ["Are you sure you want to build this ship for"];
				for (i = 0;i < goodResources.length;i++) {
					tempText.push(shipCost[goodResources[i]]+" "+resourcesNames[goodResources[i]]);
				}
				setColor("black");
				fillRoundedRect(400,225,400,tempText.length*30+30,5,true);
				setColor("red");
				drawRoundedRect(400,225,400,tempText.length*30+30,5,2,true);
				setColor("white");
				for (i = 0;i < tempText.length;i++) {
					fillText(tempText[i],220,225-tempText.length*15+30*i,false);
				}
				setColor("green");
				fillRoundedRect(370,225+tempText.length*15,40,20,5,true);
				if (mouseX >= 350 && mouseX <= 390 && mouseY >= 215+tempText.length*15 && mouseY <= 235+tempText.length*15) {
					setColor("white");
					if (isMouseClick()) {
						gameScreen = 9;
					}
				} else {
					setColor("black");
				}
				drawRoundedRect(370,225+tempText.length*15,40,20,5,2,true);
				setFont(14,"Arial");
				fillText("YES",370,225+tempText.length*15,true);
				setColor("red");
				fillRoundedRect(430,225+tempText.length*15,40,20,5,true);
				if (mouseX >= 410 && mouseX <= 450 && mouseY >= 215+tempText.length*15 && mouseY <= 235+tempText.length*15) {
					setColor("white");
					if (isMouseClick()) {
						gameScreen = 1;
					}
				} else {
					setColor("black");
				}
				drawRoundedRect(430,225+tempText.length*15,40,20,5,2,true);
				setFont(14,"Arial");
				fillText("NO",430,225+tempText.length*15,true);
			} else {
				gameScreen = 1;
				gameAlert("All parts must be connected to ship");
			}
		} else {
			tempText = "Not enough ";
			oxfordComma = ["",","]
			for (i = 0;i < notEnoughResources.length-1;i++) {
				tempText += resourcesNames[notEnoughResources[i]]+oxfordComma[0|(notEnoughResources.length!=2)]+" ";
			}
			if (notEnoughResources.length == 1) {
				tempText += resourcesNames[notEnoughResources[0]];
			}
			if (notEnoughResources.length > 1) {
				tempText += "or "+resourcesNames[notEnoughResources[notEnoughResources.length-1]]
			}
			gameScreen = 1;
			gameAlert(tempText);
		}
		if (gameScreenJustChangedTo8) {
			gameScreenJustChangedTo8 = false;
		}
	} else if (gameScreen == 9) { //ship built screen
		fill("black");
		setColor("white");
		fillText("ship built",400,225,true);
		ships += [name,shipParts,[currentGalaxy,currentSystem,currentPlanet]];
		for (i = 0;i < resourcesAmounts.length;i++) {
			resourcesAmounts[i] -= shipCost[i];
		}
	} else if (gameScreen == 10) { //You lose screen
		setColor("black");
		fillRoundedRect(400,225,400,250,5,true);
		setColor("white");
		setFont(32,"Arial");
		fillText("You Lost",400,225,true);
	} else if (gameScreen == 11) { //You win screen
		setColor("black");
		fillRoundedRect(400,225,400,250,5,true);
		setColor("white");
		setFont(32,"Arial");
		fillText("You Won",400,225,true);
	} else if (gameScreen == 12) { //galaxy screen
		fill("black");
		drawImageSize(galaxyImage,400,225,450,450,true,true);
		for (i = 0; i < systemLocations[currentGalaxy].length; i++) {
			setColor("black");
			if (Math.sqrt((mouseX-systemLocations[currentGalaxy][i][0])**2+(mouseY-systemLocations[currentGalaxy][i][1])**2) <= 4) {
				setColor("red");
			}
			fillCircle(systemLocations[currentGalaxy][i][0],systemLocations[currentGalaxy][i][1],4);
			setColor("white");
			drawCircle(systemLocations[currentGalaxy][i][0],systemLocations[currentGalaxy][i][1],4,1);
		}
	} else if (gameScreen == 13) {
		fill("black");
		
		C = 2/shipR/shipV/shipV;
		Rp = (-C - Math.sqrt(C*C+4*(1-C)))/2/(1-C)*shipR;
		Ra = (-C + Math.sqrt(C*C+4*(1-C)))/2/(1-C)*shipR;
		if (Rp > Ra) {
			temp = Rp;
			Rp = Ra;
			Ra = temp;
		}
		A = (Rp+Ra)/2;
		B = Math.sqrt(2*A*Rp-Rp*Rp);
		D = A - Rp;
		ecc = (Ra-Rp)/(Ra+Rp);
		shipV2 = Math.sqrt(2/shipR2-1/A);
		C2 = 2/shipR2/shipV2/shipV2;
		shipY2 = Math.asin(Math.sqrt((Ra*Ra*(1-2*C2+C2*C2)+C2*Ra*(1-C2)*shipR2)/shipR2/shipR2/(1-C2)));
//		shipVV2 = Math.atan(shipR2*shipV2*shipV2*Math.sin(shipY2)*Math.cos(shipY2)/(shipR2*shipV2*shipV2*Math.sin(shipY2)*Math.sin(shipY2)-1));
		shipVV2 = Math.PI*2;
		E = 0;
		E2 = (ecc+Math.cos(shipVV2))/(1+ecc*Math.cos(shipVV2));
		M = E-ecc*Math.sin(E);
		M2 = E2-ecc*Math.sin(E2);
		N = 1/A/A/A;
		T = (M2-M)/N/804357; //Time to complete travel in years (804357 = 93^3) 6060 frames = 101 seconds = 1 year
		ellipseAng = 0;
//		ellipseAng = planetMotionFrames/100;
		kek = shipR2*shipV2*shipV2*Math.sin(shipY2)*Math.cos(shipY2)/(shipR2*shipV2*shipV2*Math.sin(shipY2)*Math.sin(shipY2)-1);
		console.log([kek,shipVV2,N,T]);
		setColor("blue");
		ctx.beginPath();
		ctx.ellipse(Xadjust(200-D*Math.cos(ellipseAng)),Yadjust(100-D*Math.sin(ellipseAng)),Xadjust(A),Yadjust(B),ellipseAng,0,Math.PI*2);
		ctx.stroke();
		setColor("green");
		fillCircle(200,100,5);
		drawCircle(200,100,70);
		setColor("red");
		fillCircle(200-70*Math.cos(shipVV2),100-70*Math.sin(shipVV2),2);

		planetMotionFrames++;
		mouseIsOnPlanet = false;
		setColor("yellow");
		zoomSize /= 1+mouseScroll/1000*(mouseScroll < 0 && zoomSize < 70 || mouseScroll >= 0 && zoomSize > .01);
		fillCircle(400+(offsetX+offsetPlanetX)*zoomSize,225+(offsetY+offsetPlanetY)*zoomSize,5*zoomSize,true);
//		fillCircle(400+(offsetX+offsetPlanetX)*zoomSize,225+(offsetY+offsetPlanetY)*zoomSize,20*zoomSize,true);
		if (planetFocus != -1) {
			offsetPlanetX = -Math.cos(planetMotionFrames*Math.sqrt(1/planetRads[planetFocus])/100)*planetRads[planetFocus];
			offsetPlanetY = -Math.sin(planetMotionFrames*Math.sqrt(1/planetRads[planetFocus])/100)*planetRads[planetFocus];
		}
		for (i = 0;i < planetRads.length;i++) {
			tempX = 400+(Math.cos(planetMotionFrames*Math.sqrt(1/planetRads[i])/100)*planetRads[i]+offsetX+offsetPlanetX)*zoomSize;
			tempY = 225+(Math.sin(planetMotionFrames*Math.sqrt(1/planetRads[i])/100)*planetRads[i]+offsetY+offsetPlanetY)*zoomSize;
			setColor("white");
			if (Math.sqrt((mouseX-tempX)**2+(mouseY-tempY)**2) <= 2*zoomSize) {
				mouseIsOnPlanet = true;
				setColor("red");
				if (isMouseClick()) {
					planetFocus = i;
					offsetX = 0;
					offsetY = 0;
					offsetPlanetX = -Math.cos(planetMotionFrames*Math.sqrt(1/planetRads[planetFocus])/100)*planetRads[planetFocus];
					offsetPlanetY = -Math.sin(planetMotionFrames*Math.sqrt(1/planetRads[planetFocus])/100)*planetRads[planetFocus];
				}
			}
			fillCircle(tempX,tempY,2*zoomSize,true);
		}
		if (!mouseIsOnPlanet && isMouseClick()) {
			console.log("kek");
		}
		if (!mouseIsOnPlanet && isMouseClick() && framesSinceLastMouseDown < 10) {
			planetFocus = -1;
			offsetX += offsetPlanetX;
			offsetY += offsetPlanetY;
			offsetPlanetX = 0;
			offsetPlanetY = 0;
		}
		if (!mouseIsOnPlanet && !framesSinceLastMouseDown) {
			offsetOffsetX = mouseX;
			offsetOffsetY = mouseY;
			tempOffsetX = offsetX;
			tempOffsetY = offsetY;
			isDraggingOffset = true;
		}
		if (isMouseDown && isDraggingOffset) {
			offsetX = tempOffsetX+(mouseX-offsetOffsetX)/zoomSize;
			offsetY = tempOffsetY+(mouseY-offsetOffsetY)/zoomSize;
		} else {
			isDraggingOffset = false;
		}
	}
	keysPressed = [""];
}
setInterval(function() {
	oneachframe();
	framesSinceLastClick++;
	framesSinceLastMouseDown++;
	mouseScroll = 0;
}, 1000/60);