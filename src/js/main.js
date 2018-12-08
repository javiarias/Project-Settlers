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
