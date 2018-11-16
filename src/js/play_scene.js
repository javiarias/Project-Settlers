'use strict';
var Classes = require("./classes.js");


var PlayScene = {
  
  create: function () {

    ////////////////////////////////////////////////////////////////////////////////////////////////
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);

    //misc variables
    var timeScale = 0;
    var currentTime = { "hour": 0, "buffer": 0};
    var homelessArray = [];
    var shiftStart = 8;
    var shiftEnd = 20;

    /////////GROUPS AND RESOURCES
    var houseGroup;
    var food = 0;

    var woodGroup;
    var wood = 0;

    var coalGroup;
    var coal = 0;

    var uraniumGroup;
    var uranium = 0;

    var energyGroup;
    var energy = 0;

    //etc...
    ////////////////////////////////////////////////////////////////////////////////////////////////

    woodGroup = this.game.add.group();
    coalGroup = this.game.add.group();
    uraniumGroup = this.game.add.group();
    //etc...

    //keyboard phaser
    this.game.input.keyboard.onPressCallback = function (e) {
      switch(e) {
        case "1":
          timeScale = 1;
          break;
        case "2":
          timeScale = 2;
          break;
        case "3":
          timeScale = 3;
          break;
        case " ":
          timeScale = 0;
          break;
        case "k":
          var aux = new Classes.Producer(this.game, 0, 0, "logo", 1);
          aux.anchor.setTo(0.5, 0.5);
          woodGroup.add(aux);
          break;

      }
      currentTime.buffer = 0;
    }
  },

  update: function () {

    currentTime.buffer += timeScale; //buffer increment

    if (currentTime.buffer >=3) { //if buffer > 3, update. AKA, speed 1 = every 3 loops, speed 2 = every 2 loops... etc.
      
      //update clock
      currentTime.buffer = 0;

      currentTime.hour = (currentTime.hour + 1) % 24; 
    
      ////////////////////////////////////////
      //update producers
      if(currentTime.hour >= shiftStart && currentTime.hour<= shiftEnd){

        woodGroup.forEach(function(prod){
          wood += prod.amount;
        });

        coalGroup.forEach(function(prod){
          coal += prod.amount;
        });

        uraniumGroup.forEach(function(prod){
          uranium += prod.amount;
        });

        //etc...

        //update consumers
        energyGroup.forEach(function(prod){
          energy += prod.amount;

          switch(prod.consumes){

            case "uranium":
              uranium -= prod.consumed;
              break;

              //other cases for other consumers
          }
        });

        houseGroup.forEach(function(prod){
          food -= prod.countCitizens * 5;
        });

        homelessArray.forEach(function(){
          food -= 5;
        });
      }
      
      ////////////////////////////////////////
      //update citizens

      //----DEBUG----

      //console.log(currentTime.hour); 
      //console.log("DING");
    }
    
    else {
      //----DEBUG----

      //console.log("waiting..."); 
    }
    
  }
};

module.exports = PlayScene;
