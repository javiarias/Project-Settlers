'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/HERO.png');
    this.game.load.image('test', 'images/Phaser.png');
 
    //this.game.load.tilemap('tilemap', 'images/map/map.json', null, Phaser.Tilemap.TILED_JSON);
    //this.game.load.tilemapTiledJSON('tilemap', 'images/map.json');

    //this.game.load.image('patronesTilemap', 'images/map/tileset.png');

    this.game.load.tilemap('tilemap', 'images/map2/Mapa2.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('patronesTilemap', 'images/map2/Tileset2.png');

  },

  create: function () {
    this.game.state.start('play');

     //asumo que todo esto va aqui
     var map;
     
     this.map = this.game.add.tilemap('tilemap'); //aquí da el error
     this.map.addTilesetImage("patrones","patronesTilemap");
 
     //capas
     this.map.waterLayer = this.map.createStaticLayer ("WaterLayer");
     this.map.groundLayer = this.map.createStaticLayer ("GroundLayer");
     this.map.resourcesLayer = this.map.createStaticLayer ("ResourcesLayer");
     this.map.obstaclesLayer = this.map.createStaticLayer ("ObstaclesLayer");

     this.waterLayer.resizeWorld();
     this.groundLayer.resizeWorld();
     this.resourcesLayer.resizeWorld();
     this.obstaclesLayer.resizeWorld();

     //mapa creado (?)
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
