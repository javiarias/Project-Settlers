'use strict';
var Classes = require("./buildings.js");
var Phasetips = require("./Phasetips.js");

var PlayScene = {

  init: function(data)
  {
    this.mode = data;
  },

  create: function () {

    //////////////////////////////
    //Modes (tutorial/main game)

    if (this.mode == 0)
      console.log('Game');

    if (this.mode == 1)
      console.log('Tutorial');

    //////////////////////////////
    //Tilemap

      this.map = this.game.add.tilemap('tilemap'); 
      this.map.addTilesetImage("Tileset","patronesTilemap");

      //layers
      this.map.waterLayer = this.map.createLayer ("water");

      this.map.groundLayer = this.map.createLayer ("soil");
      this.map.resourcesLayer = this.map.createLayer ("resources");
      this.map.obstaclesLayer = this.map.createLayer ("obstacles");

      this.map.waterLayer.resizeWorld();


    //////////////////////////////
    //music

      this.volume = 50;

      this.gameMusic = this.game.add.audio('gameSound', 1, true); 
      this.buttonSound = this.game.add.audio('buttonSound');

      this.gameMusic.play();
      this.gameMusic.volume = this.volume / 100;

      this.paused = true;
      this.timeScale = 1;
      this.currentTime = { "hour": 0, "buffer": 0};
      this.homelessArray = [];
      this.unemployedArray = [];
      this.shiftStart = 9;
      this.shiftEnd = 17;
      this._tileSize = this.map.tileWidth;
      this._buildModeActive = false;
      this._destroyModeActive = false;
      this._escapeMenu = false;
      this.fade;

      this._buildingModeSprite;
      this._buildingModeType = "";
      this._buildingModeArea;

    //////////////////////////////
    //Resources
      if (this.mode == 0){
        this.food = 100;
        this.wood = 75;
        this.uranium = 0;
        this.energy = 0;
        this.water = 50;
        this.stone = 75;
      }

      else if (this.mode == 1){
        this.food = 100;
        this.wood = 200;
        this.uranium = 0;
        this.energy = 0;
        this.water = 0;
        this.stone = 200;
      }

      this.foodGain = 0;
      this.woodGain = 0;
      this.uraniumGain = 0;
      this.energyGain = 0;
      this.waterGain = 0;
      this.stoneGain = 0;

    //////////////////////////////
    //Groups

      this.buildingGroup = this.game.add.group();

      this.houseGroup = this.game.add.group();
      this.houseGroup.sprite = 'House';
      this.buildingGroup.add(this.houseGroup);
      this.houseGroup.stone = 5;
      this.houseGroup.wood = 5;

      this.waterGroup = this.game.add.group();
      this.buildingGroup.add(this.waterGroup);
      this.waterGroup.sprite = 'Water';
      this.waterGroup.stone = 10;
      this.waterGroup.wood = 10;
      this.waterGroup.consume = 1;
      this.waterGroup.produce = 1;

      this.cropGroup = this.game.add.group();
      this.buildingGroup.add(this.cropGroup);
      this.cropGroup.sprite = 'Crops';
      this.cropGroup.stone = 10;
      this.cropGroup.wood = 10;
      this.cropGroup.consume = 1;
      this.cropGroup.produce = 1;

      this.woodGroup = this.game.add.group();
      this.buildingGroup.add(this.woodGroup);
      this.woodGroup.sprite = 'Wood';
      this.woodGroup.stone = 10;
      this.woodGroup.wood = 5;
      this.woodGroup.consume = 3;
      this.woodGroup.produce = 1;

      this.uraniumGroup = this.game.add.group();
      this.buildingGroup.add(this.uraniumGroup);
      this.uraniumGroup.sprite = 'Uranium';
      this.uraniumGroup.stone = 30;
      this.uraniumGroup.wood = 30;
      this.uraniumGroup.consume = 3;
      this.uraniumGroup.produce = 1;

      this.energyGroup = this.game.add.group();
      this.buildingGroup.add(this.energyGroup);
      this.energyGroup.sprite = 'Energy';
      this.energyGroup.stone = 45;
      this.energyGroup.wood = 30;
      this.energyGroup.consume = 2;
      this.energyGroup.produce = 45;

      this.windGroup = this.game.add.group();
      this.buildingGroup.add(this.windGroup);
      this.windGroup.sprite = 'Wind';
      this.windGroup.stone = 35;
      this.windGroup.wood = 30;
      this.windGroup.produce = 2;

      this.roadGroup = this.game.add.group();
      this.buildingGroup.add(this.roadGroup);
      this.roadGroup.sprite = 'Road';
      this.roadGroup.stone = 1;
      this.roadGroup.wood = 0;

      this.hospitalGroup = this.game.add.group();
      this.buildingGroup.add(this.hospitalGroup);
      this.hospitalGroup.sprite = 'Hospital';
      this.hospitalGroup.stone = 25;
      this.hospitalGroup.wood = 25;
      this.hospitalGroup.consume = 4;

      this.stoneGroup = this.game.add.group();
      this.buildingGroup.add(this.stoneGroup);
      this.stoneGroup.sprite = 'Stone';
      this.stoneGroup.stone = 15;
      this.stoneGroup.wood = 15;
      this.stoneGroup.consume = 3;
      this.stoneGroup.produce = 1;


    //////////////////////////////
    //pause menu
      this.pauseMenu = this.game.add.group();

      if (this.mode == 0)
        var pauseBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "pausePlay");

      else if (this.mode == 1)
        var pauseBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "pauseTutorial");

      pauseBkg.anchor.setTo(.5, .5);
      pauseBkg.fixedToCamera = true;
      pauseBkg.smoothed = false;
      this.pauseMenu.add(pauseBkg);

      var pauseSettings = this.game.add.button(pauseBkg.x - 72, pauseBkg.y + 3, "settBttn", function(){this.optionsMenu.visible = true; this.pauseMenu.visible = false; this.game.world.bringToTop(this.optionsMenu);}, this, 0, 0, 1);
      pauseSettings.anchor.setTo(0.5, 0.5);
      pauseSettings.fixedToCamera = true;
      pauseSettings.smoothed = false;
      pauseSettings.onDownSound = this.buttonSound;
      this.pauseMenu.add(pauseSettings);

      var pauseMinimize = this.game.add.button(pauseBkg.x, pauseBkg.y + 3, "minBttn", escape, this, 0, 0, 1);
      pauseMinimize.anchor.setTo(0.5, 0.5);
      pauseMinimize.fixedToCamera = true;
      pauseMinimize.smoothed = false;
      pauseMinimize.onDownSound = this.buttonSound;
      this.pauseMenu.add(pauseMinimize);

      if (this.mode == 0)
      {
      var saveBttn = this.game.add.button(pauseBkg.x + 72, pauseBkg.y + 3, "saveBttn", function(){this.saveGame();this.gameMusic.stop();this.game.state.start('main');}, this, 0, 0, 1);
      saveBttn.anchor.setTo(0.5, 0.5);
      saveBttn.fixedToCamera = true;
      saveBttn.smoothed = false;
      saveBttn.onDownSound = this.buttonSound;
      this.pauseMenu.add(saveBttn);
      }

      else if (this.mode == 1)
      {
      var pauseExit = this.game.add.button(pauseBkg.x + 72, pauseBkg.y + 3, "exitBttn", function(){this.gameMusic.stop();this.game.state.start('main');}, this, 0, 0, 1);
      pauseExit.anchor.setTo(0.5, 0.5);
      pauseExit.fixedToCamera = true;
      pauseExit.smoothed = false;
      pauseExit.onDownSound = this.buttonSound;
      this.pauseMenu.add(pauseExit);
      }

      this.pauseMenu.visible = false;

    //////////////////////////////
    //volume menu
      this.optionsMenu = this.game.add.group();

      var optionsBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "optionsBkg");
      optionsBkg.anchor.setTo(.5, .5);
      optionsBkg.fixedToCamera = true;
      optionsBkg.smoothed = false;
      this.optionsMenu.add(optionsBkg);

      var volumeText = this.game.add.text(optionsBkg.x, optionsBkg.y - 20, this.volume, {font: "50px console"});
      volumeText.anchor.setTo(0.5, 0.5);
      volumeText.fixedToCamera = true;
      volumeText.smoothed = false;
      this.optionsMenu.add(volumeText);

      var optionsMinus = this.game.add.button(optionsBkg.x - 77, optionsBkg.y - 20, "minusBttn", function(){updateVolume.call(this, -5);}, this, 0, 0, 1);
      optionsMinus.anchor.setTo(0.5, 0.5);
      optionsMinus.fixedToCamera = true;
      optionsMinus.smoothed = false;
      optionsMinus.onDownSound = this.buttonSound;
      this.optionsMenu.add(optionsMinus);
      
      var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){updateVolume.call(this, 5);}, this, 0, 0, 1);
      optionsPlus.anchor.setTo(0.5, 0.5);
      optionsPlus.fixedToCamera = true;
      optionsPlus.smoothed = false;
      optionsPlus.onDownSound = this.buttonSound;
      this.optionsMenu.add(optionsPlus);

      var optionsBack = this.game.add.button(optionsBkg.x - 47, optionsBkg.y + 48, "backBttn", function(){this.optionsMenu.visible = false; this.pauseMenu.visible = true; this.game.world.bringToTop(this.pauseMenu);}, this, 0, 0, 1);
      optionsBack.anchor.setTo(0.5, 0.5);
      optionsBack.fixedToCamera = true;
      optionsBack.smoothed = false;
      optionsBack.onDownSound = this.buttonSound;
      this.optionsMenu.add(optionsBack);

      var optionsMute = this.game.add.button(optionsBkg.x + 47, optionsBkg.y + 48, "muteBttn", function(){mute.call(this);}, this, 0, 0, 1);
      if(this.game.sound.mute)
        optionsMute.setFrames(2, 2, 3);
      optionsMute.anchor.setTo(0.5, 0.5);
      optionsMute.fixedToCamera = true;
      optionsMute.smoothed = false;
      optionsMute.onDownSound = this.buttonSound;
      this.optionsMenu.add(optionsMute);

      this.optionsMenu.visible = false;

      function updateVolume(update){
        if(this.volume + update >= 0 && this.volume + update <= 100){

          this.volume += update;
          this.gameMusic.volume = this.volume / 100;

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


    //////////////////////////////
    //UI elements

      this.UI = this.game.add.group();

      this.UIBkg = this.game.add.sprite(0, 0, "UI");
      this.UIBkg.fixedToCamera = true;
      this.UIBkg.smoothed = false;

      this.UI.add(this.UIBkg);

    //////////////////////////////
    //UI buttons

      var escapeBttn = this.game.add.button(this.UIBkg.right - 5, 5, "exitBttn", function(){escape.call(this);}, this, 0, 0, 1);
      escapeBttn.anchor.setTo(1, 0);
      escapeBttn.fixedToCamera = true;
      escapeBttn.smoothed = false;
      escapeBttn.scale.setTo(0.7, 0.7);
      escapeBttn.onDownSound = this.buttonSound;
      this.UI.add(escapeBttn);

      var numberOfButtons = 11;
      var buttonX = 55;
      var buttonLimit = 637;
      var scale = 1;
      if(buttonLimit < 60 * numberOfButtons)
        scale = buttonLimit / ((buttonX + 5) * numberOfButtons);

      var buttonOffset = buttonLimit / numberOfButtons - (buttonX * scale) + (buttonX * scale)/2; // 11 = número de botones, 55 = tamaño x del botón
      

      this.roadBttn = this.game.add.button(5 + buttonOffset - (buttonOffset - (55 * scale)/2)/2, this.UIBkg.bottom - 30, "roadBttn", function(){buildMode.call(this, this, this.roadGroup);}, this, 0, 0, 1);
      this.roadBttn.anchor.setTo(.5, .5);
      this.roadBttn.fixedToCamera = true;
      this.roadBttn.smoothed = false;
      this.roadBttn.scale.setTo(scale, scale);
      this.roadBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.roadBttn.visible = false;
        this.roadBttn.input.enabled = false;
      }
      this.UI.add(this.roadBttn);

      this.houseBttn = this.game.add.button(this.roadBttn.right + buttonOffset, this.roadBttn.centerY, "houseBttn", function(){buildMode.call(this, this, this.houseGroup);}, this, 0, 0, 1);
      this.houseBttn.anchor.setTo(.5, .5);
      this.houseBttn.fixedToCamera = true;
      this.houseBttn.smoothed = false;
      this.houseBttn.scale.setTo(scale, scale);
      this.houseBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.houseBttn.visible = false;
        this.houseBttn.input.enabled = false;
      }
      this.UI.add(this.houseBttn);

      this.waterBttn = this.game.add.button(this.houseBttn.right + buttonOffset, this.roadBttn.centerY, "waterBttn", function(){buildMode.call(this, this, this.waterGroup);}, this, 0, 0, 1);
      this.waterBttn.anchor.setTo(.5, .5);
      this.waterBttn.fixedToCamera = true;
      this.waterBttn.smoothed = false;
      this.waterBttn.scale.setTo(scale, scale);
      this.waterBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.waterBttn.visible = false;
        this.waterBttn.input.enabled = false;
      }
      this.UI.add(this.waterBttn);

      this.cropBttn = this.game.add.button(this.waterBttn.right + buttonOffset,  this.roadBttn.centerY, "cropBttn", function(){buildMode.call(this, this, this.cropGroup);}, this, 0, 0, 1);
      this.cropBttn.anchor.setTo(.5, .5);
      this.cropBttn.fixedToCamera = true;
      this.cropBttn.smoothed = false;
      this.cropBttn.scale.setTo(scale, scale);
      this.cropBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.cropBttn.visible = false;
        this.cropBttn.input.enabled = false;
      }
      this.UI.add(this.cropBttn);

      this.woodBttn = this.game.add.button(this.cropBttn.right + buttonOffset,  this.roadBttn.centerY, "woodBttn", function(){buildMode.call(this, this, this.woodGroup);}, this, 0, 0, 1);
      this.woodBttn.anchor.setTo(.5, .5);
      this.woodBttn.fixedToCamera = true;
      this.woodBttn.smoothed = false;
      this.woodBttn.scale.setTo(scale, scale);
      this.woodBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.woodBttn.visible = false;
        this.woodBttn.input.enabled = false;
      }
      this.UI.add(this.woodBttn);

      this.stoneBttn = this.game.add.button(this.woodBttn.right + buttonOffset,  this.roadBttn.centerY, "stoneBttn", function(){buildMode.call(this, this, this.stoneGroup);}, this, 0, 0, 1);
      this.stoneBttn.anchor.setTo(.5, .5);
      this.stoneBttn.fixedToCamera = true;
      this.stoneBttn.smoothed = false;
      this.stoneBttn.scale.setTo(scale, scale);
      this.stoneBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.stoneBttn.visible = false;
        this.stoneBttn.input.enabled = false;
      }
      this.UI.add(this.stoneBttn);

      this.uraniumBttn = this.game.add.button(this.stoneBttn.right + buttonOffset,  this.roadBttn.centerY, "uraniumBttn", function(){buildMode.call(this, this, this.uraniumGroup);}, this, 0, 0, 1);
      this.uraniumBttn.anchor.setTo(.5, .5);
      this.uraniumBttn.fixedToCamera = true;
      this.uraniumBttn.smoothed = false;
      this.uraniumBttn.scale.setTo(scale, scale);
      this.uraniumBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.uraniumBttn.visible = false;
        this.uraniumBttn.input.enabled = false;
      }
      this.UI.add(this.uraniumBttn);

      this.energyBttn = this.game.add.button(this.uraniumBttn.right + buttonOffset,  this.roadBttn.centerY, "energyBttn", function(){buildMode.call(this, this, this.energyGroup);}, this, 0, 0, 1);
      this.energyBttn.anchor.setTo(.5, .5);
      this.energyBttn.fixedToCamera = true;
      this.energyBttn.smoothed = false;
      this.energyBttn.scale.setTo(scale, scale);
      this.energyBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.energyBttn.visible = false;
        this.energyBttn.input.enabled = false;
      }
      this.UI.add(this.energyBttn);

      this.windBttn = this.game.add.button(this.energyBttn.right + buttonOffset,  this.roadBttn.centerY, "windBttn", function(){buildMode.call(this, this, this.windGroup);}, this, 0, 0, 1);
      this.windBttn.anchor.setTo(.5, .5);
      this.windBttn.fixedToCamera = true;
      this.windBttn.smoothed = false;
      this.windBttn.scale.setTo(scale, scale);
      this.windBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.windBttn.visible = false;
        this.windBttn.input.enabled = false;
      }
      this.UI.add(this.windBttn);

      this.hospitalBttn = this.game.add.button(this.windBttn.right + buttonOffset,  this.roadBttn.centerY, "hospitalBttn", function(){buildMode.call(this, this, this.hospitalGroup);}, this, 0, 0, 1);
      this.hospitalBttn.anchor.setTo(.5, .5);
      this.hospitalBttn.fixedToCamera = true;
      this.hospitalBttn.smoothed = false;
      this.hospitalBttn.scale.setTo(scale, scale);
      this.hospitalBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.hospitalBttn.visible = false;
        this.hospitalBttn.input.enabled = false;
      }
      this.UI.add(this.hospitalBttn);

      this.bulldozeBttn = this.game.add.button(this.hospitalBttn.right + buttonOffset,  this.roadBttn.centerY, "bulldozeBttn", function(){destroyMode.call(this);}, this, 0, 0, 1);
      this.bulldozeBttn.anchor.setTo(.5, .5);
      this.bulldozeBttn.fixedToCamera = true;
      this.bulldozeBttn.smoothed = false;
      this.bulldozeBttn.scale.setTo(scale, scale);
      this.bulldozeBttn.onDownSound = this.buttonSound;
      if (this.mode == 1)
      {
        this.bulldozeBttn.visible = false;
        this.bulldozeBttn.input.enabled = false;
      }
      this.UI.add(this.bulldozeBttn);

    //////////////////////////////
    //UI Txt

      this.timeTxt = this.game.add.text(719, 50, this.currentTime.hour + ":00", {font: "50px console", fill: "red"});
      this.timeTxt.anchor.setTo(.5, 0);
      this.timeTxt.fixedToCamera = true;
      this.timeTxt.smoothed = false;

      this.UI.add(this.timeTxt);

      this.timescaleTxt = this.game.add.text(this.timeTxt.x, this.timeTxt.bottom + 5, "Speed: " + this.timeScale, {font: "30px console"});
      this.timescaleTxt.anchor.setTo(.5, 0);
      this.timescaleTxt.fixedToCamera = true;
      this.timescaleTxt.smoothed = false;

      this.UI.add(this.timescaleTxt);

    //////////////////////////////
    //UI Resources

      this.foodTxtGroup = this.game.add.group();

      this.foodIcon = this.game.add.sprite(this.timeTxt.left, this.timescaleTxt.bottom + 350/5, "cropIcon");
      this.foodIcon.anchor.setTo(1, 0);
      this.foodIcon.fixedToCamera = true;
      this.foodIcon.smoothed = false;

      this.foodTxtGroup.add(this.foodIcon);

      
      this.foodTxt = this.game.add.text(this.foodIcon.right + 15, this.foodIcon.centerY + 3, this.food, {font: "30px console"});
      this.foodTxt.anchor.setTo(0, .5);
      this.foodTxt.fixedToCamera = true;
      this.foodTxt.smoothed = false;

      this.foodTxtGroup.add(this.foodTxt);


      var auxSymbol = "";
      var auxColor = "#FF0000";
      if(this.foodGain >= 0){
        auxSymbol = "+";
        auxColor = "#008500";
      }
      this.foodTxtGain = this.game.add.text(this.foodTxt.right + 18, this.foodIcon.centerY + 3, auxSymbol + this.foodGain, {font: "30px console"});
      this.foodTxtGain.anchor.setTo(0, .5);
      this.foodTxtGain.fixedToCamera = true;
      this.foodTxtGain.smoothed = false;
      this.foodTxtGain.addColor(auxColor, 0);

      this.foodTxtGroup.add(this.foodTxtGain);


      this.foodTxtTooltip = new Phasetips(this.game, {
        targetObject: this.foodIcon,
        context: "Food\n(Citizens eat once per day)",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        animation: "fade"
      });

      this.UI.add(this.foodTxtGroup);

    ///////////////

      this.waterTxtGroup = this.game.add.group();

      this.waterIcon = this.game.add.sprite(this.foodIcon.centerX + 10, this.foodIcon.bottom + 7, "waterIcon");
      this.waterIcon.anchor.setTo(1, 0);
      this.waterIcon.fixedToCamera = true;
      this.waterIcon.smoothed = false;

      this.waterTxtGroup.add(this.waterIcon);


      this.waterTxt = this.game.add.text(this.foodIcon.right + 15, this.waterIcon.centerY + 3, this.water, {font: "30px console"});
      this.waterTxt.anchor.setTo(0, .5);
      this.waterTxt.fixedToCamera = true;
      this.waterTxt.smoothed = false;

      this.waterTxtGroup.add(this.waterTxt);


      var auxSymbol = "";
      var auxColor = "#FF0000";
      if(this.waterGain >= 0){
        auxSymbol = "+";
        auxColor = "#008500";
      }
      this.waterTxtGain = this.game.add.text(this.foodTxt.right + 15, this.waterIcon.centerY + 3, auxSymbol + this.waterGain, {font: "30px console"});
      this.waterTxtGain.anchor.setTo(0, .5);
      this.waterTxtGain.fixedToCamera = true;
      this.waterTxtGain.smoothed = false;
      this.waterTxtGain.addColor(auxColor, 0);

      this.waterTxtGroup.add(this.waterTxtGain);


      this.waterTxtTooltip = new Phasetips(this.game, {
        targetObject: this.waterIcon,
        context: "Water\n(Citizens drink once per day)",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        animation: "fade"
      });

      this.UI.add(this.waterTxtGroup);

    ///////////////

      this.woodTxtGroup = this.game.add.group();

      this.woodIcon = this.game.add.sprite(this.foodIcon.centerX, this.waterIcon.bottom + 7, "woodIcon");
      this.woodIcon.anchor.setTo(.5, 0);
      this.woodIcon.fixedToCamera = true;
      this.woodIcon.smoothed = false;

      this.woodTxtGroup.add(this.woodIcon);

      
      this.woodTxt = this.game.add.text(this.foodTxt.x, this.woodIcon.centerY + 4, this.wood, {font: "30px console"});
      this.woodTxt.anchor.setTo(0, .5);
      this.woodTxt.fixedToCamera = true;
      this.woodTxt.smoothed = false;

      this.woodTxtGroup.add(this.woodTxt);


      auxSymbol = "";
      auxColor = "#FF0000";
      if(this.woodGain >= 0){
        auxSymbol = "+";
        auxColor = "#008500";
      }

      this.woodTxtGain = this.game.add.text(this.foodTxtGain.x, this.woodIcon.centerY + 3, auxSymbol + this.woodGain, {font: "30px console"});
      this.woodTxtGain.anchor.setTo(0, .5);
      this.woodTxtGain.fixedToCamera = true;
      this.woodTxtGain.smoothed = false;
      this.woodTxtGain.addColor(auxColor, 0);

      this.woodTxtGroup.add(this.woodTxtGain);


      this.woodTxtTooltip = new Phasetips(this.game, {
        targetObject: this.woodIcon,
        context: "Wood",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        animation: "fade"
      });

      this.UI.add(this.woodTxtGroup);

    ///////////////

      this.stoneTxtGroup = this.game.add.group();

      this.stoneIcon = this.game.add.sprite(this.foodIcon.centerX, this.woodIcon.bottom + 7, "stoneIcon");
      this.stoneIcon.anchor.setTo(.5, 0);
      this.stoneIcon.fixedToCamera = true;
      this.stoneIcon.smoothed = false;

      this.stoneTxtGroup.add(this.stoneIcon);


      this.stoneTxt = this.game.add.text(this.foodTxt.x, this.stoneIcon.centerY + 4, this.stone, {font: "30px console"});
      this.stoneTxt.anchor.setTo(0, .5);
      this.stoneTxt.fixedToCamera = true;
      this.stoneTxt.smoothed = false;

      this.stoneTxtGroup.add(this.stoneTxt);


      auxSymbol = "";
      auxColor = "#FF0000";
      if(this.stoneGain >= 0){
        auxSymbol = "+";
        auxColor = "#008500";
      }

      this.stoneTxtGain = this.game.add.text(this.foodTxtGain.x, this.stoneIcon.centerY + 3, auxSymbol + this.stoneGain, {font: "30px console"});
      this.stoneTxtGain.anchor.setTo(0, .5);
      this.stoneTxtGain.fixedToCamera = true;
      this.stoneTxtGain.smoothed = false;
      this.stoneTxtGain.addColor(auxColor, 0);

      this.stoneTxtGroup.add(this.stoneTxtGain);


      this.stoneTxtTooltip = new Phasetips(this.game, {
        targetObject: this.stoneIcon,
        context: "Stone",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        animation: "fade"
      });

      this.UI.add(this.stoneTxtGroup);

    ///////////////

      this.uraniumTxtGroup = this.game.add.group();

      this.uraniumIcon = this.game.add.sprite(this.foodIcon.centerX, this.stoneIcon.bottom + 7, "uraniumIcon");
      this.uraniumIcon.anchor.setTo(.5, 0);
      this.uraniumIcon.fixedToCamera = true;
      this.uraniumIcon.smoothed = false;

      this.uraniumTxtGroup.add(this.uraniumIcon);
      

      this.uraniumTxt = this.game.add.text(this.foodTxt.x, this.uraniumIcon.centerY + 4, this.uranium, {font: "30px console"});
      this.uraniumTxt.anchor.setTo(0, .5);
      this.uraniumTxt.fixedToCamera = true;
      this.uraniumTxt.smoothed = false;

      this.uraniumTxtGroup.add(this.uraniumTxt);


      auxSymbol = "";
      auxColor = "#FF0000";
      if(this.uraniumGain >= 0){
        auxSymbol = "+";
        auxColor = "#008500";
      }

      this.uraniumTxtGain = this.game.add.text(this.foodTxtGain.x, this.uraniumIcon.centerY + 3, auxSymbol + this.uraniumGain, {font: "30px console"});
      this.uraniumTxtGain.anchor.setTo(0, .5);
      this.uraniumTxtGain.fixedToCamera = true;
      this.uraniumTxtGain.smoothed = false;
      this.uraniumTxtGain.addColor(auxColor, 0);

      this.uraniumTxtGroup.add(this.uraniumTxtGain);


      this.uraniumTxtTooltip = new Phasetips(this.game, {
        targetObject: this.uraniumIcon,
        context: "Uranium",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
      animation: "fade"
      });

      this.UI.add(this.uraniumTxtGroup);

    ///////////////

      this.energyTxtGroup = this.game.add.group();

      this.energyIcon = this.game.add.sprite(this.foodIcon.centerX, this.uraniumIcon.bottom + 7, "energyIcon");
      this.energyIcon.anchor.setTo(.5, 0);
      this.energyIcon.fixedToCamera = true;
      this.energyIcon.smoothed = false;

      this.energyTxtGroup.add(this.energyIcon);


      this.energyTxt = this.game.add.text(this.foodTxt.x, this.energyIcon.centerY + 4, this.energy, {font: "30px console"});
      this.energyTxt.anchor.setTo(0, .5);
      this.energyTxt.fixedToCamera = true;
      this.energyTxt.smoothed = false;

      this.energyTxtGroup.add(this.energyTxt);


      auxSymbol = "";
      auxColor = "#FF0000";
      if(this.energyGain >= 0){
        auxSymbol = "+";
        auxColor = "#008500";
      }

      this.energyTxtGain = this.game.add.text(this.foodTxtGain.x, this.energyIcon.centerY + 3, auxSymbol + this.energyGain, {font: "30px console"});
      this.energyTxtGain.anchor.setTo(0, .5);
      this.energyTxtGain.fixedToCamera = true;
      this.energyTxtGain.smoothed = false;
      this.energyTxtGain.addColor(auxColor, 0);

      this.energyTxtGroup.add(this.energyTxtGain);


      this.energyTxtTooltip = new Phasetips(this.game, {
        targetObject: this.energyIcon,
        context: "Energy",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        animation: "fade"
      });

      this.UI.add(this.energyTxtGroup);

    ///////////////

      this.citizensTxtGroup = this.game.add.group();

      this.citizensIcon = this.game.add.sprite(this.foodIcon.centerX, this.stoneIcon.bottom + 550/5, "citizenIcon");
      this.citizensIcon.anchor.setTo(.5, 0);
      this.citizensIcon.fixedToCamera = true;
      this.citizensIcon.smoothed = false;

      this.citizensTxtGroup.add(this.citizensIcon);


      this.citizensTxt = this.game.add.text(this.foodTxt.x, this.citizensIcon.centerY + 3, "5", {font: "30px console"});
      this.citizensTxt.anchor.setTo(0, .5);
      this.citizensTxt.fixedToCamera = true;
      this.citizensTxt.smoothed = false;

      this.citizensTxtGroup.add(this.citizensTxt);


      this.citizensTxtTooltip = new Phasetips(this.game, {
        targetObject: this.citizensIcon,
        context: "Citizen Total",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        animation: "fade"
      });

      this.UI.add(this.citizensTxtGroup);

    ///////////////

      this.homelessTxtGroup = this.game.add.group();

      this.homelessIcon = this.game.add.sprite(this.foodIcon.centerX, this.citizensIcon.bottom + 7, "noHouseIcon");
      this.homelessIcon.anchor.setTo(.5, 0);
      this.homelessIcon.fixedToCamera = true;
      this.homelessIcon.smoothed = false;

      this.homelessTxtGroup.add(this.homelessIcon);


      this.homelessTxt = this.game.add.text(this.foodTxt.x, this.homelessIcon.centerY + 4, "5", {font: "30px console"});
      this.homelessTxt.anchor.setTo(0, .5);
      this.homelessTxt.fixedToCamera = true;
      this.homelessTxt.smoothed = false;

      this.homelessTxtGroup.add(this.homelessTxt);


      this.homelessTxtTooltip = new Phasetips(this.game, {
        targetObject: this.homelessIcon,
        context: "Homeless Citizens",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        animation: "fade"
      });

    this.UI.add(this.homelessTxtGroup);

  ///////////////

    this.unemployedTxtGroup = this.game.add.group();

    this.unemployedIcon = this.game.add.sprite(this.foodIcon.centerX, this.homelessIcon.bottom + 7, "joblessIcon");
    this.unemployedIcon.anchor.setTo(.5, 0);
    this.unemployedIcon.fixedToCamera = true;
    this.unemployedIcon.smoothed = false;

    this.unemployedTxtGroup.add(this.unemployedIcon);


    this.unemployedTxt = this.game.add.text(this.foodTxt.x, this.unemployedIcon.centerY + 4, "5", {font: "30px console"});
    this.unemployedTxt.anchor.setTo(0, .5);
    this.unemployedTxt.fixedToCamera = true;
    this.unemployedTxt.smoothed = false;

    this.unemployedTxtGroup.add(this.unemployedTxt);


    this.unemployedTxtTooltip = new Phasetips(this.game, {
      targetObject: this.unemployedIcon,
      context: "Unemployed Citizens",
      strokeColor: 0xff0000,
      position: "left",
      positionOffset: 30,   
      animation: "fade"
    });

    this.UI.add(this.unemployedTxtGroup);

  //////////////////////////////
  //UI Tooltips

    this.tipRoad = new Phasetips(this.game, {
      targetObject: this.roadBttn,
      context: "Road:\n  You can build right above them.\nCost:\n  1 Stone",
      width: 100,
      height: 80,
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipHouse = new Phasetips(this.game, {
      targetObject: this.houseBttn,
      width: 200,
      height: 80,
      context: "House:\n  Provides shelter for 2 citizens.\nCost:\n  5 Wood, 5 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipWater = new Phasetips(this.game, {
      targetObject: this.waterBttn,
      width: 200,
      height: 80,
      context: "Water:\n  Gives drinkable water.\nCost:\n  10 Wood, 10 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipCrop = new Phasetips(this.game, {
      targetObject: this.cropBttn,
      width: 250,
      height: 80,
      context: "Farm:\n  Provides food for your citizens.\nCost:\n  10 Wood, 10 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipStone = new Phasetips(this.game, {
      targetObject: this.stoneBttn,
      width: 250,
      height: 80,
      context: "Quarry:\n  Used to mine stone for building.\nCost:\n  15 Wood, 15 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipWood = new Phasetips(this.game, {
      targetObject: this.woodBttn,
      width: 250,
      height: 80,
      context: "Sawmill:\n  Used to cut wood for building.\nCost:\n  15 Wood, 10 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });
    
    this.tipUranium = new Phasetips(this.game, {
      targetObject: this.uraniumBttn,
      width: 200,
      height: 80,
      context: "Uranium Mine:\n  Used to mine uranium.\nCost:\n  30 Wood, 30 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipWind = new Phasetips(this.game, {
      targetObject: this.windBttn,
      width: 250,
      height: 80,
      context: "Wind Turbine:\n  Used to produce wind energy.\nCost:\n  30 Wood, 45 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipEnergy = new Phasetips(this.game, {
      targetObject: this.energyBttn,
      width: 250,
      height: 100,
      context: "Nuclear Plant:\n  Used to produce energy by consuming Uranium.\nCost:\n  30 Wood, 35 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipHospital = new Phasetips(this.game, {
      targetObject: this.hospitalBttn,
      width: 250,
      height: 80,
      context: "Hospital:\n  Used to heal your citizens.\nCost:\n  25 Wood, 25 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipBulldoze = new Phasetips(this.game, {
      targetObject: this.bulldozeBttn,
      width: 400,
      height: 60,
      context: "Bulldozer:\n  Used to destroy buildings and\n  roads.",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

  //////////////////////////////
  //Tutorial-specific tooltips

    if (this.mode == 1){

      this.tipTutorial1 = new Phasetips(this.game, {
        targetObject: this.UIBkg, 
        context: "Welcome to Project Settlers! \n First, to move the camera around you'll need to use the WASD keys",
        x: this.game.camera.x + this.game.camera.width / 2 - 81,
        y: this.game.camera.y + this.game.camera.height / 2 - 40,
        strokeColor: 0xff0000,
        position: "center",
        width: 162,
        height: 80,
        positionOffset: 30,   
        animation: "fade"
      });

      this.tipTutorialCitizen = new Phasetips(this.game, {
        targetObject: this.citizensIcon,
        context: "This is where you'll find information about your citizens. \n The icons represent total citizens, homeless citizens and unemployed citizens, respectively.",
        width: 260,
        height: 150,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 0,   
        animation: "fade"
      });

      this.tipTutorialRoad = new Phasetips(this.game, {
        targetObject: this.roadBttn,  
        context: "Roads are the core of Project Settlers, as they allow you to build above them",
        width: 100,
        height: 100,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 115,   
        animation: "fade"
      });

      this.tipTutorialWater = new Phasetips(this.game, {
        targetObject: this.waterBttn,
        width: 200,
        height: 165,
        context: "Citizens need drinkable water to survive. Build these to provide it",
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 30,   
        animation: "fade"
      });

      this.tipTutorialHouse = new Phasetips(this.game, {
        targetObject: this.houseBttn,
        context: "Your citizens need a place to live in, so let's build it for them",
        width: 200,
        height: 95,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100, 
        animation: "fade"
      });

      this.tipTutorialCrop = new Phasetips(this.game, {
        targetObject: this.cropBttn,
        context: "You will need food as well as water. Farms should take care of that",
        width: 250,
        height: 115,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialWood = new Phasetips(this.game, {
        targetObject: this.woodBttn,
        context: "Nothing is free, and you will need resources to create more buildings. Let's build a Sawmill",
        width: 250,
        height: 100,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 115,   
        animation: "fade"
      });

      this.tipTutorialStone = new Phasetips(this.game, {
        targetObject: this.stoneBttn,
        context: "You will need Stone as well, so let's will build a Quarry",
        width: 250,
        height: 95,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialUranium = new Phasetips(this.game, {
        targetObject: this.uraniumBttn,
        context: "Uranium is a source of energy. Build Mines to extract it",
        width: 200,
        height: 95,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialEnergy = new Phasetips(this.game, {
        targetObject: this.energyBttn,
        context: "Energy is a need. With this you can produce it from uranium",
        width: 250,
        height: 115,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialWind = new Phasetips(this.game, {
        targetObject: this.windBttn,
        context: "This building allows you to obtain energy without uranium, thanks to wind",
        width: 250,
        height: 115,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialHospital = new Phasetips(this.game, {
        targetObject: this.hospitalBttn,
        context: "Hospitals allow you to improve the health of citizens",
        width: 315,
        height: 95,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });
    
      this.tipTutorialBulldoze = new Phasetips(this.game, {
        targetObject: this.bulldozeBttn,
        context: "If you want to replace a building, you should bulldoze it first",
        width: 420,
        height: 90,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 85,  
        animation: "fade"
      });
    
      this.tipTutorialTime = new Phasetips(this.game, {
        targetObject: this.timeTxt,
        context: "Now you know the basic mechanics to survive. Press SPACE to get the clock running, and 1, 2 or 3 to change the speed",
        width: 0,
        height: 0,
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 100,   
        animation: "fade"
      });
    }
    
  //////////////////////////////
  //Keys and inputs
    var key_One = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key_One.onDown.add(setTimescale, this);

    var key_Two = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key_Two.onDown.add(setTimescale, this);

    var key_Three = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key_Three.onDown.add(setTimescale, this);

    var key_Space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key_Space.onDown.add(pauseTime, this);

    var key_ESC = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    key_ESC.onDown.add(escape, this);

    this.game.input.onDown.add(click, this);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.cursorsAlt = this.game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );

  //////////////////////////////
  //Tutorial variable set
    if (this.mode == 1){
      
      this.roadCheck = false;
      this.houseCheck = false;
      this.cropCheck = false;
      this.stoneCheck = false;
      this.woodCheck = false;
      this.uraniumCheck = false;
      this.energyCheck = false;
      this.windCheck = false;
      this.waterCheck = false;
      this.hospitalCheck = false;
      this.bulldozeCheck = false;
      this.citizenCheck = false;
      this.cameraCheck = false;
      this.cameraCheckUp = false;
      this.cameraCheckDown = false;
      this.cameraCheckLeft = false;
      this.cameraCheckRight = false;
      this.timeCheck = false;
    }

  //////////////////////////////
  //Functions

    function setTimescale(key){
      this.timeScale = parseInt(key.event.key);
      this.currentTime.buffer = 0;
      this.timescaleTxt.text = "Speed: " + this.timeScale;
    }

    function pauseTime(){
      
      if(!this._escapeMenu) {
        this.paused = !this.paused;
        if(!this.paused && this._buildModeActive)
          buildMode.call(this);
        this._destroyModeActive = false;
        if(this.paused)
          this.timeTxt.addColor("#ff0000", 0);
        else
          this.timeTxt.addColor("#000000", 0);
      }
    }

    function destroyMode(){
      if(!this._escapeMenu) {
        if(this._buildModeActive){
          this._buildModeActive = false;
          if(this._buildingModeSprite !== undefined)
            this._buildingModeSprite.destroy();
          if(this._buildingModeArea !== undefined)
            this._buildingModeArea.destroy();
        }


        if(!this._destroyModeActive){
          this.paused = true;
          this._destroyModeActive = true;
          this.timeTxt.addColor("#ff0000", 0);
        }

        else{
          this._destroyModeActive = false;
        }
      }
    }

    function buildMode(key = undefined, group){
      if(!this._escapeMenu) {
        if(this._destroyModeActive)
          this._destroyModeActive = false;


        if(!this._buildModeActive){
          this._buildingModeSprite = this.game.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, group.sprite);
          this._buildingModeSprite.anchor.setTo(0.5, 0.5);
          this._buildingModeSprite.alpha = 0.7;

          this._buildingModeType = group;
          
          this.paused = true;
          this._buildModeActive = true;
          this.timeTxt.addColor("#ff0000", 0);

          this.game.world.sendToBack(this._buildingModeSprite);
          this.game.world.moveUp(this._buildingModeSprite);
          this.game.world.moveUp(this._buildingModeSprite);
          this.game.world.moveUp(this._buildingModeSprite);
          this.game.world.moveUp(this._buildingModeSprite);
          this.game.world.moveUp(this._buildingModeSprite);
          this.game.world.moveUp(this._buildingModeSprite);

          if(group == this.hospitalGroup){
            this._buildingModeArea = this.game.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, "area");
            this._buildingModeArea.anchor.setTo(0.5, 0.5);
            this._buildingModeArea.alpha = 0.35;

            this._buildingModeArea.width = 16*this._tileSize;
            this._buildingModeArea.height = 16*this._tileSize;

            this.game.world.sendToBack(this._buildingModeArea);
            this.game.world.moveUp(this._buildingModeArea);
            this.game.world.moveUp(this._buildingModeArea);
            this.game.world.moveUp(this._buildingModeArea);
            this.game.world.moveUp(this._buildingModeArea);
            this.game.world.moveUp(this._buildingModeArea);
          }
        }

        else {
          if(this._buildingModeSprite !== undefined)
            this._buildingModeSprite.destroy();
            
          if(this._buildingModeArea !== undefined)
            this._buildingModeArea.destroy();

          this._buildModeActive = false;
        }
      }
    }

    function click(){
      if(!this._escapeMenu){
        if(this.game.input.mousePointer.x < 6 || this.game.input.mousePointer.x > 640 || this.game.input.mousePointer.y < 44 || this.game.input.mousePointer.y > 539){
          if(this._buildModeActive)
            buildMode.call(this);
          this._destroyModeActive = false;
        }
        else if(this._buildModeActive)
          build.call(this);
      }
    }

    function destroy(sprite){
      if(this._destroyModeActive){

        this.buildingGroup.forEach(function(sprite, group){
          if(group.children.indexOf(sprite) != -1){
            this.wood += Math.round(group.wood/2);
            this.stone += Math.round(group.stone/2);
          }
        }.bind(this, sprite));
        
        this.woodTxt.text = this.wood;
        this.stoneTxt.text = this.stone;

        if(sprite.full !== undefined){
          if(sprite.area !== undefined){
            this.houseGroup.forEach(function (house) { house.updateSingleHospital(sprite, false); }, this);
            sprite.bulldoze(this.unemployedArray);
          }
          
          else if(sprite.hospitalNear !== undefined)
            sprite.bulldoze(this.homelessArray);
          else
            sprite.bulldoze(this.unemployedArray);
        }
        sprite.destroy();

        if (this.mode == 1 && !this.timeCheck)
          this.timeCheck = true;
      }
    }

    function build(){
      var overlap = false;

      this.buildingGroup.forEach(function (group){
        group.forEach(function(building){
          overlap = overlap || this.checkOverlap.call(this, this._buildingModeSprite, building);
        }, this);
      }, this);

      overlap = overlap || this.game.input.mousePointer.x < 6 || this.game.input.mousePointer.x > 640 || this.game.input.mousePointer.y < 44 || this.game.input.mousePointer.y > 539;

      var roadAdjacency;
      this.roadGroup.forEach(function (road){
        roadAdjacency = roadAdjacency || this.checkAdjacency.call(this, this._buildingModeSprite, road);
      }, this);

      var waterObstacle = this.checkObstacles.call(this, this._buildingModeSprite, "water");
      var mountainObstacle = this.checkObstacles.call(this, this._buildingModeSprite, "mountain");


      if(!overlap && !mountainObstacle && (this._buildingModeType == this.roadGroup || (roadAdjacency && this.wood >= this._buildingModeType.wood && this.stone >= this._buildingModeType.stone && !waterObstacle))){
        var auxBuilding;

        var offset = 0;

        if((this._buildingModeSprite.height / 16) % 2 == 0)
          offset = 8;

        if(this._buildingModeType == this.houseGroup)
        {
          auxBuilding = new Classes.House(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite);
          
          if (this.mode == 1 && !this.waterCheck)
            this.waterCheck = true;
        }        
        else if(this._buildingModeType == this.roadGroup)
        {
            auxBuilding = new Classes.Road(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite);

            if (this.mode == 1 && this._buildingModeType == this.roadGroup && !this.houseCheck)
          {

            this.houseCheck = true;
          }
        }

        else if(this._buildingModeType == this.hospitalGroup){
          auxBuilding = new Classes.Hospital(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite, 2);

          if (this.mode == 1 && !this.bulldozeCheck)
            this.bulldozeCheck = true;
        }

        else
        {
            auxBuilding = new Classes.Producer(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite, this._buildingModeType.produce, this._buildingModeType.consume);

            if (this._buildingModeType.sprite == 'Water')
            {

              if (this.mode == 1 && !this.cropCheck)
                this.cropCheck = true;
            }

          if (this._buildingModeType.sprite == 'Crops')
            {

              if (this.mode == 1 && !this.woodCheck)
                this.woodCheck = true;
            }
            
          if (this._buildingModeType.sprite == 'Wood')
            {

              if (this.mode == 1 && !this.stoneCheck)
                this.stoneCheck = true;
            }

          if (this._buildingModeType.sprite == 'Stone')
            {

              if (this.mode == 1 && !this.uraniumCheck)
                this.uraniumCheck = true;
            }

          if (this._buildingModeType.sprite == 'Uranium')
            {

              if (this.mode == 1 && !this.energyCheck)
                this.energyCheck = true;
            }

          if (this._buildingModeType.sprite == 'Energy')
            {

              if (this.mode == 1 && !this.windCheck)
                this.windCheck = true;
            }

          if (this._buildingModeType.sprite == 'Wind')
            {

              if (this.mode == 1 && !this.hospitalCheck)
                this.hospitalCheck = true;
            }
        }

        this.wood -= this._buildingModeType.wood;
        this.stone -= this._buildingModeType.stone;

        auxBuilding.anchor.setTo(0.5, 0.5);

        auxBuilding.inputEnabled = true;
        auxBuilding.input.priorityID = 1;
        auxBuilding.events.onInputOver.add(mouseOver, this, 0, auxBuilding);
        auxBuilding.events.onInputOut.add(mouseOut, this, 0, auxBuilding);
        auxBuilding.events.onInputDown.add(destroy, this);
        auxBuilding.over = false;

        
        this.woodTxt.text = this.wood;
        this.stoneTxt.text = this.stone;

        this._buildingModeType.add(auxBuilding);

        if(this._buildingModeType == this.hospitalGroup){
          this.houseGroup.forEach(function (house) { house.updateSingleHospital(auxBuilding); }, this);
        }
        else if(this._buildingModeType == this.houseGroup)
        {
          auxBuilding.updateHospitals(this.hospitalGroup);
        }      

        this._buildModeActive = false;
        if(this._buildingModeSprite !== undefined)
          this._buildingModeSprite.destroy();
        if(this._buildingModeArea !== undefined)
          this._buildingModeArea.destroy();
        buildMode.call(this, this, this._buildingModeType);


        if(this.wood < 1)
          this.woodTxt.addColor("#FF0000", 0);

        if(this.stone < 1)
          this.stoneTxt.addColor("#FF0000", 0);
      }
    }

    function mouseOver(sprite){
      if(this._destroyModeActive && !this._escapeMenu){
        sprite.tint = 0xFF0000;
        this.over = true;
      }
    }

    function mouseOut(sprite){
        sprite.tint = 0xFFFFFF;
        this.over = false;
    }

    function escape(key){
      if(key !== undefined && (this._buildModeActive || this._destroyModeActive)){
        if(this._buildModeActive)
          buildMode.call(this);
        this._destroyModeActive = false;
      }

      else{
        this._escapeMenu = !this._escapeMenu;

        if(this._escapeMenu) {
          this.fade = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'fade');
          this.fade.width = this.game.camera.width;
          this.fade.height = this.game.camera.height;
          this.fade.alpha = 0.5;
          
          this.game.world.bringToTop(this.fade);
          this.game.world.bringToTop(this.pauseMenu);
        }

        else
          this.fade.destroy();

        this.pauseMenu.visible = this._escapeMenu;
        if(this.optionsMenu.visible && !this._escapeMenu)
          this.optionsMenu.visible = false;
        this.UI.forEach(function(button){
          button.inputEnabled = !this._escapeMenu;
        }, this);
      }
    }

    this.checkOverlap = function(a, b){

      var x = a.getBounds();
      x.width--;
      x.height--;
      var y = b.getBounds();
      y.width--;
      y.height--;

      return Phaser.Rectangle.intersects(x, y);
    }

    this.checkAdjacency = function(a, b){

      var x = a.getBounds();
      x.width = x.width / 2;
      x.y++;
      x.x++;
      var y = b.getBounds();

      var corners = false;
      corners = (x.y == y.bottom || x.bottom == y.y ) && (x.x == y.right || x.right == y.x);

      return Phaser.Rectangle.intersects(x, y) && !corners;
    }

    this.checkObstacles = function(a, type){

      if(type == "water")
        return this.map.getTileWorldXY(a.x, a.y, this.map.tileWidth, this.map.tileHeight, "water") !== null;

      else if(type == "mountain")
        return this.map.getTileWorldXY(a.x, a.y, this.map.tileWidth, this.map.tileHeight, "obstacles") !== null;
      
    }

    function addCitizen()
    {
      var citizen = new Classes.Citizen(this.homelessArray, this.unemployedArray);
    } 

  //////////////////////////////
  //initial creation of citizens

    for(var i = 0; i < 5; i++)
      addCitizen.call(this);
  },


  update: function () {
    if (this.mode == 1)
    { 
        if (this.cameraCheckUp && this.cameraCheckDown && this.cameraCheckLeft && this.cameraCheckRight)
      {
          this.cameraCheck = true;
      }

      if (this.cameraCheck)
      {
        this.citizensIcon.visible = true;
        this.citizensTxt.visible = true;
        this.homelessIcon.visible = true;
        this.homelessTxt.visible = true;
        this.unemployedIcon.visible = true;
        this.unemployedTxt.visible = true;
        this.roadCheck = true;
      }  
      
      if (this.roadCheck)
      {    
        this.roadBttn.visible = true;
        this.roadBttn.input.enabled = true;
      }

      if (this.houseCheck)
      {
        this.houseBttn.visible = true;
        this.houseBttn.input.enabled = true;
      }

      if (this.waterCheck)
      {
        this.waterBttn.visible = true;
        this.waterBttn.input.enabled = true;
        this.waterIcon.visible = true;
        this.waterTxt.visible = true;
        this.waterTxtGain.visible = true;
      }

      if (this.cropCheck)
      {
        this.cropBttn.visible = true;
        this.cropBttn.input.enabled = true;
        this.foodIcon.visible = true;
        this.foodTxt.visible = true;
        this.foodTxtGain.visible = true;
      }

      if (this.woodCheck)
      {
        this.woodBttn.visible = true;
        this.woodBttn.input.enabled = true;
        this.woodIcon.visible = true;
        this.woodTxt.visible = true;
        this.woodTxtGain.visible = true;
      }

      if (this.stoneCheck)
      {
        this.stoneBttn.visible = true;
        this.stoneBttn.input.enabled = true;
        this.stoneIcon.visible = true;
        this.stoneTxt.visible = true;
        this.stoneTxtGain.visible = true;
      }

      if (this.uraniumCheck) 
      {
        this.uraniumBttn.visible = true;
        this.uraniumBttn.input.enabled = true;
        this.uraniumIcon.visible = true;
        this.uraniumTxt.visible = true;
        this.uraniumTxtGain.visible = true;
      }

      if (this.energyCheck) 
      {
        this.energyBttn.visible = true;
        this.energyBttn.input.enabled = true;
        this.energyIcon.visible = true;
        this.energyTxt.visible = true;
        this.energyTxtGain.visible = true;
      }

      if (this.windCheck) 
      {
        this.windBttn.visible = true;
        this.windBttn.input.enabled = true;
      }

      if (this.hospitalCheck)
      {
        this.hospitalBttn.visible = true;
        this.hospitalBttn.input.enabled = true;
      }

      if (this.bulldozeCheck)
      {
        this.bulldozeBttn.visible = true;
        this.bulldozeBttn.input.enabled = true;
      }

      if (this.timeCheck)
      {
        this.timeTxt.visible = true;
        this.timescaleTxt.visible = true;
      }
    }  

    if(!this._escapeMenu) {
      if(!this.paused){
        this.currentTime.buffer += this.timeScale; //buffer increment

        if (this.currentTime.buffer >= 20) { //if buffer > 20, update. AKA, speed 1 = every 20 loops, speed 2 = every 10 loops... etc.
          
        ////////////////////////////////////////
        //update clock
          this.currentTime.buffer = 0;

          this.currentTime.hour = (this.currentTime.hour + 1) % 24; 
        
        ////////////////////////////////////////
        //update producers
          if(this.currentTime.hour >= this.shiftStart && this.currentTime.hour < this.shiftEnd){

            this.timeTxt.addColor("#008500", 0);

          ////////////////////////////////////////
          //Energy producers
            this.energyGroup.forEach(function(prod){
              if(this.uranium > prod.consume){
                
                if (prod.off)
                {
                  prod.off = false;
                  prod.updateAmount();
                }

                this.energy += prod.amount;
                this.uranium -= prod.consume;
              }

              else
                {
                  prod.off = true;
                  prod.updateAmount();
                }

            }, this);

            this.windGroup.forEach(function(prod){

              if(prod.off){
                prod.off = false;
                prod.updateAmount();
              }

              this.energy += prod.amount;

            }, this);

          ////////////////////////////////////////
          //Resource producers

            this.cropGroup.forEach(function(prod){
              if (this.energy >= prod.consume)
              {
                this.energy -= prod.consume;

                if (prod.off)
                  {
                    prod.off = false;
                    prod.updateAmount();
                  }
              }

              else
                {
                  prod.off = true;
                  prod.updateAmount();
                }

              this.food += prod.amount;
            }, this);

            this.waterGroup.forEach(function(prod){

              if (this.energy >= prod.consume)
              {
                this.energy -= prod.consume;

                if (prod.off)
                  {
                    prod.off = false;
                    prod.updateAmount();
                  }
              }

              else
                {
                  prod.off = true;
                  prod.updateAmount();
                }

              this.water += prod.amount;
            }, this);

            this.woodGroup.forEach(function(prod){

              if (this.energy >= prod.consume)
              {
                this.energy -= prod.consume;

                if (prod.off)
                  {
                    prod.off = false;
                    prod.updateAmount();
                  }
              }

              else
                {
                  prod.off = true;
                  prod.updateAmount();
                }


              this.wood += prod.amount;
            }, this);

            this.stoneGroup.forEach(function(prod){

              if (this.energy >= prod.consume)
              {
                this.energy -= prod.consume;

                if (prod.off)
                  {
                    prod.off = false;
                    prod.updateAmount();
                  }
              }

              else
                {
                  prod.off = true;
                  prod.updateAmount();
                }

              this.stone += prod.amount;
            }, this);

            this.uraniumGroup.forEach(function(prod){
              if (this.energy >= prod.consume)
              {
                this.energy -= prod.consume;

                if (prod.off)
                {
                  prod.off = false;
                  prod.updateAmount();
                }
              }

              else
                {
                  prod.off = true;
                  prod.updateAmount();
                }

              this.uranium += prod.amount;
            }, this);

          ////////////////////////////////////////
          //Others

            this.hospitalGroup.forEach(function(prod){
              if(this.energy >= prod.amount){

                this.energy -= prod.amount;

                if(prod.off){
                  this.houseGroup.forEach(function (house) { house.updateSingleHospital(prod, true); }, this);
                  prod.updateTooltip();
                }

                prod.off = false
              }
              
              else{
                this.houseGroup.forEach(function (house) { house.updateSingleHospital(prod, false); }, this);
                prod.off = true;
                prod.updateTooltip();
              }
            }, this);

            this.foodTxt.text = this.food;
            this.woodTxt.text = this.wood;
            this.stoneTxt.text = this.stone;
            this.waterTxt.text = this.water;
            this.energyTxt.text = this.energy;
            this.uraniumTxt.text = this.uranium;
          }

          else if(this.currentTime.hour == 0){
            
            this.timeTxt.addColor("#000000", 0);

            this.houseGroup.forEach(function(prod){
              if(this.food >= 5)
                this.food -= 3;
              if(this.water >= 5)
                this.water -= 3;
              prod.tick(this.food, this.water, prod.hospitalNear, prod, this.homelessArray, this.houseGroup);

              for(var i = prod.numberOfBirths; i > 0; i--)
                var aux = new Classes.Citizen(this.homelessArray, this.unemployedArray);
            }, this);

            for (var i = this.homelessArray.length - 1; i >= 0; i--) {
              if(this.food >= 5)
                this.food -= 5;
              if(this.water >= 5)
                this.water -= 5;
              this.homelessArray[i].tick(this.food, this.water, false, null, this.homelessArray, this.houseGroup);
            }
         
            this.foodTxt.text = this.food;
            this.waterTxt.text = this.water;
          }

          else
            this.timeTxt.addColor("#000000", 0);

          var originalLength = this.homelessArray.length;
          for (var i = this.homelessArray.length - 1; i >= 0; i--) {
            if(!this.homelessArray[i].homeless || this.homelessArray[i].health <= 0 || this.homelessArray[i].addToHouse(this.houseGroup))
              this.homelessArray.splice(i, 1);

            if(this.homelessArray.length > originalLength)
              i += (this.homelessArray.length - originalLength);
          }

          originalLength = this.unemployedArray.length;
          for (var i = this.unemployedArray.length - 1; i >= 0; i--) {
            if(!this.unemployedArray[i].unemployed || this.unemployedArray[i].health <= 0 || this.unemployedArray[i].addToProducer(this.buildingGroup))
              this.unemployedArray.splice(i, 1);

            if(this.unemployedArray.length > originalLength)
              i += (this.unemployedArray.length - originalLength);
          }

          this.timeTxt.text = this.currentTime.hour + ":00";

          var aux = this.homelessArray.length;

          this.houseGroup.forEach(function(house){aux += house.countCitizens();});
          
          if (aux == 0)
          {
            this.gameMusic.stop();
            this.game.state.start('defeat');
          }

          if (aux == 1000000)
          {
            this.gameMusic.stop();
            this.game.state.start('win');
          }

          this.homelessTxt.text = this.homelessArray.length;
          this.unemployedTxt.text = this.unemployedArray.length;
          this.citizensTxt.text = aux;

          this.foodGain = 0;
          this.cropGroup.forEach(function(prod){this.foodGain += prod.amount * (this.shiftEnd - this.shiftStart)}, this);
          this.foodGain -= (this.homelessArray.length * 5 + (aux - this.homelessArray.length ) * 3);
          var auxSymbol = "";
          var auxColor = "#FF0000";
          if(this.foodGain >= 0){
            auxSymbol = "+";
            auxColor = "#008500";
          }
          this.foodTxtGain.text = auxSymbol + this.foodGain;
          this.foodTxtGain.addColor(auxColor, 0);


          this.woodGain = 0;
          this.woodGroup.forEach(function(prod){this.woodGain += prod.amount * (this.shiftEnd - this.shiftStart)}, this);
          auxSymbol = "";
          auxColor = "#FF0000";
          if(this.woodGain >= 0){
            auxSymbol = "+";
            auxColor = "#008500";
          }
          this.woodTxtGain.text = auxSymbol + this.woodGain;
          this.woodTxtGain.addColor(auxColor, 0);


          this.stoneGain = 0;
          this.stoneGroup.forEach(function(prod){this.stoneGain += prod.amount * (this.shiftEnd - this.shiftStart)}, this);
          auxSymbol = "";
          auxColor = "#FF0000";
          if(this.woodGain >= 0){
            auxSymbol = "+";
            auxColor = "#008500";
          }
          this.stoneTxtGain.text = auxSymbol + this.stoneGain;
          this.stoneTxtGain.addColor(auxColor, 0);

          this.waterGain = 0;
          this.waterGroup.forEach(function(prod){this.waterGain += prod.amount * (this.shiftEnd - this.shiftStart)}, this);
          this.waterGain -= (aux * 5);
          auxSymbol = "";
          auxColor = "#FF0000";
          if(this.waterGain >= 0){
            auxSymbol = "+";
            auxColor = "#008500";
          }
          this.waterTxtGain.text = auxSymbol + this.waterGain;
          this.waterTxtGain.addColor(auxColor, 0);


          this.energyGain = 0;
          this.buildingGroup.forEach(function(group){
            if(group == this.energyGroup || group == this.windGroup)
              group.forEach(function(prod){ if(!prod.off){this.energyGain += prod.amount * (this.shiftEnd - this.shiftStart)}}, this);
            
            else if(group != this.houseGroup && group != this.roadGroup)
              group.forEach(function(prod){ if(!prod.off){this.energyGain -= prod.consume * (this.shiftEnd - this.shiftStart)}}, this);
          }, this);
          auxSymbol = "";
          auxColor = "#FF0000";
          if(this.energyGain >= 0){
            auxSymbol = "+";
            auxColor = "#008500";
          }
          this.energyTxtGain.text = auxSymbol + this.energyGain;
          this.energyTxtGain.addColor(auxColor, 0);


          this.uraniumGain = 0;
          this.uraniumGroup.forEach(function(prod){this.uraniumGain += prod.amount * (this.shiftEnd - this.shiftStart)}, this);
          auxSymbol = "";
          auxColor = "#FF0000";
          if(this.uraniumGain >= 0){
            auxSymbol = "+";
            auxColor = "#008500";
          }
          this.uraniumTxtGain.text = auxSymbol + this.uraniumGain;
          this.uraniumTxtGain.addColor(auxColor, 0);

        }
      }

      else if(this._buildModeActive){

        var offset = 0;

        if((this._buildingModeSprite.height / 16) % 2 == 0)
          offset = 8;

        this._buildingModeSprite.x = Math.round(this.game.input.worldX / this._tileSize) * this._tileSize;
        this._buildingModeSprite.y = offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize;

        if(this._buildingModeArea !== undefined){
          this._buildingModeArea.x = Math.round(this.game.input.worldX / this._tileSize) * this._tileSize;
          this._buildingModeArea.y = offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize;
        }

        var overlap = false;

        this.buildingGroup.forEach(function (group){
          group.forEach(function(building){
            overlap = overlap || this.checkOverlap.call(this, this._buildingModeSprite, building);
          }, this);

        }, this);

        overlap = overlap || this.game.input.mousePointer.x < 6 || this.game.input.mousePointer.x > 640 || this.game.input.mousePointer.y < 44 || this.game.input.mousePointer.y > 539;

        var roadAdjacency = (this._buildingModeType == this.roadGroup);

        this.roadGroup.forEach(function (road){
          roadAdjacency = roadAdjacency || this.checkAdjacency.call(this, this._buildingModeSprite, road);
        }, this);

      var waterObstacle = this.checkObstacles.call(this, this._buildingModeSprite, "water");
      var mountainObstacle = this.checkObstacles.call(this, this._buildingModeSprite, "mountain");


      if(!overlap && !mountainObstacle && (this._buildingModeType == this.roadGroup || (roadAdjacency && this.wood >= this._buildingModeType.wood && this.stone >= this._buildingModeType.stone && !waterObstacle)))
          this._buildingModeSprite.tint = 0xFFFFFF; //el sprite se pone de color normal si se puede construir
        else
          this._buildingModeSprite.tint = 0xFF0000;
      }

      if (this.cursors.up.isDown || this.cursorsAlt.up.isDown){
        this.game.camera.y -= 16;
      
        if (this.mode == 1 && !this.cameraCheckUp)
          this.cameraCheckUp = true;
      }

      else if (this.cursors.down.isDown || this.cursorsAlt.down.isDown){
        this.game.camera.y += 16;
      
        if (this.mode == 1 && !this.cameraCheckDown)
        this.cameraCheckDown = true;
      }

      if (this.cursors.left.isDown || this.cursorsAlt.left.isDown){
        this.game.camera.x -= 16;
      
        if (this.mode == 1 && !this.cameraCheckLeft)
        this.cameraCheckLeft = true; 
      }

      else if (this.cursors.right.isDown || this.cursorsAlt.right.isDown){
        this.game.camera.x += 16;
      
        if (this.mode == 1 && !this.cameraCheckRight)
        this.cameraCheckRight = true;
      }
    }

    this.UIBkg.inputEnabled = !this.cameraCheck;
  },

  saveGame:function()
  {
    var saveObject = {};

    saveObject.buildings = {};

    saveObject.buildings.woodGroup = {};

    
    saveObject.buildings.woodGroup = this.woodGroup.forEach(function(prod){
      return prod.serialize();
    }, this);

    saveObject.buildings.windGroup = this.windGroup.forEach(function(prod){
      return prod.serialize();
    }, this);

    saveObject.buildings.uraniumGroup = this.uraniumGroup.forEach(function(prod){
      return prod.serialize();
    }, this);

    saveObject.buildings.cropGroup = this.cropGroup.forEach(function(prod){
      return prod.serialize();
    }, this);

    saveObject.buildings.stoneGroup = this.stoneGroup.forEach(function(prod){
      return prod.serialize();
    }, this);

    saveObject.buildings.energyGroup = this.energyGroup.forEach(function(prod){
      return prod.serialize();
    }, this);

    saveObject.buildings.hospitalGroup = this.hospitalGroup.forEach(function(prod){
      return prod.serialize();
    }, this);

    saveObject.buildings.houses = this.houseGroup.forEach(function(house){
      return house.serialize();
    }, this);

    saveObject.citizen
    
    // localStorage only works with strings, so JSON.stringify first.
    localStorage.setItem("save", JSON.stringify(saveObject));
    //save buildings
    //save houses (con esto ya se guardan los ciudadanos (?))
  },

  loadGame:function()
  {
    localStorage.getItem("save");
    //load buildings
    //load houses (con esto ya se guardan los ciudadanos (?))

    //update arrays
  },

  render: function() {
    /*this.game.debug.text("Current speed: " + this.timeScale, 10, 485);
    this.game.debug.text("Food: " + this.food, 10, 500);
    this.game.debug.text("Game paused: " + this.paused, 10, 515);    
    var mode = "NONE";
    if(this._buildModeActive)
      mode = "building";
    else if(this._destroyModeActive)
      mode = "destroying";

    this.game.debug.text("Current mode: " + mode, 10, 530);

    this.game.debug.text("Current time: " + this.currentTime.hour + ":00", 10, 545);

    if(this.currentTime.hour >= this.shiftStart && this.currentTime.hour<= this.shiftEnd)
      this.game.debug.text("WORK TIME!!", 10, 560);
    
    var aux = 0;

    this.houseGroup.forEach(function(house){aux += house.countCitizens();});
    this.game.debug.text("Citizens in homes: " + aux, 10, 575);

    this.game.debug.text("Homeless citizens: " + this.homelessArray.length, 10, 590);*/
  }
};

module.exports = PlayScene;
