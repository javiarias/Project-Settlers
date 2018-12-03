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
    this.game.load.image('buildTest', 'images/buildings/building test.png');
    this.game.load.image('Crop Test', 'images/buildings/Crop test.png');
    this.game.load.image('Energy Test', 'images/buildings/Energy test.png');
    this.game.load.image('Hospital Test', 'images/buildings/Hospital test.png');
    this.game.load.image('House Test', 'images/buildings/House test.png');
    this.game.load.image('Mine Test', 'images/buildings/Mine test.png');
    this.game.load.image('Coal Test', 'images/buildings/Coal test.png');
    this.game.load.image('Road Test', 'images/buildings/road test.png');
    this.game.load.image('Road Down Test', 'images/buildings/road down test.png');
    this.game.load.image('Road Left Test', 'images/buildings/road left test.png');
    this.game.load.image('Road Right Test', 'images/buildings/road right test.png');
    this.game.load.image('Road Up Test', 'images/buildings/road up test.png');
    this.game.load.image('Uranium Test', 'images/buildings/Uranium test.png');
    this.game.load.image('Water Test', 'images/buildings/Water test.png');
    this.game.load.image('Wind Test', 'images/buildings/Wind test.png');
    this.game.load.image('Wood Test', 'images/buildings/Wood test.png');


  
    //map 
    this.game.load.tilemap('tilemap', 'images/map/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('patronesTilemap', 'images/map/tileset.png');

    //sounds
    this.game.load.audio('menuSound', ['sounds/menu.mp3', 'sounds/menu.ogg']);
    this.game.load.audio('gameSound', ['sounds/game.mp3', 'sounds/game.ogg']);


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

    function gameStart() {
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
