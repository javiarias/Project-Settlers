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
    /*this.game.load.image('logo', 'images/HERO.png');
    this.game.load.image('test', 'images/Phaser.png');*/

    
    this.game.load.image("fade", "images/fade.png");
    this.game.load.image("area", "images/area.png");


    //building sprites
    this.game.load.image('Crops', 'images/buildings/Crops.png');
    this.game.load.image('Energy', 'images/buildings/Energy.png');
    this.game.load.image('Hospital', 'images/buildings/Hospital.png');
    this.game.load.image('House', 'images/buildings/House.png');
    this.game.load.image('Stone', 'images/buildings/Stone.png');
    this.game.load.image('Road', 'images/buildings/road.png');
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
    this.game.load.audio('buttonSound', ['audio/button.mp3']);

    //menus
    this.game.load.image('UI', 'images/menu/UI/UI.png');
    this.game.load.image('pausePlay', 'images/menu/UI/pauseMenuPlay.png');
    this.game.load.image('pauseTutorial', 'images/menu/UI/pauseMenuTutorial.png');
    this.game.load.image('mainBkg', 'images/menu/UI/mainBkg.png');
    this.game.load.image('optionsBkg', 'images/menu/UI/optionsMenu.png');

    this.game.load.image('cropIcon', 'images/menu/Icons/cropIcon.png');
    this.game.load.image('stoneIcon', 'images/menu/Icons/stoneIcon.png');
    this.game.load.image('woodIcon', 'images/menu/Icons/woodIcon.png');
    this.game.load.image('energyIcon', 'images/menu/Icons/energyIcon.png');
    this.game.load.image('hospitalIcon', 'images/menu/Icons/hospitalIcon.png');
    this.game.load.image('uraniumIcon', 'images/menu/Icons/uraniumIcon.png');
    this.game.load.image('waterIcon', 'images/menu/Icons/waterIcon.png');
    this.game.load.image('citizenIcon', 'images/menu/Icons/citizenIcon.png');
    this.game.load.image('noHouseIcon', 'images/menu/Icons/noHouseIcon.png');
    this.game.load.image('joblessIcon', 'images/menu/Icons/joblessIcon.png');

    this.game.load.spritesheet('exitBttn', 'images/menu/MenuButtons/exit.png', 55, 48);
    this.game.load.spritesheet('minBttn', 'images/menu/MenuButtons/minimize.png', 55, 48);
    this.game.load.spritesheet('settBttn', 'images/menu/MenuButtons/settings.png', 55, 48);
    this.game.load.spritesheet('plusBttn', 'images/menu/MenuButtons/plus.png', 55, 48);
    this.game.load.spritesheet('minusBttn', 'images/menu/MenuButtons/minus.png', 55, 48);
    this.game.load.spritesheet('backBttn', 'images/menu/MenuButtons/back.png', 55, 48);
    this.game.load.spritesheet('muteBttn', 'images/menu/MenuButtons/mute.png', 55, 48);
    this.game.load.spritesheet('playBttn', 'images/menu/MenuButtons/play.png', 55, 48);
    this.game.load.spritesheet('tutorialBttn', 'images/menu/MenuButtons/tuto.png', 55, 48);
    this.game.load.spritesheet('saveBttn', 'images/menu/MenuButtons/save.png', 55, 48);

    this.game.load.spritesheet('houseBttn', 'images/menu/UIButtons/house.png', 55, 48);
    this.game.load.spritesheet('roadBttn', 'images/menu/UIButtons/road.png', 55, 48);
    this.game.load.spritesheet('waterBttn', 'images/menu/UIButtons/water.png', 55, 48);
    this.game.load.spritesheet('cropBttn', 'images/menu/UIButtons/crop.png', 55, 48);
    this.game.load.spritesheet('woodBttn', 'images/menu/UIButtons/wood.png', 55, 48);
    this.game.load.spritesheet('stoneBttn', 'images/menu/UIButtons/stone.png', 55, 48);
    this.game.load.spritesheet('uraniumBttn', 'images/menu/UIButtons/uranium.png', 55, 48);
    this.game.load.spritesheet('windBttn', 'images/menu/UIButtons/wind.png', 55, 48);
    this.game.load.spritesheet('energyBttn', 'images/menu/UIButtons/energy.png', 55, 48);
    this.game.load.spritesheet('hospitalBttn', 'images/menu/UIButtons/hospital.png', 55, 48);
    this.game.load.spritesheet('bulldozeBttn', 'images/menu/UIButtons/bulldoze.png', 55, 48);
  },

  create: function () {
    this.game.state.start('main');
  }
};

