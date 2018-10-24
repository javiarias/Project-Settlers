'use strict';

var timeScale = 0;
var currentTime = { "hour": 0, "buffer": 0};

var PlayScene = {
  create: function () {
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);

    //Función de cambio de velocidad
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

var Tile = {  //mainly for sprite related purposes
  create: function(terrainType, Resource, Contains){ 
    var terrain = terrainType; //integer value. 0 = water, 1 = soil, 2 = purified soil, 3 = mountain/obstacle
    var resource = Resource; //string that defines the resource contained within the tile (if the terrain is water, the resource will be water.
                             //If it's an obstacle, it will be empty)
    var contains = Contains; //string that defines the building on top of that tile
  }
};

//revisar si necesitamos esto
var BiArray = {
  create: function(sizeX){
    var x = [];
    for(var i = 0; i < sizeX; i++)
      x[i] = [];
  },
  get: function(coordX, coordY){
    return x[coordX][coordY];
  },
  set: function(obj, coordX, coordY){
    x[coordX][coordY] = obj;
  }
};

var Map = {
  create: function(size){
    var mapArray = BiArray.create(size);
  }
};

var GameManager = {
  create: function(){

  }
};

var Building = {
/* Splice method to remove two elements starting from position three (zero based index):


var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
array.splice(2,2);
array = [1, 2, 5, 6, 7, 8, 9, 0];*/
};

var House = {};

var Producer = {};

var Cleaner = {};

var Decor = {};

var Citizen = {}; 

module.exports = PlayScene;
