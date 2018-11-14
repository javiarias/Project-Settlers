'use strict';
var Classes = require("./classes.js");

var timeScale = 0;
var currentTime = { "hour": 0, "buffer": 0};
var homelessArray = [];

/////////GROUPS AND RESOURCES
var woodGroup;
var wood = 0;


var PlayScene = {
  create: function () {
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);

    woodGroup = this.game.add.group();

    //Función de inputs
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
        default:
          break;
      }
      currentTime.buffer = 0;
    }
  },

  update: function () {

    currentTime.buffer += timeScale; //incremento del buffer

    if (currentTime.buffer >=3) { //si el buffer supera 3, se ejecuta el bucle de juego. AKA, en velocidad 1 se ejecutará cada 3 bucles, en velocidad 2 cada 2... etc.
      currentTime.buffer = 0;

      currentTime.hour = (currentTime.hour + 1) % 24; //incremento de la hora

      //bucle de update del juego

      woodGroup.forEach(function(prod){
        wood += prod.amount;
      });
      
      console.log(wood);

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
