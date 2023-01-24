// C:\DATA\dev\js\02harris\manyCars
var SCENEWIDTH = 900;
var SCENEHEIGHT = 600;
var FRAMERATE = 30; 
var currentKey = null;
var keysDown = new Array(256);
var Timer = function () {
  this.date = new Date();
  this.lastTime = 0;
  this.currentTime = 0;
  this.start = function () {
    this.currentTime = Date.now();
  }
  this.reset = function () {
    this.currentTime = Date.now();
  }
  this.getTimeElapsed = function () {
    this.lastTime = this.currentTime;
    this.currentTime = Date.now();
    return (this.currentTime - this.lastTime);
  }
}

//#region funcs (gameEngine.js)
function Animation(spriteSheet, imgWidth, imgHeight, cellWidth, cellHeight) {
  this.sheet = spriteSheet;
  this.imgWidth = imgWidth;
  this.imgHeight = imgHeight;
  this.cellWidth = cellWidth;
  this.cellHeight = cellHeight;
  this.animationLength = 1000;
  this.changeLength = false;
  this.cycles = new Array();
  this.currentCycleName = "";
  this.currentCycle = null;
  this.cyclePlaySettings = new Array(PLAY_LOOP, PLAY_LOOP, PLAY_LOOP, PLAY_LOOP);
  this.changeAnimation = false;
  this.timer = new Timer();
  this.framesPerRow = 0;
  this.framesPerColumn = 0;
  this.totalCycleTime = 0;
  this.fps = 0;
  this.isPaused = false;
  this.setup = function () {
    this.timer.start();
    this.framesPerRow = this.imgWidth / this.cellWidth;
    this.framesPerColumn = this.imgHeight / this.cellHeight;
  }
  this.addCycle = function (cycleName, startingCell, frames) {
    cycle = new Array(cycleName, startingCell, frames);
    this.cycles.push(cycle);
  }
  this.drawFrame = function (ctx) {
    this.fps += 1;
    if (!this.isPaused) { this.totalCycleTime += this.timer.getTimeElapsed(); }
    if (this.changeAnimation == true) {
      for (i = 0; i < this.cycles.length; i++) {
        if (this.cycles[i][0] == this.currentCycleName) {
          this.currentCycle = this.cycles[i];
        }
      }
    }
    if (this.changeAnimation || this.changeLength) {
      this.frameDelta = this.animationLength / this.currentCycle[2]; 
      this.changeAnimation = false;
      this.changeLength = false;
      this.fps = 0;
    }
    currentFrame = Math.floor((this.totalCycleTime % this.animationLength) / this.frameDelta);
    document.getElementById("FPS").innerHTML = this.animationLength;
    row = Math.floor((this.currentCycle[1] + currentFrame) / this.framesPerRow);
    col = (this.currentCycle[1] + currentFrame) - (row * Math.floor(this.imgWidth / this.cellWidth));
    frameY = row * this.cellHeight;
    frameX = col * this.cellWidth;
    ctx.drawImage(this.sheet, frameX, frameY, this.cellWidth, this.cellHeight, 0 - (this.cellWidth / 2), 0 - (this.cellHeight / 2), this.cellWidth, this.cellHeight);
  }
  this.setCycle = function (cycleName) {
    this.currentCycleName = cycleName;
    this.changeAnimation = true;
    this.totalCycleTime = 0;
  }
  this.renameCycles = function (cycleNames) {
    for (i = 0; i < cycleNames.length; i++) {
      number = parseInt(this.cycles[i][0].slice(5));
      if (this.currentCycleName == this.cycles[i][0]) { this.currentCycleName = cycleNames[number - 1]; }
      this.cycles[i][0] = cycleNames[number - 1];
    }
  }
  this.play = function () {
    this.isPaused = false;
    this.timer.reset();
  }
  this.pause = function () {
    this.isPaused = true;
  }
  this.reset = function () {
    this.totalCycleTime = 0;
    this.timer.reset();
  }
  this.setAnimationSpeed = function (animLength) {
    if (animLength <= 50) { animLength = 50; }
    this.animationLength = animLength;
    this.changeLength = true;
  }
}
function Camera(scene) {
  this.canvas = scene.canvas;
  this.context = this.canvas.getContext("2d");
  this.cHeight = parseInt(this.canvas.height);
  this.cWidth = parseInt(this.canvas.width);
  this.cameraOffsetX = 0;
  this.cameraOffsetY = 0;
  this.target = false;
  this.waitX = 0;
  this.waitY = 0;
  this.focalPointX = 0;
  this.focalPointY = 0;
  this.moveCamera = function (x, y) {
    this.cameraOffsetX += x;
    this.cameraOffsetY += y;
  }
  this.followSprite = function (sprite, waitX, waitY) {
    this.target = sprite;
    if (typeof waitX != "undefined") {
      this.waitX = waitX;
      this.waitY = waitY;
    }
  }
  this.update = function () {
    this.focalPointX = this.cameraOffsetX + this.cWidth / 2;
    this.focalPointY = this.cameraOffsetY + this.cHeight / 2;
    if (this.target && !this.checkFocusBounds()) {
      this.cameraOffsetX = this.target.x + (this.target.width / 2) - (this.cWidth / 2) + this.waitX;
      this.cameraOffsetY = this.target.y + (this.target.height / 2) - (this.cHeight / 2) + this.waitY;
    }
  }
  this.checkFocusBounds = function () {
    centerX = this.target.x + (this.target.width / 2);
    centerY = this.target.y + (this.target.height / 2);
    if (Math.abs(this.focalPointX - centerX) >= this.waitX) { return false; }
    if (Math.abs(this.focalPointY - centerY) >= this.waitY) { return false; }
    else { return true; }
  }
}
function Joy() {
  this.SENSITIVITY = 50;
  this.diffX = 0;
  this.diffY = 0;
  var touches = [];
  var startX;
  var startY;
  this.onTouchStart = function (event) {
    result = "touch: ";
    touches = event.touches;
    startX = touches[0].screenX;
    startY = touches[0].screenY;
    result += "x: " + startX + ", y: " + startY;
    console.log(result);
  }
  this.onTouchMove = function (event) {
    result = "move: "
    event.preventDefault();
    touches = event.touches;
    this.diffX = touches[0].screenX - startX;
    this.diffY = touches[0].screenY - startY;
    result += "dx: " + this.diffX + ", dy: " + this.diffY;
    console.log(result);
  }
  this.onTouchEnd = function (event) {
    result = "no touch";
    touches = event.touches;
    this.diffX = 0;
    this.diffY = 0;
  }
  touchable = 'createTouch' in document;
  if (touchable) {
    document.addEventListener('touchstart', this.onTouchStart, false);
    document.addEventListener('touchmove', this.onTouchMove, false);
    document.addEventListener('touchend', this.onTouchEnd, false);
  }
  this.getDX = function () {
    return "At least I work...";
    return this.diffX;
  }
  this.getDY = function () {
    return this.diffY;
  }
}
function localUpdate() {
  update();
}
function Scene() {
  /*
  TODO: 
    AddSprite method
    Put sprites in linked list
    Automatically update each sprite in list
    Add keyboard input (initial version done)
    array of keydowns like PyGame? (DONE: 2/25/11)
    keyboard constants (DONE: 2/25/11)
    Consider drawing canvas directly on page - position absolute
    (DONE - Scene now creates own canvas)
    mouse input
    virtual buttons for portable devices
  */
  touchable = 'createTouch' in document;
  this.canvas = document.createElement("canvas");
  document.body.appendChild(this.canvas);
  this.context = this.canvas.getContext("2d");
  this.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
  }
  this.start = function () {
    if (!touchable) {
      this.initKeys();
      document.onkeydown = this.updateKeys;
      document.onkeyup = this.clearKeys;
    }
    this.intID = setInterval(localUpdate, 1000 / FRAMERATE); 
  }
  this.stop = function () {
    clearInterval(this.intID);
  }
  this.updateKeys = function (e) {
    currentKey = e.keyCode;
    keysDown[e.keyCode] = true;
  }
  this.clearKeys = function (e) {
    currentKey = null;
    keysDown[e.keyCode] = false;
  }
  this.initKeys = function () {
    for (keyNum = 0; keyNum < 256; keyNum++) {
      keysDown[keyNum] = false;
    }
  }
  this.setSizePos = function (height, width, top, left) {
    styleString = "";
    styleString += "position: absolute; \n";
    styleString += "height: " + height + "px;\n";
    styleString += "width: " + width + "px;\n";
    styleString += "top: " + top + "px;\n";
    styleString += "left: " + left + "px;\n";
    this.height = height;
    this.width = width;
    this.top = top;
    this.left = left;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.left = this.left;
    this.canvas.style.top = this.top;
  } 
  this.setSize = function (width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  } 
  this.setPos = function (left, top) {
    this.left = left;
    this.top = top;
    this.canvas.style.left = left;
    this.canvas.style.top = top;
  }
  this.setBG = function (color) {
    this.canvas.style.backgroundColor = color;
  }
  this.setSize(SCENEWIDTH, SCENEHEIGHT);
  this.setPos(10, 100);
  this.setBG("lightgray");
}
function Sound(src) {
  this.snd = document.createElement("audio");
  this.snd.src = src;
  this.play = function () {
    this.snd.play();
  }
}
function Sprite(scene, imageFile, width, height) {
  /*
  TODO:
    Add collision detection (DONE 2/4/11)
    Add access modifiers for x,y,dx,dy (DONE 10/26/11)
    Add multiple boundActions
    Support multiple images / states (DONE 10/26/11)
    Sprite element now expects scene rather than canvas
  */
  this.canvas = scene.canvas;
  this.context = this.canvas.getContext("2d");
  this.image = new Image();
  this.image.src = imageFile;
  this.animation = false; 
  this.width = width;
  this.height = height;
  this.cHeight = parseInt(this.canvas.height);
  this.cWidth = parseInt(this.canvas.width);
  this.x = 200;
  this.y = 200;
  this.dx = 10;
  this.dy = 0;
  this.imgAngle = 0;
  this.moveAngle = 0;
  this.speed = 10;
  this.camera = false;
  this.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
  } 
  this.setX = function (nx) { this.x = nx; }
  this.setY = function (ny) { this.y = ny; }
  this.setChangeX = function (ndx) { this.dx = ndx; }
  this.setChangeY = function (ndy) { this.dx = ndx; }
  this.changeXby = function (tdx) { this.x += tdx };
  this.changeYby = function (tdy) { this.y += tdy };
  this.draw = function () {
    ctx = this.context;
    ctx.save();
    if (this.camera) { ctx.translate(this.x - this.camera.cameraOffsetX, this.y - this.camera.cameraOffsetY); }
    else { ctx.translate(this.x, this.y); }
    ctx.rotate(this.imgAngle);
    if (this.animation != false) {
      this.animation.drawFrame(ctx);
    }
    else {
      ctx.drawImage(this.image,
           0 - (this.width / 2),
           0 - (this.height / 2),
           this.width, this.height);
    }
    ctx.restore();
  }
  this.update = function () {
    this.x += this.dx;
    this.y += this.dy;
    this.checkBounds();
    this.draw();
  }
  this.checkBounds = function () {
    camX = 0;
    camY = 0;
    if (this.camera) { camX = this.camera.cameraOffsetX; camY = this.camera.cameraOffsetY; }
    rightBorder = this.cWidth + camX;
    leftBorder = camX;
    topBorder = camY;
    bottomBorder = this.cHeight + camY;
    if (this.x > rightBorder) {
      this.x = leftBorder;
    }
    if (this.y > bottomBorder) {
      this.y = topBorder;
    }
    if (this.x < leftBorder) {
      this.x = rightBorder;
    }
    if (this.y < topBorder) {
      this.y = bottomBorder;
    }
  }
  this.loadAnimation = function (imgWidth, imgHeight, cellWidth, cellHeight) {
    this.animation = new Animation(this.image, imgWidth, imgHeight, cellWidth, cellHeight);
    this.animation.setup();
  }
  this.generateAnimationCycles = function (slicingFlag, framesArray) {
    cWidth = this.animation.cellWidth;
    cHeight = this.animation.cellHeight;
    iWidth = this.animation.imgWidth;
    iHeight = this.animation.imgHeight;
    numCycles = 0;
    nextStartingFrame = 0;
    if (typeof framesArray == "number" || typeof slicingFlag == "undefined") {
      if (slicingFlag == SINGLE_COLUMN) { numCycles = (iHeight / cHeight) / framesArray; }
      else if (typeof slicingFlag == "undefined") { numCycles = (iHeight / cHeight); framesArray = iWidth / cWidth; }
      else { numCycles = (iWidth / cWidth) / framesArray; }
      for (i = 0; i < numCycles; i++) {
        cycleName = "cycle" + (i + 1);
        this.specifyCycle(cycleName, i * framesArray, framesArray);
      }
    }
    else {
      numCycles = framesArray.length;
      for (i = 0; i < numCycles; i++) {
        cycleName = "cycle" + (i + 1);
        this.specifyCycle(cycleName, nextStartingFrame, framesArray[i]);
        nextStartingFrame += framesArray[i];
      }
    }
    this.setCurrentCycle("cycle1");
  }
  this.renameCycles = function (cycleNames) { this.animation.renameCycles(cycleNames); }
  this.specifyCycle = function (cycleName, startingCell, frames) { this.animation.addCycle(cycleName, startingCell, frames); }
  this.specifyState = function (stateName, cellName) { this.animation.addCycle(stateName, cellName, 1); }
  this.setCurrentCycle = function (cycleName) { this.animation.setCycle(cycleName); }
  this.pauseAnimation = function () { this.animation.pause(); }
  this.playAnimation = function () { this.animation.play(); }
  this.resetAnimation = function () { this.animation.reset(); }
  this.setAnimationSpeed = function (speed) { this.animation.setAnimationSpeed(speed); }
  this.calcVector = function () {
    this.dx = this.speed * Math.cos(this.moveAngle);
    this.dy = this.speed * Math.sin(this.moveAngle);
  }
  this.setSpeed = function (speed) {
    this.speed = speed;
    this.calcVector();
  }
  this.changeSpeedBy = function (diff) {
    this.speed += diff;
    this.calcVector();
  }
  this.setImgAngle = function (degrees) {
    degrees = degrees - 90;
    this.imgAngle = degrees * Math.PI / 180;
  }
  this.changeImgAngleBy = function (degrees) {
    rad = degrees * Math.PI / 180;
    this.imgAngle += rad;
  }
  this.setMoveAngle = function (degrees) {
    degrees = degrees - 90
    this.moveAngle = degrees * Math.PI / 180;
    this.calcVector();
  }
  this.changeMoveAngleBy = function (degrees) {
    diffRad = degrees * Math.PI / 180;
    this.moveAngle += diffRad;
    this.calcVector();
  }
  this.setAngle = function (degrees) {
    this.setMoveAngle(degrees);
    this.setImgAngle(degrees);
  }
  this.changeAngleBy = function (degrees) {
    this.changeMoveAngleBy(degrees);
    this.changeImgAngleBy(degrees);
  }
  this.collidesWith = function (sprite) {
    myLeft = this.x;
    myRight = this.x + this.width;
    myTop = this.y;
    myBottom = this.y + this.height;
    otherLeft = sprite.x;
    otherRight = sprite.x + sprite.width;
    otherTop = sprite.y;
    otherBottom = sprite.y + sprite.height;
    collision = true;
    if ((myBottom < otherTop) ||
        (myTop > otherBottom) ||
        (myRight < otherLeft) ||
        (myLeft > otherRight)) {
      collision = false;
    }
    return collision;
  }
  this.setCameraRelative = function (cam) { this.camera = cam; }
  this.report = function () {
    console.log("x: " + this.x + ", y: " + this.y + ", dx: "
         + this.dx + ", dy: " + this.dy
         + ", speed: " + this.speed
         + ", angle: " + this.moveAngle);
  }
}
function Tile(mapX, mapY, x, y, type) {
  this.x = x;
  this.y = y;
  this.mapX = mapX;
  this.mapY = mapY;
  this.isCollidable = false;
  this.collisionCallback = false;
  this.type = type;
  this.isAnimated = false;
  this.isCollidable = false;
  this.isClickable = false;
  this.clickCallback = false;
  this.animationPlaying = false;
  this.setCollision = function (callBack) {
    this.collisionCallback = callBack;
    this.isCollidable = true;
  }
  this.setAnimation = function () {
    this.isAnimated = true;
  }
  this.setClick = function (callBack) {
    this.isClickable = true;
    this.clickCallback = callBack;
  }
  this.checkCollision = function (sprite, w, h) {
    shw = sprite.width / 2;
    shh = sprite.height / 2;
    scx = sprite.x + shw;
    scy = sprite.y + shh;
    thw = w / 2;
    thh = h / 2;
    tcx = this.x + thw;
    tcy = this.y + thh;
    if (Math.abs(scx - tcx) < (thw + shw)) {
      if (Math.abs(scy - tcy) < (thh + shh)) {
        this.collisionCallback(this);
      }
    }
  }
}
function TileMap(scene) {
  this.tileSheet = new Image();
  this.tiles = new Array();
  this.symbolImageMap = new Array();
  this.tileAnimations = new Array();
  this.specificTileAnimations = new Array();
  this.mapData = false;
  this.tileWidth = 0;
  this.tileHeight = 0;
  this.sheetWidth = 0;
  this.sheetHeight = 0;
  this.camera = new Camera(scene);
  this.loadTileSheet = function (tileWidth, tileHeight, sheetWidth, sheetHeight, tileSheet, tileSymbols) {
    this.tileSheet.src = tileSheet;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.SheetWidth = sheetWidth;
    this.SheetHeight = sheetHeight;
    numRows = Math.floor(this.SheetWidth / this.tileWidth);
    numCols = Math.floor(this.SheetHeight / this.tileHeight);
    for (i = 0; i < numRows; i++) {
      for (j = 0; j < numCols; j++) {
        if ((i * numCols) + j < tileSymbols.length) {
          this.symbolImageMap[(i * numCols) + j] = new Array(j * this.tileWidth, i * this.tileHeight, tileSymbols[(i * numCols) + j]);
        }
      }
    }
  }
  this.loadMapData = function (mapArray) {
    this.mapData = new Array();
    for (i = 0; i < mapArray.length; i++) {
      this.mapData.push(new Array());
      temp = new Array();
      for (j = 0; j < mapArray[i].length; j++) {
        k = 0;
        notConverted = true;
        while (notConverted && k < this.symbolImageMap.length) {
          if (mapArray[i][j] == this.symbolImageMap[k][2]) { this.mapData[i][j] = k; notConverted = false; } 
          k++;
        }
        temp[j] = new Tile(j, i, j * this.tileWidth, i * this.tileHeight, k);
      }
      this.tiles.push(temp)
    }
  }
  this.drawMap = function () {
    this.camera.update();
    ctx = this.camera.context;
    for (i = 0; i < this.mapData.length; i++) {
      for (j = 0; j < this.mapData[i].length; j++) { 
        drawX = this.tiles[i][j].x - this.camera.cameraOffsetX;
        drawY = this.tiles[i][j].y - this.camera.cameraOffsetY;
        if (0 < drawX < this.camera.cWidth && 0 < drawY < this.camera.cHeight) {
          ctx.save();
          sheetX = this.symbolImageMap[this.mapData[i][j]][0];
          sheetY = this.symbolImageMap[this.mapData[i][j]][1];
          ctx.translate(drawX, drawY);
          if (this.tiles[i][j].animationPlaying) { this.drawTileAnimation(this.tiles[i][j], ctx); }
          else {
            ctx.drawImage(this.tileSheet, sheetX, sheetY, this.tileWidth, this.tileHeight, 0, 0, this.tileWidth, this.tileHeight);
            ctx.restore();
          }
        }
      }
    }
  }
  this.addTileCollision = function (collisionCallback, typeOrX, y) {
    if (typeof y == "undefined") { 
      for (i = 0; i < this.tiles.length; i++) {
        for (j = 0; j < this.tiles[i].length; j++) {
          if (this.tiles[i][j].type == typeOrX) {
            this.tiles[i][j].setCollision(collisionCallback);
          }
        }
      }
    }
    else { 
      this.tiles[typeOrX][y].setCollision(collisionCallback);
    }
  }
  this.loadCollisionMap = function (collisionMap) {
    for (l = 0; l < collisionMap.length; l++) {
      c = 0;
      notConverted = true;
      while (c < this.symbolImageMap.length && notConverted) {
        if (this.symbolImageMap[c][2] == collisionMap[l][0]) {
          collisionMap[l][0] = c + 1;
          notConverted = false;
        }
        c++;
      }
    }
    for (i = 0; i < this.tiles.length; i++) {
      for (j = 0; j < this.tiles[i].length; j++) {
        k = 0;
        notAssigned = true;
        while (k < collisionMap.length && notAssigned) {
          if (this.tiles[i][j].type == collisionMap[k][0]) {
            this.tiles[i][j].setCollision(collisionMap[k][1]);
            notAssigned = false;
          }
          k++;
        }
      }
    }
  }
  this.mapScroll = function (dx, dy) { this.camera.moveCamera(dx, dy); }
  this.cameraFollowSprite = function (sprite, waitX, waitY) { this.camera.followSprite(sprite, waitX, waitY); }
  this.loadZOrderMap = function (zMap) { }
  this.addTileAnimation = function (imgWidth, imgHeight, cellWidth, cellHeight, tileName, animSheet) {
    animation = new Animation(animSheet, imgWidth, imgHeight, cellWidth, cellHeight);
    animation.setup();
    for (i = 0; i < this.symbolImageMap.length; i++) { 
      if (this.symbolImageMap[i][2] = tileName) {
        this.tileAnimations[i] = animation;
      }
    }
  }
  this.addSpecificTileAnimation = function (imgWidth, imgHeight, cellWidth, cellHeight, tileX, tileY, animSheet) {
    animation = new Animation(animSheet, imgWidth, imgHeight, cellWidth, cellHeight);
    animation.setup();
    this.specificTileAnimations[tileX][tileY] = animation;
  }
  this.drawTileAnimation = function (tile, ctx) {
    notSpecific = true;
    if (typeof this.specificTileAnimations[tile.mapX][tile.mapY] !== 'undefined' && this.specificTileAnimations[tile.mapX][tile.mapY] !== null) {
      notSpecific = false;
      this.specificTileAnimations[tile.mapX][tile.mapY].reset();
      this.specificTileAnimations[tile.mapX][tile.mapY].drawFrame(ctx);
    }
    if (typeof this.tileAnimations[tile.type] !== 'undefined' && this.tileAnimations[tile.type] !== null && notSpecific) {
      this.tileAnimations[tile.type].reset();
      this.tileAnimations[tile.type].drawFrame(ctx);
    }
  }
  this.playTileAnimation = function (tile) { tile.animationPlaying = true; }
  this.stopTileAnimation = function (tile) { tile.animationPlaying = false; }
  this.checkCollisions = function (sprite) { 
    tileCoordX = Math.floor(sprite.x / this.tileWidth);
    tileCoordY = Math.floor(sprite.y / this.tileHeight);
    checkRowsBegin = tileCoordX - 1;
    checkRowsEnd = tileCoordX + 2;
    checkColsBegin = tileCoordY - 1;
    checkColsEnd = tileCoordY + 2;
    if (tileCoordX > -1 && tileCoordY > -1 && tileCoordY < this.mapData.length && tileCoordX < this.mapData[tileCoordY].length) {
      if (tileCoordX == 0) { checkRowsBegin = 0; }
      if (tileCoordX == (this.mapData[tileCoordY].length - 1)) { checkRowsEnd = this.mapData.length; }
      if (tileCoordY == 0) { checkColsBegin = 0; }
      if (tileCoordY == (this.mapData.length - 1)) { checkColsBegin = this.mapData[tileCoordY].length; }
      for (i = checkColsBegin; i < checkColsEnd; i++) {
        for (j = checkRowsBegin; j < checkRowsEnd; j++) {
          if (this.tiles[i][j].isCollidable) {
            this.tiles[i][j].checkCollision(sprite, this.tileWidth, this.tileHeight);
          }
        }
      }
    }
  }
  this.makeSpriteMapRelative = function (sprite) { sprite.setCameraRelative(this.camera); }
  this.setPosition = function () { }
}
//#endregion funcs (gameEngine.js)