var wfconfig = {
  active: function() { 
      console.log("font loaded");
  },

  custom: {
      families: ['console'],
      urls: ["fonts.css"]
  }
};


var MainMenu = {

  create: function(){
    
    this.buttonSound = this.game.add.audio('buttonSound');

    this.background = this.game.add.sprite(0, 0, "mainBkg");
    this.background.smoothed = false;

    this.txt = this.game.add.text(this.game.camera.x + (this.game.width/2), this.game.camera.y + (this.game.height/5), "Project Settlers \n BETA!!", {font: "console", fontSize: 60, fill: "#000000", align: "center" });
    this.txt.anchor.setTo(0.5, 0.5);
    this.txt.smoothed = false;

    this.load = this.game.add.button(this.game.camera.x + this.game.width/2, this.game.camera.y + (this.game.height/1.8), 'saveBttn', gameLoad, this, 0, 0, 1);
    this.load.anchor.setTo(0.5, 0.5);
    this.load.scale.setTo(3, 3);
    this.load.smoothed = false;
    this.load.onDownSound = this.buttonSound;

    this.loadtxt = this.game.add.text(this.load.x, this.load.y + this.game.height/6, "Load", {font: "console", fontSize: 50, fill: "#000000", align: "center" });
    this.loadtxt.anchor.setTo(0.5, 0.5);
    this.loadtxt.smoothed = false;

    this.play = this.game.add.button(this.load.left - 100, this.load.y, 'playBttn', gameStart, this, 0, 0, 1);
    this.play.anchor.setTo(0.5, 0.5);
    this.play.scale.setTo(3, 3);
    this.play.smoothed = false;
    this.play.onDownSound = this.buttonSound;

    this.playtxt = this.game.add.text(this.play.x, this.play.y + this.game.height/6, "Play", {font: "console", fontSize: 50, fill: "#000000", align: "center" });
    this.playtxt.anchor.setTo(0.5, 0.5);
    this.playtxt.smoothed = false;

    this.tutorial = this.game.add.button(this.load.right + 100, this.load.y, 'tutorialBttn', tutorialStart, this, 0, 0, 1);
    this.tutorial.anchor.setTo(0.5, 0.5);
    this.tutorial.scale.setTo(3, 3);
    this.tutorial.smoothed = false;
    this.tutorial.onDownSound = this.buttonSound;

    this.tutorialtxt = this.game.add.text(this.tutorial.x, this.tutorial.y + this.game.height/6, "Tutorial", {font: "console", fontSize: 50, fill: "#000000", align: "center" });
    this.tutorialtxt.anchor.setTo(0.5, 0.5);
    this.tutorialtxt.smoothed = false;

    this.volume = 20;

    this.menuMusic = this.game.add.sound('menuSound', 1, true);
    this.menuMusic.play();
    this.menuMusic.volume = this.volume / 100;

    this.options = this.game.add.button(this.game.camera.x + (this.game.width/2), this.game.camera.y + 3.55 * (this.game.height/4), "settBttn", function(){this.optionsMain.visible = true; this.game.world.bringToTop(this.optionsMain); this.play.inputEnabled = false; this.options.inputEnabled = false;}, this, 0, 0, 1);
    this.options.anchor.setTo(.5, .5);
    this.options.smoothed = false;
    this.options.onDownSound = this.buttonSound;


    //volume menu
    this.optionsMain = this.game.add.group();

    var optionsBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "optionsBkg");
    optionsBkg.anchor.setTo(.5, .5);
    optionsBkg.fixedToCamera = true;
    optionsBkg.smoothed = false;

    this.optionsMain.add(optionsBkg);

    var volumeText = this.game.add.text(optionsBkg.x, optionsBkg.y - 20, this.volume, {font: "50px console"});
    volumeText.anchor.setTo(0.5, 0.5);
    volumeText.fixedToCamera = true;
    volumeText.smoothed = false;

    this.optionsMain.add(volumeText);

    var optionsMinus = this.game.add.button(optionsBkg.x - 77, optionsBkg.y - 20, "minusBttn", function(){updateVolume.call(this, -5);}, this, 0, 0, 1);
    optionsMinus.anchor.setTo(0.5, 0.5);
    optionsMinus.fixedToCamera = true;
    optionsMinus.smoothed = false;
    optionsMinus.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsMinus);
    
    var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){updateVolume.call(this, 5);}, this, 0, 0, 1);
    optionsPlus.anchor.setTo(0.5, 0.5);
    optionsPlus.fixedToCamera = true;
    optionsPlus.smoothed = false;
    optionsPlus.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsPlus);

    var optionsBack = this.game.add.button(optionsBkg.x - 47, optionsBkg.y + 48, "backBttn", function(){this.optionsMain.visible = false; this.play.inputEnabled = true; this.options.inputEnabled = true;}, this, 0, 0, 1);
    optionsBack.anchor.setTo(0.5, 0.5);
    optionsBack.fixedToCamera = true;
    optionsBack.smoothed = false;
    optionsBack.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsBack);

    var optionsMute = this.game.add.button(optionsBkg.x + 47, optionsBkg.y + 48, "muteBttn", function(){mute.call(this);}, this, 0, 0, 1);
    if(this.game.sound.mute)
      optionsMute.setFrames(2, 2, 3);
    optionsMute.anchor.setTo(0.5, 0.5);
    optionsMute.fixedToCamera = true;
    optionsMute.smoothed = false;
    optionsMute.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsMute);

    this.optionsMain.visible = false;

    function updateVolume(update){
      if(this.volume + update >= 0 && this.volume + update <= 100){

        this.volume += update;
        this.menuMusic.volume = this.volume / 100;

        this.optionsMain.forEach(function(text){
          if (text.text !== null)
            text.text = this.volume;
          }, this);
      }
    }

    function mute(){
      this.game.sound.mute = !this.game.sound.mute;
      this.optionsMain.forEach(function(button){
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
      this.optionsMain.destroy();
      this.game.state.start('play', true, false, 0, false);
    }

    function tutorialStart() {
      this.menuMusic.stop();
      this.optionsMain.destroy();
      this.game.state.start('tutorial', true, false, 1, false);
    }

    function gameLoad() {
      var state = localStorage.getItem('save');
      if (state) {
        this.game = JSON.parse(state);
        this.menuMusic.stop();
        this.optionsMain.destroy();
        this.game.state.start('play', true, false, 1, true);
      }
    }

    function clearSave() {
      localStorage.removeItem("save");
    }
  }
};

