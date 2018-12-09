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
    this.game.load.audio('menuSound', ['audio/menu.mp3', 'audio/menu.ogg']);
    this.game.load.audio('gameSound', ['audio/game.mp3', 'audio/game.ogg']);

    //menus
    this.game.load.image('pauseBkg', 'images/menu/pauseMenu.png');
    this.game.load.image('mainBkg', 'images/menu/mainBkg.png');
    this.game.load.image('optionsBkg', 'images/menu/optionsMenu.png');
    this.game.load.spritesheet('exitBttn', 'images/menu/exit.png', 55, 48);
    this.game.load.spritesheet('minBttn', 'images/menu/minimize.png', 55, 48);
    this.game.load.spritesheet('settBttn', 'images/menu/settings.png', 55, 48);
    this.game.load.spritesheet('plusBttn', 'images/menu/plus.png', 55, 48);
    this.game.load.spritesheet('minusBttn', 'images/menu/minus.png', 55, 48);
    this.game.load.spritesheet('backBttn', 'images/menu/back.png', 55, 48);
    this.game.load.spritesheet('muteBttn', 'images/menu/mute.png', 55, 48);
    this.game.load.spritesheet('playBttn', 'images/menu/play.png', 55, 48);

  },

  create: function () {
    this.game.state.start('main');
  }
};

var MainMenu = {
  create: function(){
    this.background = this.game.add.sprite(0, 0, "mainBkg");
    this.background.smoothed = false;

    this.txt = this.game.add.text(this.game.camera.x + (this.game.width/2), this.game.camera.y + (this.game.height/5), "Project Settlers \n BETA!!", {font: "30px Arial", fill: "#ffffff", align: "center" });
    this.txt.anchor.setTo(0.5, 0.5);
    this.txt.smoothed = false;

    this.play = this.game.add.button(this.game.camera.x + (this.game.width/2), this.game.camera.y + 2 * (this.game.height/4), 'playBttn', gameStart, this, 0, 0, 1);
    this.play.anchor.setTo(0.5, 0.5);
    this.play.scale.setTo(4, 4);
    this.play.smoothed = false;

    this.volume = 20;

    this.menuMusic = this.game.add.sound('menuSound');
    this.menuMusic.play();
    this.menuMusic.loop = true;
    this.menuMusic.volume = this.volume / 100;

    this.options = this.game.add.button(this.game.camera.x + (this.game.width/2), this.game.camera.y + 3.5 * (this.game.height/4), "settBttn", function(){this.optionsMenu.visible = true; this.game.world.bringToTop(this.optionsMenu); this.play.inputEnabled = false; this.options.inputEnabled = false;}, this, 0, 0, 1);
    this.options.anchor.setTo(.5, .5);
    this.options.smoothed = false;


    //volume menu
    this.optionsMenu = this.game.add.group();

    var optionsBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "optionsBkg");
    optionsBkg.anchor.setTo(.5, .5);
    optionsBkg.fixedToCamera = true;
    optionsBkg.smoothed = false;

    this.optionsMenu.add(optionsBkg);

    var volumeText = this.game.add.text(optionsBkg.x, optionsBkg.y - 20, this.volume);
    volumeText.anchor.setTo(0.5, 0.5);
    volumeText.fixedToCamera = true;
    volumeText.smoothed = false;

    this.optionsMenu.add(volumeText);

    var optionsMinus = this.game.add.button(optionsBkg.x - 77, optionsBkg.y - 20, "minusBttn", function(){updateVolume.call(this, -5);}, this, 0, 0, 1);
    optionsMinus.anchor.setTo(0.5, 0.5);
    optionsMinus.fixedToCamera = true;
    optionsMinus.smoothed = false;

    this.optionsMenu.add(optionsMinus);
    
    var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){updateVolume.call(this, 5);}, this, 0, 0, 1);
    optionsPlus.anchor.setTo(0.5, 0.5);
    optionsPlus.fixedToCamera = true;
    optionsPlus.smoothed = false;

    this.optionsMenu.add(optionsPlus);

    var optionsBack = this.game.add.button(optionsBkg.x - 47, optionsBkg.y + 48, "backBttn", function(){this.optionsMenu.visible = false; this.play.inputEnabled = true; this.options.inputEnabled = true;}, this, 0, 0, 1);
    optionsBack.anchor.setTo(0.5, 0.5);
    optionsBack.fixedToCamera = true;
    optionsBack.smoothed = false;

    this.optionsMenu.add(optionsBack);

    var optionsMute = this.game.add.button(optionsBkg.x + 47, optionsBkg.y + 48, "muteBttn", function(){mute.call(this);}, this, 0, 0, 1);
    if(this.game.sound.mute)
      optionsMute.setFrames(2, 2, 3);
    optionsMute.anchor.setTo(0.5, 0.5);
    optionsMute.fixedToCamera = true;
    optionsMute.smoothed = false;

    this.optionsMenu.add(optionsMute);


    this.optionsMenu.visible = false;

    function updateVolume(update){
      if(this.volume + update >= 0 && this.volume + update <= 100){

        this.volume += update;
        this.menuMusic.volume = this.volume / 100;

        this.optionsMenu.forEach(function(text){
          if (text.text !== null)
            text.text = this.volume;
          }, this);
      }
    }

    function mute(){
      this.game.sound.mute = !this.game.sound.mute;
      this.optionsMenu.forEach(function(button){
        if(button.key == "muteBttn"){
          if(this.game.sound.mute)
            button.setFrames(2, 2, 3);
          else
            button.setFrames(0, 0, 1);
        }
      }, this);
    }

    function gameStart() {
      this.menuMusic.stop();
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
