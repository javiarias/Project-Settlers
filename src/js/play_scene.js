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
    key_One.onDown.add(setTimescale, this, 0, 1);

    var key_Two = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key_Two.onDown.add(setTimescale, this, 0, 2);

    var key_Three = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key_Three.onDown.add(setTimescale, this, 0, 3);

    var key_Space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key_Space.onDown.add(pauseTime, this);

    var key_K = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
    key_K.onDown.add(buildWood, this);


    

    
    function setTimescale(key, time){
      this.timeScale = time;
      this.currentTime.buffer = 0;
    }

    function pauseTime(){
      this.paused = !this.paused;
    }

    function buildWood(){
      var aux = new Classes.Producer(this.game, 0, 0, "logo", 1);
      aux.anchor.setTo(0.5, 0.5);
      this.woodGroup.add(aux);
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
          });

          this.coalGroup.forEach(function(prod){
            this.coal += prod.amount;
          });

          this.uraniumGroup.forEach(function(prod){
            this.uranium += prod.amount;
          });

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
          });

          this.houseGroup.forEach(function(prod){
            this.food -= prod.countCitizens * 5;
          });

          this.homelessArray.forEach(function(){
            this.food -= 5;
          });
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
  }
};

module.exports = PlayScene;
