'use strict';
var Classes = require("./classes.js");

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

    //misc variables
    this.paused = true;
    this.timeScale = 1;
    this.currentTime = { "hour": 0, "buffer": 0};
    this.homelessArray = [];
    this.shiftStart = 8;
    this.shiftEnd = 20;
    this._tileSize = this.map.tileWidth;
    this._buildModeActive = false;
    this._destroyModeActive = false;

    this._buildingModeSprite;

    /////////GROUPS AND RESOURCES
    this.houseGroup;
    this.food = 0;

    this.woodGroup;
    this.wood = 0;

    this.coalGroup;
    this.coal = 0;

    this.uraniumGroup;
    this.uranium = 0;

    this.energyGroup;
    this.energy = 0;

    //etc...
    ////////////////////////////////////////////////////////////////////////////////////////////////

    this.buildingGroup = this.game.add.group();

    this.houseGroup = this.game.add.group();
    this.buildingGroup.add(this.houseGroup);

    this.woodGroup = this.game.add.group();
    this.buildingGroup.add(this.woodGroup);

    this.coalGroup = this.game.add.group();
    this.buildingGroup.add(this.coalGroup);

    this.uraniumGroup = this.game.add.group();
    this.buildingGroup.add(this.uraniumGroup);

    this.energyGroup = this.game.add.group();
    this.buildingGroup.add(this.energyGroup);
    //etc...

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
    key_K.onDown.add(buildMode, this);

    var key_L = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
    key_L.onDown.add(destroyMode, this);

    this.game.input.onDown.add(click, this);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    

    
    function setTimescale(key){
      this.timeScale = parseInt(key.event.key);
      this.currentTime.buffer = 0;
    }

    function pauseTime(){
      this.paused = !this.paused;
      if(!this.paused && this._buildModeActive)
        buildMode.call(this);
      this._destroyModeActive = false;
    }

    function destroyMode(key = undefined){
      if(this._buildModeActive)
      this._buildModeActive = false;


      if(!this._destroyModeActive){
        this.paused = true;
        this._destroyModeActive = true;
      }

      else{
        this._destroyModeActive = false;
      }
    }

    function buildMode(key = undefined){
      if(this._destroyModeActive)
        this._destroyModeActive = false;


      if(!this._buildModeActive){
        this._buildingModeSprite = this.game.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, 'buildTest');
        this._buildingModeSprite.anchor.setTo(0.5, 0.5);
        this._buildingModeSprite.alpha = 0.7;
        
        this.paused = true;
        this._buildModeActive = true;
      }

      else{
        if(this._buildingModeSprite !== undefined)
          this._buildingModeSprite.destroy();

        this._buildModeActive = false;
      }
    }

    function click(){
      if(this._buildModeActive)
        buildTest.call(this);
      else if(this._destroyModeActive)
        destroyTest.call(this);
    }

    function destroyTest(){
      this.woodGroup.forEach(function(prod){
        if(prod.input.pointerOver())
          prod.destroy();
      }, this);
    }

    function buildTest(){
      var overlap = false;

      this.buildingGroup.forEach(function (group){
        group.forEach(function(building){
          overlap = overlap || this.checkOverlap.call(this, this._buildingModeSprite, building);
        }, this)
      }, this);


      if(!overlap){
        var auxBuilding = new Classes.Producer(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, "buildTest", 1);
        auxBuilding.anchor.setTo(0.5, 0.5);

        auxBuilding.inputEnabled = true;
        auxBuilding.input.priorityID = 1;
        auxBuilding.events.onInputOver.add(mouseOver, this, 0, auxBuilding);
        auxBuilding.events.onInputOut.add(mouseOut, this, 0, auxBuilding);

        this.woodGroup.add(auxBuilding);

        buildMode.call(this);
      }
    }

    function mouseOver(sprite){
      if(this._destroyModeActive)
        sprite.tint = 0xFF0000;
    }

    function mouseOut(sprite){
        sprite.tint = 0xFFFFFF;
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
  },

  update: function () {

    if(!this.paused){
      this.currentTime.buffer += this.timeScale; //buffer increment

      if (this.currentTime.buffer >=9) { //if buffer > 3, update. AKA, speed 1 = every 3 loops, speed 2 = every 2 loops... etc.
        
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

          this.houseGroup.forEach(function(prod){
            this.food -= prod.countCitizens * 5;
          }, this);

          this.homelessArray.forEach(function(){
            this.food -= 5;
          }, this);
        }
        
        ////////////////////////////////////////
        //update citizens

        //----DEBUG----
        console.log(this.wood);
        //console.log(currentTime.hour); 
        //console.log("DING");
      }
      
      else {
        //----DEBUG----

        //console.log("waiting..."); 
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

    if (this.cursors.up.isDown)
      this.game.camera.y -= 16;

    else if (this.cursors.down.isDown)
      this.game.camera.y += 16;

    if (this.cursors.left.isDown)
      this.game.camera.x -= 16;

    else if (this.cursors.right.isDown)
      this.game.camera.x += 16;
  },

  render: function() {
    this.game.debug.text("Current speed: " + this.timeScale, 10, 485);
    this.game.debug.text("Wood: " + this.wood, 10, 500);
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
    
      
  }
};

module.exports = PlayScene;
