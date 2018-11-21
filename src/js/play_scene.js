'use strict';
var Classes = require("./classes.js");

var PlayScene = {
  
  create: function () {

    ////////////////////////////////////////////////////////////////////////////////////////////////
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);

    //misc variables
    this.paused = true;
    this.timeScale = 1;
    this.currentTime = { "hour": 0, "buffer": 0};
    this.homelessArray = [];
    this.shiftStart = 8;
    this.shiftEnd = 20;
    this._tileSize = 16;
    this._buildModeActive = false;

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

    this.houseGroup = this.game.add.group();
    this.woodGroup = this.game.add.group();
    this.coalGroup = this.game.add.group();
    this.uraniumGroup = this.game.add.group();
    this.energyGroup = this.game.add.group();
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

    this.game.input.onDown.add(click, this);

    

    
    function setTimescale(key){
      this.timeScale = parseInt(key.event.key);
      this.currentTime.buffer = 0;
    }

    function pauseTime(){
      this.paused = !this.paused;
    }

    function buildMode(key = undefined){
      if(!this._buildModeActive){
        this._buildingModeSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'buildTest');
        this._buildingModeSprite.anchor.setTo(0.5, 0.5);
        this.paused = true;
        this._buildModeActive = true;
      }
      else if(this._buildingModeSprite !== undefined){
        this._buildingModeSprite.destroy();
        this._buildModeActive = false;
      }
    }


    function click(){
      if(this._buildModeActive)
        buildTest.call(this);
    }

    function buildTest(){

      var aux = new Classes.Producer(this.game, Math.round(this.game.input.x / this._tileSize) * this._tileSize, Math.round(this.game.input.y / this._tileSize) * this._tileSize, "buildTest", 1);
      aux.anchor.setTo(0.5, 0.5);
      this.woodGroup.add(aux);

      buildMode.call(this);
    }
  },

  update: function () {

    if(!this.paused){
      this.currentTime.buffer += this.timeScale; //buffer increment

      if (this.currentTime.buffer >=3) { //if buffer > 3, update. AKA, speed 1 = every 3 loops, speed 2 = every 2 loops... etc.
        
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
        //console.log(this.wood);
        //console.log(currentTime.hour); 
        //console.log("DING");
      }
      
      else {
        //----DEBUG----

        //console.log("waiting..."); 
      }
    }

    else if(this._buildModeActive){
      this._buildingModeSprite.x = Math.round(this.game.input.x / this._tileSize) * this._tileSize;
      this._buildingModeSprite.y = Math.round(this.game.input.y / this._tileSize) * this._tileSize;
    }
  }
};

module.exports = PlayScene;