var DefeatState = {
  create: function(){
    this.buttonSound = this.game.add.audio('buttonSound');
    
    this.volume = 20;
    this.menuMusic = this.game.add.sound('menuSound', .2, true);
    this.menuMusic.play();
    this.menuMusic.volume = this.volume / 100;

    this.background = this.game.add.sprite(0, 0, "mainBkg");
    this.background.smoothed = false;

    this.play = this.game.add.button(this.game.camera.x + (this.game.width/2 - 100), this.game.camera.y + (this.game.height/1.8), 'playBttn', gameStart, this, 0, 0, 1);
    this.play.anchor.setTo(0.5, 0.5);
    this.play.scale.setTo(3, 3);
    this.play.smoothed = false;
    this.play.onDownSound = this.buttonSound;

    this.playtxt = this.game.add.text(this.play.x, this.play.y + this.game.height/6, "Play Again", {font: "console", fontSize: 40, fill: "#ffffff", align: "center" });
    this.playtxt.anchor.setTo(0.5, 0.5);
    this.playtxt.smoothed = false;

    this.menu = this.game.add.button(this.game.camera.x + (this.game.width/2 + 100), this.game.camera.y + (this.game.height/1.8), 'backBttn', goMenu, this, 0, 0, 1);
    this.menu.anchor.setTo(0.5, 0.5);
    this.menu.scale.setTo(3, 3);
    this.menu.smoothed = false;
    this.menu.onDownSound = this.buttonSound;

    this.menutxt = this.game.add.text(this.menu.x, this.menu.y + this.game.height/6, "Main Menu", {font: "console", fontSize: 40, fill: "#ffffff", align: "center" });
    this.menutxt.anchor.setTo(0.5, 0.5);
    this.menutxt.smoothed = false;

    this.txt = this.game.add.text(this.game.camera.x + (this.game.width/2), this.game.camera.y + (this.game.height/5), "All your citizens have died,\n you lost the game", {font: "console", fontSize: 60, fill: "#ffffff", align: "center" });
    this.txt.anchor.setTo(0.5, 0.5);
    this.txt.smoothed = false;

    this.options = this.game.add.button(this.game.camera.x + (this.game.width/2), this.game.camera.y + 3.55 * (this.game.height/4), "settBttn", function(){this.optionsMain.visible = true; this.game.world.bringToTop(this.optionsMain); this.play.inputEnabled = false; this.options.inputEnabled = false;}, this, 0, 0, 1);
    this.options.anchor.setTo(.5, .5);
    this.options.smoothed = false;
    this.options.onDownSound = this.buttonSound;
    
    this.optionsMain = this.game.add.group();

    var optionsBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "optionsBkg");
    optionsBkg.anchor.setTo(.5, .5);
    optionsBkg.fixedToCamera = true;
    optionsBkg.smoothed = false;

    this.optionsMain.add(optionsBkg);

    var volumeText = this.game.add.text(optionsBkg.x, optionsBkg.y - 20, this.volume, {font: "50px console"});
    volumeText.anchor.setTo(0.5, 0.5);
    volumeText.fixedToCamera = true;
    volumeText.smoothed = false;

    this.optionsMain.add(volumeText);

    var optionsMinus = this.game.add.button(optionsBkg.x - 77, optionsBkg.y - 20, "minusBttn", function(){updateVolume.call(this, -5);}, this, 0, 0, 1);
    optionsMinus.anchor.setTo(0.5, 0.5);
    optionsMinus.fixedToCamera = true;
    optionsMinus.smoothed = false;
    optionsMinus.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsMinus);
    
    var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){updateVolume.call(this, 5);}, this, 0, 0, 1);
    optionsPlus.anchor.setTo(0.5, 0.5);
    optionsPlus.fixedToCamera = true;
    optionsPlus.smoothed = false;
    optionsPlus.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsPlus);

    var optionsBack = this.game.add.button(optionsBkg.x - 47, optionsBkg.y + 48, "backBttn", function(){this.optionsMain.visible = false; this.play.inputEnabled = true; this.options.inputEnabled = true;}, this, 0, 0, 1);
    optionsBack.anchor.setTo(0.5, 0.5);
    optionsBack.fixedToCamera = true;
    optionsBack.smoothed = false;
    optionsBack.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsBack);

    var optionsMute = this.game.add.button(optionsBkg.x + 47, optionsBkg.y + 48, "muteBttn", function(){mute.call(this);}, this, 0, 0, 1);
    if(this.game.sound.mute)
      optionsMute.setFrames(2, 2, 3);
    optionsMute.anchor.setTo(0.5, 0.5);
    optionsMute.fixedToCamera = true;
    optionsMute.smoothed = false;
    optionsMute.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsMute);

    this.optionsMain.visible = false;

    function updateVolume(update){
      if(this.volume + update >= 0 && this.volume + update <= 100){

        this.volume += update;
        this.menuMusic.volume = this.volume / 100;

        this.optionsMain.forEach(function(text){
          if (text.text !== null)
            text.text = this.volume;
          }, this);
      }
    }

    function mute(){
      this.game.sound.mute = !this.game.sound.mute;
      this.optionsMain.forEach(function(button){
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
      this.optionsMain.destroy();
      this.game.state.start('play', true, false, 0, false);
    }

    function goMenu() {
      this.menuMusic.stop();
      this.optionsMain.destroy();
      this.game.state.start('main');
    }
  }
};

