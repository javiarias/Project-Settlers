(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function House(game, x, y, img) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.coziness = 0;
    this._calculateCoziness();
    this.residentA = undefined;
    this.residentB = undefined;
    this.hospitalNear = false;
    this.full = false;
    this.numberOfBirths = 0;
}
House.prototype = Object.create(Phaser.Sprite.prototype);
House.constructor = House;

House.prototype._calculateCoziness = function() {
    var coziness = 0;

    /*for(i = -1; i <= 1; i++)
        for(j = -1; j <= 1; j++)
            if (this.x + i >= 0 && this.x + i < map.mapSize && this.y + j >= 0 && this.y + j < map.mapSize){
                var aux = map.mapArray.get(x + i, y + j);
                if(aux.terrain == 0 || aux.terrain == 3)
                    coziness += 1;
                else if(aux.terrain == 2)
                    coziness += 2;

                //CHECK IF THERE ARE DECORATIONS NEARBY
            }*/

    this.coziness = coziness;
};

House.prototype.add = function(citizen) {
    var ret = true;
    if(this.residentA === undefined){
        this.residentA = citizen;
    }

    else if(this.residentB === undefined){
        this.residentB = citizen;
    }

    else
        ret = false;

    this.full = (this.countCitizens() == 2);

    return ret;
};

House.prototype.kill = function(citizen) {
    var ret = true;
    if(this.residentA == citizen){
        this.residentA = undefined;
        full = false;
    }
    else if(this.residentB == citizen){
        this.residentB = undefined;
        full = false;
    }

    else
        ret = false;

    return ret;
};

House.prototype.bulldoze = function(homelessArray) {
    
    if(this.residentA !== undefined){
        homelessArray.unshift(this.residentA);
    }
    if(this.residentB !== undefined){
        homelessArray.unshift(this.residentB);
    }
};

House.prototype.tick = function(foodAmount, homelessArray){
    this.numberOfBirths = 0;

    if(this.residentA !== undefined){
        this.residentA.tick(foodAmount, this.hospitalNear, this, homelessArray);
        if(this.residentA.givingBirth){
            this.residentA.givingBirth = false;
            this.residentA.birthCooldown = 10;
            this.numberOfBirths++;
        }
    }

    if(this.residentB !== undefined){
        this.residentB.tick(foodAmount, this.hospitalNear, this, homelessArray);
        if(this.residentB.givingBirth){
            this.residentB.givingBirth = false;
            this.residentB.birthCooldown = 10;
            this.numberOfBirths++;
        }
    }
};

House.prototype.countCitizens = function(){
    var ret = 0;

    if(this.residentA !== undefined){
        ret++;
    }
    if(this.residentB !== undefined){
        ret++;
    }

    return ret;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Producer(game, x, y, img, amount, consumes = "none", consumed = 0) { 
    Phaser.Sprite.call(this, game, x, y, img); //img needs to be filtered depending on resource. Done outside the function?
    this.amount = amount;
    this.consumes = consumes;
    this.consumed = consumed;
}
Producer.prototype = Object.create(Phaser.Sprite.prototype);
Producer.constructor = Producer;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Hospital(game, x, y, img) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.get = "fucked";
}
Hospital.prototype = Object.create(Phaser.Sprite.prototype);
Hospital.constructor = Hospital;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Road(game, x, y, img) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.get = "fucked";
}
Road.prototype = Object.create(Phaser.Sprite.prototype);
Road.constructor = Road;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Cleaner(game, x, y, img) {} //i'd leave the code for this for when we have a bunch of the game made. It'd probably be mid/late-game stuff and we need an algorithm to process stuff around it
Cleaner.prototype = Object.create(Phaser.Sprite.prototype);
Cleaner.constructor = Cleaner;

function Decor(game, x, y, img) {} //i'd leave the code for this for when we have a bunch of the game made, too
Decor.prototype = Object.create(Phaser.Sprite.prototype);
Decor.constructor = Decor;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Citizen(homelessArray) {
    this.name = (Math.random() * 100) + 1;
    this.age = 0; //De momento no es necesario
    this.health = 100; //Valor modificable
    this.sick = false;
    this.homeless = true;
    this.birthCooldown = 0;
    this.givingBirth = false;
    homelessArray.unshift(this);
}
Citizen.constructor = Citizen;

