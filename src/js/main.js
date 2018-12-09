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
    
    this.game.scale.windowConstraints.bottom = 'visual';
    this.game.scale.windowConstraints.right = 'visual';
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'assets/images/HERO.png');
    this.game.load.image('test', 'assets/images/phaser.png');
    this.game.load.image("fade", "assets/images/fade.png");

    //building sprites
    this.game.load.image('Crops', 'assets/images/buildings/Crops.png');
    this.game.load.image('Energy', 'assets/images/buildings/Energy.png');
    this.game.load.image('Hospital', 'assets/images/buildings/Hospital.png');
    this.game.load.image('House', 'assets/images/buildings/House.png');
    this.game.load.image('Stone', 'assets/images/buildings/Stone.png');
    this.game.load.image('Coal', 'assets/images/buildings/Coal.png');
    this.game.load.image('Road', 'assets/images/buildings/road.png');
    this.game.load.image('Road Down', 'assets/images/buildings/road down.png');
    this.game.load.image('Road Left', 'assets/images/buildings/road left.png');
    this.game.load.image('Road Right', 'assets/images/buildings/road right.png');
    this.game.load.image('Road Up', 'assets/images/buildings/road up.png');
    this.game.load.image('Uranium', 'assets/images/buildings/Uranium.png');
    this.game.load.image('Water', 'assets/images/buildings/Water.png');
    this.game.load.image('Wind', 'assets/images/buildings/Wind.png');
    this.game.load.image('Wood', 'assets/images/buildings/Wood.png');


  
    //map 
    this.game.load.tilemap('tilemap', 'assets/images/map/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('patronesTilemap', 'assets/images/map/Tileset.png');

    //sounds
    this.game.load.audio('menuSound', ['assets/sounds/menu.mp3', 'assets/sounds/menu.ogg']);
    this.game.load.audio('gameSound', ['assets/sounds/game.mp3', 'assets/sounds/game.ogg']);

    //menus
    this.game.load.image('pauseBkg', 'assets/images/menu/pauseMenu.png');
    this.game.load.image('optionsBkg', 'assets/images/menu/optionsMenu.png');
    this.game.load.spritesheet('exitBttn', 'assets/images/menu/exit.png', 55, 48);
    this.game.load.spritesheet('minBttn', 'assets/images/menu/minimize.png', 55, 48);
    this.game.load.spritesheet('settBttn', 'assets/images/menu/settings.png', 55, 48);
    this.game.load.spritesheet('plusBttn', 'assets/images/menu/plus.png', 55, 48);
    this.game.load.spritesheet('minusBttn', 'assets/images/menu/minus.png', 55, 48);
    this.game.load.spritesheet('backBttn', 'assets/images/menu/back.png', 55, 48);

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