var WinState = {
  create: function(){
    this.buttonSound = this.game.add.audio('buttonSound');
    
    this.volume = 20;
    this.menuMusic = this.game.add.sound('menuSound', .2, true);
    this.menuMusic.play();
    this.menuMusic.volume = this.volume / 100;

    this.background = this.game.add.sprite(0, 0, "mainBkg");
    this.background.smoothed = false;

    this.play = this.game.add.button(this.game.camera.x + (this.game.width/2 - 100), this.game.camera.y + (this.game.height/1.8), 'playBttn', gameStart, this, 0, 0, 1);
    this.play.anchor.setTo(0.5, 0.5);
    this.play.scale.setTo(3, 3);
    this.play.smoothed = false;
    this.play.onDownSound = this.buttonSound;

    this.playtxt = this.game.add.text(this.play.x, this.play.y + this.game.height/6, "Play Again", {font: "console", fontSize: 40, fill: "#ffffff", align: "center" });
    this.playtxt.anchor.setTo(0.5, 0.5);
    this.playtxt.smoothed = false;

    this.menu = this.game.add.button(this.game.camera.x + (this.game.width/2 + 100), this.game.camera.y + (this.game.height/1.8), 'backBttn', goMenu, this, 0, 0, 1);
    this.menu.anchor.setTo(0.5, 0.5);
    this.menu.scale.setTo(3, 3);
    this.menu.smoothed = false;
    this.menu.onDownSound = this.buttonSound;

    this.menutxt = this.game.add.text(this.menu.x, this.menu.y + this.game.height/6, "Main Menu", {font: "console", fontSize: 40, fill: "#ffffff", align: "center" });
    this.menutxt.anchor.setTo(0.5, 0.5);
    this.menutxt.smoothed = false;

    this.txt = this.game.add.text(this.game.camera.x + (this.game.width/2), this.game.camera.y + (this.game.height/5), "Congratulations,\n you won the game", {font: "console", fontSize: 60, fill: "#ffffff", align: "center" });
    this.txt.anchor.setTo(0.5, 0.5);
    this.txt.smoothed = false;

    this.options = this.game.add.button(this.game.camera.x + (this.game.width/2), this.game.camera.y + 3.55 * (this.game.height/4), "settBttn", function(){this.optionsMain.visible = true; this.game.world.bringToTop(this.optionsMain); this.play.inputEnabled = false; this.options.inputEnabled = false;}, this, 0, 0, 1);
    this.options.anchor.setTo(.5, .5);
    this.options.smoothed = false;
    this.options.onDownSound = this.buttonSound;
    
    this.optionsMain = this.game.add.group();

    var optionsBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "optionsBkg");
    optionsBkg.anchor.setTo(.5, .5);
    optionsBkg.fixedToCamera = true;
    optionsBkg.smoothed = false;

    this.optionsMain.add(optionsBkg);

    var volumeText = this.game.add.text(optionsBkg.x, optionsBkg.y - 20, this.volume, {font: "50px console"});
    volumeText.anchor.setTo(0.5, 0.5);
    volumeText.fixedToCamera = true;
    volumeText.smoothed = false;

    this.optionsMain.add(volumeText);

    var optionsMinus = this.game.add.button(optionsBkg.x - 77, optionsBkg.y - 20, "minusBttn", function(){updateVolume.call(this, -5);}, this, 0, 0, 1);
    optionsMinus.anchor.setTo(0.5, 0.5);
    optionsMinus.fixedToCamera = true;
    optionsMinus.smoothed = false;
    optionsMinus.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsMinus);
    
    var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){updateVolume.call(this, 5);}, this, 0, 0, 1);
    optionsPlus.anchor.setTo(0.5, 0.5);
    optionsPlus.fixedToCamera = true;
    optionsPlus.smoothed = false;
    optionsPlus.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsPlus);

    var optionsBack = this.game.add.button(optionsBkg.x - 47, optionsBkg.y + 48, "backBttn", function(){this.optionsMain.visible = false; this.play.inputEnabled = true; this.options.inputEnabled = true;}, this, 0, 0, 1);
    optionsBack.anchor.setTo(0.5, 0.5);
    optionsBack.fixedToCamera = true;
    optionsBack.smoothed = false;
    optionsBack.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsBack);

    var optionsMute = this.game.add.button(optionsBkg.x + 47, optionsBkg.y + 48, "muteBttn", function(){mute.call(this);}, this, 0, 0, 1);
    if(this.game.sound.mute)
      optionsMute.setFrames(2, 2, 3);
    optionsMute.anchor.setTo(0.5, 0.5);
    optionsMute.fixedToCamera = true;
    optionsMute.smoothed = false;
    optionsMute.onDownSound = this.buttonSound;

    this.optionsMain.add(optionsMute);

    this.optionsMain.visible = false;

    function updateVolume(update){
      if(this.volume + update >= 0 && this.volume + update <= 100){

        this.volume += update;
        this.menuMusic.volume = this.volume / 100;

        this.optionsMain.forEach(function(text){
          if (text.text !== null)
            text.text = this.volume;
          }, this);
      }
    }

    function mute(){
      this.game.sound.mute = !this.game.sound.mute;
      this.optionsMain.forEach(function(button){
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
      this.optionsMain.destroy();
      this.game.state.start('play', true, false, 0, false);
    }

    function goMenu() {
      this.menuMusic.stop();
      this.optionsMain.destroy();
      this.game.state.start('main');
    }
  }

};

window.onload = function () {

  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  WebFont.load(wfconfig);

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('main', MainMenu);
  game.state.add('tutorial', PlayScene);
  game.state.add('play', PlayScene);
  game.state.add('defeat', DefeatState);
  game.state.add('win', WinState);

  game.state.start('boot');
};