Citizen.prototype.addToHouse = function (homelessArray, houseGroup){
    var found = false;

    houseGroup.forEach(function (house) {
        if(!house.full && !found){
            if(house.add(this)){
                found = true;
                this.homeless = false;
            }
        }
    }, this);

    return found;
};

Citizen.prototype.tick = function(foodAmount, healing, house, homelessArray, houseGroup = null){
    this.age++;
    this.birthCooldown--;

    if(this.sick)
        this.health -= 5;
    if(foodAmount <= 0)
        this.health -= 5;
    if(this.age > 100)
        this.health = this.health * .9;
    if(healing)
        this.health += 10;

    if (this.health <= 0){
        if(!this.homeless)
            house.kill(this);
    }

    if (!this.homeless && house.full && this.birthCooldown <= 0 && Math.floor((Math.random() * 100) + 1) > 100) //Probabilidad que se puede cambiar
        this.givingBirth = true;

    
    else if(this.homeless){
        this.addToHouse(homelessArray, houseGroup);
        
        this.health -= 0;
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = {
    Road: Road,
    House: House,
    Producer: Producer,
    Cleaner: Cleaner,
    Decor: Decor,
    Hospital: Hospital,
    Citizen: Citizen
};
},{}],2:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  init: function() {

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.setMinMax(480, 260, 1024, 768);
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  },
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    
    this.game.scale.windowConstraints.bottom = 'visual';
    this.game.scale.windowConstraints.right = 'visual';
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {

    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar ');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/HERO.png');
    this.game.load.image('test', 'images/Phaser.png');
    this.game.load.image("fade", "images/fade.png");

    //building sprites
    this.game.load.image('Crops', 'images/buildings/Crops.png');
    this.game.load.image('Energy', 'images/buildings/Energy.png');
    this.game.load.image('Hospital', 'images/buildings/Hospital.png');
    this.game.load.image('House', 'images/buildings/House.png');
    this.game.load.image('Stone', 'images/buildings/Stone.png');
    this.game.load.image('Coal', 'images/buildings/Coal.png');
    this.game.load.image('Road', 'images/buildings/road.png');
    this.game.load.image('Road Down', 'images/buildings/road down.png');
    this.game.load.image('Road Left', 'images/buildings/road left.png');
    this.game.load.image('Road Right', 'images/buildings/road right.png');
    this.game.load.image('Road Up', 'images/buildings/road up.png');
    this.game.load.image('Uranium', 'images/buildings/Uranium.png');
    this.game.load.image('Water', 'images/buildings/Water.png');
    this.game.load.image('Wind', 'images/buildings/Wind.png');
    this.game.load.image('Wood', 'images/buildings/Wood.png');


  
    //map 
    this.game.load.tilemap('tilemap', 'images/map/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('patronesTilemap', 'images/map/tileset.png');

    //sounds
    this.game.load.audio('menuSound', ['sounds/menu.mp3', 'sounds/menu.ogg']);
    this.game.load.audio('gameSound', ['sounds/game.mp3', 'sounds/game.ogg']);

    //menus
    this.game.load.image('pauseBkg', 'images/menu/pauseMenu.png');
    this.game.load.image('optionsBkg', 'images/menu/optionsMenu.png');
    this.game.load.spritesheet('exitBttn', 'images/menu/exit.png', 55, 48);
    this.game.load.spritesheet('minBttn', 'images/menu/minimize.png', 55, 48);
    this.game.load.spritesheet('settBttn', 'images/menu/settings.png', 55, 48);
    this.game.load.spritesheet('plusBttn', 'images/menu/plus.png', 55, 48);
    this.game.load.spritesheet('minusBttn', 'images/menu/minus.png', 55, 48);
    this.game.load.spritesheet('backBttn', 'images/menu/back.png', 55, 48);

  },

  create: function () {
    this.game.state.start('main');
  }
};

