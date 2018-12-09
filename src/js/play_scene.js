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

    this.volume = 50;

    this.gameMusic = this.game.add.audio('gameSound'); 

    this.gameMusic.play();
    this.gameMusic.loop = true;
    this.gameMusic.volume = this.volume / 100;

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

    var volumeText = this.game.add.text(optionsBkg.x, optionsBkg.y - 20, this.volume);
    volumeText.anchor.setTo(0.5, 0.5);
    volumeText.fixedToCamera = true;
    volumeText.smoothed = false;

    this.optionsMenu.add(volumeText);

    var optionsMinus = this.game.add.button(optionsBkg.x - 77, optionsBkg.y - 20, "minusBttn", function(){updateVolume.call(this, -5);}, this, 0, 0, 1);
    optionsMinus.anchor.setTo(0.5, 0.5);
    optionsMinus.fixedToCamera = true;
    optionsMinus.smoothed = false;

    this.optionsMenu.add(optionsMinus);
    
    var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){updateVolume.call(this, 5);}, this, 0, 0, 1);
    optionsPlus.anchor.setTo(0.5, 0.5);
    optionsPlus.fixedToCamera = true;
    optionsPlus.smoothed = false;

    this.optionsMenu.add(optionsPlus);

    var optionsBack = this.game.add.button(optionsBkg.x - 47, optionsBkg.y + 48, "backBttn", function(){this.optionsMenu.visible = false; this.pauseMenu.visible = true; this.game.world.bringToTop(this.pauseMenu);}, this, 0, 0, 1);
    optionsBack.anchor.setTo(0.5, 0.5);
    optionsBack.fixedToCamera = true;
    optionsBack.smoothed = false;

    this.optionsMenu.add(optionsBack);

    var optionsMute = this.game.add.button(optionsBkg.x + 47, optionsBkg.y + 48, "muteBttn", function(){mute.call(this);}, this, 0, 0, 1);
    if(this.game.sound.mute)
      optionsMute.setFrames(2, 2, 3);
    optionsMute.anchor.setTo(0.5, 0.5);
    optionsMute.fixedToCamera = true;
    optionsMute.smoothed = false;

    this.optionsMenu.add(optionsMute);


    this.optionsMenu.visible = false;

    function updateVolume(update){
      if(this.volume + update >= 0 && this.volume + update <= 100){

        this.volume += update;
        this.gameMusic.volume = this.volume / 100;

        this.optionsMenu.forEach(function(text){
          if (text.text !== null)
            text.text = this.volume;
          }, this);
      }
    }

    function mute(){
      this.game.sound.mute = !this.game.sound.mute;
      this.optionsMenu.forEach(function(button){
        if(button.key == "muteBttn"){
          if(this.game.sound.mute)
            button.setFrames(2, 2, 3);
          else
            button.setFrames(0, 0, 1);
        }
      }, this);
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