var MainMenu = {
  create: function(){
    this.txt = this.game.add.text(this.game.camera.x + (this.game.width/2), this.game.camera.y + (this.game.height/5), "press the doggo to continue", {font: "30px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 3});
    this.txt.anchor.setTo(0.5, 0.5);

    this.button = this.game.add.button(this.game.camera.x + (this.game.width/2), this.game.camera.y + 2.5 * (this.game.height/4), 'logo', gameStart, this);
    this.button.anchor.setTo(0.5, 0.5);

    var menuMusic = this.game.add.audio('menuSound');
    menuMusic.play();
    menuMusic.loop = true;

    function gameStart() {
      menuMusic.stop();
      this.game.state.start('play');
    }
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('main', MainMenu);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};

},{"./play_scene.js":3}],3:[function(require,module,exports){
'use strict';
var Classes = require("./buildings.js");

var PlayScene = {
  
  create: function () {

    ////////////////////////////////////////////////////////////////////////////////////////////////
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);

    this.map = this.game.add.tilemap('tilemap'); 
    this.map.addTilesetImage("Tileset","patronesTilemap");

    //layers
    this.map.waterLayer = this.map.createLayer ("water");
    this.map.groundLayer = this.map.createLayer ("soil");
    this.map.resourcesLayer = this.map.createLayer ("resources");
    this.map.obstaclesLayer = this.map.createLayer ("obstacles");

    this.map.waterLayer.resizeWorld();
    this.map.groundLayer.resizeWorld();
    this.map.resourcesLayer.resizeWorld();
    this.map.obstaclesLayer.resizeWorld();

    //music

    this.gameMusic = this.game.add.audio('gameSound'); 

    this.gameMusic.play();
    this.gameMusic.loop = true;
    this.gameMusic.volume = 0.5;

    this.paused = true;
    this.timeScale = 1;
    this.currentTime = { "hour": 0, "buffer": 0};
    this.homelessArray = [];
    this.shiftStart = 8;
    this.shiftEnd = 20;
    this._tileSize = this.map.tileWidth;
    this._buildModeActive = false;
    this._destroyModeActive = false;
    this._escapeMenu = false;
    this.fade;

    this._buildingModeSprite;
    this._buildingModeType = "";

    /////////GROUPS AND RESOURCES
    this.food = 100;

    this.wood = 0;

    this.coal = 0;

    this.uranium = 0;

    this.energy = 0;

    this.water = 0;

    //etc...
    ////////////////////////////////////////////////////////////////////////////////////////////////

    this.buildingGroup = this.game.add.group();

    this.houseGroup = this.game.add.group();
    this.buildingGroup.add(this.houseGroup);
    this.houseGroup.sprite = 'House';

    this.woodGroup = this.game.add.group();
    this.buildingGroup.add(this.woodGroup);
    this.woodGroup.sprite = 'Wood';

    this.coalGroup = this.game.add.group(); //Comentado de momento, añado un grupo Mine y ya vemos como hacer el reparto de recursos (¿Stone + Coal?)
    this.buildingGroup.add(this.coalGroup);
    this.coalGroup.sprite = 'Coal'

    this.uraniumGroup = this.game.add.group();
    this.buildingGroup.add(this.uraniumGroup);
    this.uraniumGroup.sprite = 'Uranium';

    this.energyGroup = this.game.add.group();
    this.buildingGroup.add(this.energyGroup);
    this.energyGroup.sprite = 'Energy';

    this.windGroup = this.game.add.group();
    this.buildingGroup.add(this.windGroup);
    this.windGroup.sprite = 'Wind';

    this.roadsGroup = this.game.add.group();
    this.buildingGroup.add(this.roadsGroup);
    this.roadsGroup.sprite = 'Road'; //Grupo de sprites (?)

    this.waterGroup = this.game.add.group();
    this.buildingGroup.add(this.waterGroup);
    this.waterGroup.sprite = 'Water';

    this.hospitalGroup = this.game.add.group();
    this.buildingGroup.add(this.hospitalGroup);
    this.hospitalGroup.sprite = 'Hospital';

    this.stoneGroup = this.game.add.group();
    this.buildingGroup.add(this.stoneGroup);
    this.stoneGroup.sprite = 'Stone';

    this.cropGroup = this.game.add.group();
    this.buildingGroup.add(this.cropGroup);
    this.cropGroup.sprite = 'Crops';

    //etc.

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //pause menu
    this.pauseMenu = this.game.add.group();

    var pauseBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "pauseBkg");
    pauseBkg.anchor.setTo(.5, .5);
    pauseBkg.fixedToCamera = true;
    pauseBkg.smoothed = false;
    this.pauseMenu.add(pauseBkg);

    var pauseSettings = this.game.add.button(pauseBkg.x - 72, pauseBkg.y + 3, "settBttn", function(){this.optionsMenu.visible = true; this.pauseMenu.visible = false; this.game.world.bringToTop(this.optionsMenu);}, this, 0, 0, 1);
    pauseSettings.anchor.setTo(0.5, 0.5);
    pauseSettings.fixedToCamera = true;
    pauseSettings.smoothed = false;

    this.pauseMenu.add(pauseSettings);

    var pauseMinimize = this.game.add.button(pauseBkg.x, pauseBkg.y + 3, "minBttn", escape, this, 0, 0, 1);
    pauseMinimize.anchor.setTo(0.5, 0.5);
    pauseMinimize.fixedToCamera = true;
    pauseMinimize.smoothed = false;

    this.pauseMenu.add(pauseMinimize);
    
    var pauseExit = this.game.add.button(pauseBkg.x + 72, pauseBkg.y + 3, "exitBttn", function(){}, this, 0, 0, 1);
    pauseExit.anchor.setTo(0.5, 0.5);
    pauseExit.fixedToCamera = true;
    pauseExit.smoothed = false;

    this.pauseMenu.add(pauseExit);


    this.pauseMenu.visible = false;

    //volume menu
    this.optionsMenu = this.game.add.group();

    var optionsBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "optionsBkg");
    optionsBkg.anchor.setTo(.5, .5);
    optionsBkg.fixedToCamera = true;
    optionsBkg.smoothed = false;

    this.optionsMenu.add(optionsBkg);

    var volumeText = this.game.add.text(optionsBkg.x, optionsBkg.y - 20, this.gameMusic.volume * 100);
    volumeText.anchor.setTo(0.5, 0.5);
    volumeText.fixedToCamera = true;
    volumeText.smoothed = false;

    this.optionsMenu.add(volumeText);

    var optionsMinus = this.game.add.button(optionsBkg.x - 77, optionsBkg.y - 20, "minusBttn", function(){updateVolume.call(this, -0.05);}, this, 0, 0, 1);
    optionsMinus.anchor.setTo(0.5, 0.5);
    optionsMinus.fixedToCamera = true;
    optionsMinus.smoothed = false;

    this.optionsMenu.add(optionsMinus);
    
    var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){updateVolume.call(this, 0.05);}, this, 0, 0, 1);
    optionsPlus.anchor.setTo(0.5, 0.5);
    optionsPlus.fixedToCamera = true;
    optionsPlus.smoothed = false;

    this.optionsMenu.add(optionsPlus);

    var optionsBack = this.game.add.button(optionsBkg.x, optionsBkg.y + 48, "backBttn", function(){this.optionsMenu.visible = false; this.pauseMenu.visible = true; this.game.world.bringToTop(this.pauseMenu);}, this, 0, 0, 1);
    optionsBack.anchor.setTo(0.5, 0.5);
    optionsBack.fixedToCamera = true;
    optionsBack.smoothed = false;

    this.optionsMenu.add(optionsBack);


    this.optionsMenu.visible = false;

    function updateVolume(update){
      if(this.gameMusic.volume + update >= 0 && this.gameMusic.volume + update <= 1){

        this.gameMusic.volume += update;
        this.gameMusic.volume = Math.round(this.gameMusic.volume * 100) / 100

        this.optionsMenu.forEach(function(text){
          if (text.text !== null)
            text.text = Math.round(this.gameMusic.volume * 100);
          }, this);
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    //keyboard phaser
    var key_One = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key_One.onDown.add(setTimescale, this);

    var key_Two = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key_Two.onDown.add(setTimescale, this);

    var key_Three = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key_Three.onDown.add(setTimescale, this);

    var key_Space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key_Space.onDown.add(pauseTime, this);

    var key_K = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
    key_K.onDown.add(buildMode, this, 0, this.houseGroup);

    var key_J = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
    key_J.onDown.add(buildMode, this, 0, this.woodGroup);

    var key_L = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
    key_L.onDown.add(destroyMode, this);

    var key_Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    key_Q.onDown.add(addCitizen, this);

    var key_ESC = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    key_ESC.onDown.add(escape, this);

    this.game.input.onDown.add(click, this);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.cursorsAlt = this.game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );

    
    function setTimescale(key){
      this.timeScale = parseInt(key.event.key);
      this.currentTime.buffer = 0;
    }

    function pauseTime(){
      if(!this._escapeMenu) {
        this.paused = !this.paused;
        if(!this.paused && this._buildModeActive)
          buildMode.call(this);
        this._destroyModeActive = false;
      }
    }

    function destroyMode(){
      if(!this._escapeMenu) {
        if(this._buildModeActive){
          this._buildModeActive = false;
          if(this._buildingModeSprite !== undefined)
            this._buildingModeSprite.destroy();
        }


        if(!this._destroyModeActive){
          this.paused = true;
          this._destroyModeActive = true;
        }

        else{
          this._destroyModeActive = false;
        }
      }
    }

    function buildMode(key = undefined, group){
      if(!this._escapeMenu) {
        if(this._destroyModeActive)
          this._destroyModeActive = false;


        if(!this._buildModeActive){
          this._buildingModeSprite = this.game.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, group.sprite);
          this._buildingModeSprite.anchor.setTo(0.5, 0.5);
          this._buildingModeSprite.alpha = 0.7;

          this._buildingModeType = group;
          
          this.paused = true;
          this._buildModeActive = true;
        }

        else {
          if(this._buildingModeSprite !== undefined)
            this._buildingModeSprite.destroy();

          this._buildModeActive = false;
        }
      }
    }

    function click(){
      if(!this._escapeMenu) {
        if(this._buildModeActive)
          build.call(this);
        else if(this._destroyModeActive)
          destroy.call(this);
      }
    }

    function destroy(){
      this.buildingGroup.forEach(function(group){
        group.forEach(function (prod){
          if(prod.input.pointerOver())
            if(prod.full !== null)
              prod.bulldoze();
            prod.destroy();
        }, this);
      }, this);
    }

    function build(){
      var overlap = false;

      this.buildingGroup.forEach(function (group){
        group.forEach(function(building){
          overlap = overlap || this.checkOverlap.call(this, this._buildingModeSprite, building);
        }, this)
      }, this);


      if(!overlap){
        var auxBuilding;

        if(this._buildingModeType == this.houseGroup)
          auxBuilding = new Classes.House(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite, 1);
        else
          auxBuilding = new Classes.Producer(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite, 1);
        auxBuilding.anchor.setTo(0.5, 0.5);

        auxBuilding.inputEnabled = true;
        auxBuilding.input.priorityID = 1;
        auxBuilding.events.onInputOver.add(mouseOver, this, 0, auxBuilding);
        auxBuilding.events.onInputOut.add(mouseOut, this, 0, auxBuilding);

        this._buildingModeType.add(auxBuilding);

        buildMode.call(this);
      }
    }

    function mouseOver(sprite){
      if(this._destroyModeActive && !this._escapeMenu)
        sprite.tint = 0xFF0000;
    }

    function mouseOut(sprite){
        sprite.tint = 0xFFFFFF;
    }

    function escape(){
      this._escapeMenu = !this._escapeMenu;

      if(this._escapeMenu) {
        this.fade = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'fade');
        this.fade.width = this.game.camera.width;
        this.fade.height = this.game.camera.height;
        this.fade.alpha = 0.5;
        
        this.game.world.bringToTop(this.pauseMenu);
      }

      else
        this.fade.destroy();

      this.pauseMenu.visible = this._escapeMenu;
    }

    this.checkOverlap = function(a, b){

      var x = a.getBounds();
      x.width--;
      x.height--;
      var y = b.getBounds();
      y.width--;
      y.height--;

      return Phaser.Rectangle.intersects(x, y);
    }

    function addCitizen()
    {
      var citizen = new Classes.Citizen(this.homelessArray);
    } 
  },


  update: function () {
    if(!this._escapeMenu) {
      if(!this.paused){
        this.currentTime.buffer += this.timeScale; //buffer increment

        if (this.currentTime.buffer >= 9) { //if buffer > 3, update. AKA, speed 1 = every 3 loops, speed 2 = every 2 loops... etc.
          
          //update clock
          this.currentTime.buffer = 0;

          this.currentTime.hour = (this.currentTime.hour + 1) % 24; 
        
          ////////////////////////////////////////
          //update producers
          if(this.currentTime.hour >= this.shiftStart && this.currentTime.hour<= this.shiftEnd){

            this.woodGroup.forEach(function(prod){
              this.wood += prod.amount;
            }, this);

            this.coalGroup.forEach(function(prod){
              this.coal += prod.amount;
            }, this);

            this.uraniumGroup.forEach(function(prod){
              this.uranium += prod.amount;
            }, this);

            //etc...

            //update consumers
            this.energyGroup.forEach(function(prod){
              this.energy += prod.amount;

              switch(prod.consumes){

                case "uranium":
                this.uranium -= prod.consumed;
                  break;

                  //other cases for other consumers
              }
            }, this);

          }

          else if(this.currentTime.hour == 0){

            this.houseGroup.forEach(function(prod){
              this.food -= 5 * prod.countCitizens();
              prod.tick(this.food, this.homelessArray);

              for(var i = prod.numberOfBirths; i > 0; i--)
                var aux = new Classes.Citizen(this.homelessArray);

            }, this);

            for (var i = this.homelessArray.length - 1; i >= 0; i--) {
              if(this.food > 0)
                this.food -= 5;
              this.homelessArray[i].tick(this.food, false, null, this.homelessArray, this.houseGroup);
            }
          }

          var originalLength = this.homelessArray.length;
            for (var i = this.homelessArray.length - 1; i >= 0; i--) {
              if(!this.homelessArray[i].homeless || this.homelessArray[i].health <= 0)
                this.homelessArray.splice(i, 1);

              if(this.homelessArray.length > originalLength)
                i += (this.homelessArray.length - originalLength);
            }

        }
      }

      else if(this._buildModeActive){
        this._buildingModeSprite.x = Math.round(this.game.input.worldX / this._tileSize) * this._tileSize;
        this._buildingModeSprite.y = Math.round(this.game.input.worldY / this._tileSize) * this._tileSize;

        var overlap = false;

        this.buildingGroup.forEach(function (group){
          group.forEach(function(building){
            overlap = overlap || this.checkOverlap.call(this, this._buildingModeSprite, building);
          }, this)
        }, this);

        if (overlap)
          this._buildingModeSprite.tint = 0xFF0000;
        else
        this._buildingModeSprite.tint = 0xFFFFFF;
      }

      if (this.cursors.up.isDown || this.cursorsAlt.up.isDown)
        this.game.camera.y -= 16;

      else if (this.cursors.down.isDown || this.cursorsAlt.down.isDown)
        this.game.camera.y += 16;

      if (this.cursors.left.isDown || this.cursorsAlt.left.isDown)
        this.game.camera.x -= 16;

      else if (this.cursors.right.isDown || this.cursorsAlt.right.isDown)
        this.game.camera.x += 16;
    }
  },

  render: function() {
    this.game.debug.text("Current speed: " + this.timeScale, 10, 485);
    this.game.debug.text("Food: " + this.food, 10, 500);
    this.game.debug.text("Game paused: " + this.paused, 10, 515);    
    var mode = "NONE";
    if(this._buildModeActive)
      mode = "building";
    else if(this._destroyModeActive)
      mode = "destroying";

    this.game.debug.text("Current mode: " + mode, 10, 530);

    this.game.debug.text("Current time: " + this.currentTime.hour + ":00", 10, 545);

    if(this.currentTime.hour >= this.shiftStart && this.currentTime.hour<= this.shiftEnd)
      this.game.debug.text("WORK TIME!!", 10, 560);
    
    var aux = 0;

    this.houseGroup.forEach(function(house){aux += house.countCitizens();});
    this.game.debug.text("Citizens in homes: " + aux, 10, 575);

    this.game.debug.text("Homeless citizens: " + this.homelessArray.length, 10, 590);
  }
};

module.exports = PlayScene;

},{"./buildings.js":1}]},{},[2]);
