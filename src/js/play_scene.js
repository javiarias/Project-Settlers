'use strict';
var Classes = require("./buildings.js");
var Phasetips = require("./Phasetips.js");

var PlayScene = {

  init: function(data, loadingSave)
  {
    this.mode = data;

    this.loading = loadingSave;
  },

  create: function () {
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

    if(!this.game.gameMusic){
      this.game.gameMusic = this.game.add.audio('gameSound', 1, true);
      this.game.gameMusic.loop = true;
    }

    if(!this.game.gameMusic.isPlaying){
      this.game.gameMusic.play();
      this.game.gameMusic.volume = this.game.volume / 100;
    }

  //////////////////////////////
  //misc. variables
    this.names = ["Tatiana", "Olga", "Elena", "Svetlana", "Irina", "Ekaterina", "Anna", "Kaja", "Natalia", "Anastasía", "Marina", "Sergey", "Alexandr", "Alexey", "Andrey", "Vladímir", "Iosif", "Dmitry", "Nikolay", "Yuri", "Oleg"];
    this.surnames = ["Smirnov", "Ivanov", "Kuznetsov", "Popov", "Sokolov", "Lébedev", "Kozlov", "Nóvikov", "Morózov", "Petrov", "Vólkov", "Solovióv", "Vasíliev", "Záitsev", "Pávlov", "Semiónov", "Gólubev", "Vinográdov", "Bogdánov", "Vorobiov", "Korsakov"];

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
    this.roadBuilding = false;
    this.fade;

    this._buildingModeSprite;
    this._buildingModeType = "";
    this._buildingModeArea;

    this.roadSpriteStack = [];
    for(var i = 0; i < 40; i++){
      var aux = this.game.add.sprite(0, 0, "Road");
      aux.visible = false;
      aux.anchor.setTo(.5, .5);
      aux.alpha = 0.7;

      this.roadSpriteStack.push(aux);
    }

    this.roadSpriteVisible = [];
    this.currentRoadAngle = 0;

  //////////////////////////////
  //Resources
    if (this.mode == 0){
      this.food = 100;
      this.wood = 75;
      this.uranium = 0;
      this.energy = 0;
      this.water = 100;
      this.stone = 75;
    }

    else if (this.mode == 1){
      this.food = 999;
      this.wood = 999;
      this.uranium = 0;
      this.energy = 0;
      this.water = 999;
      this.stone = 999;
    }

    this.foodGain = 0;
    this.woodGain = 0;
    this.uraniumGain = 0;
    this.energyGain = 0;
    this.waterGain = 0;
    this.stoneGain = 0;

    this.citizenConsume = 3;
    this.homelessConsume = 5;

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
    this.waterGroup.produce = 3;

    this.cropGroup = this.game.add.group();
    this.buildingGroup.add(this.cropGroup);
    this.cropGroup.sprite = 'Crops';
    this.cropGroup.stone = 10;
    this.cropGroup.wood = 10;
    this.cropGroup.consume = 1;
    this.cropGroup.produce = 3;

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
    this.energyGroup.stone = 35;
    this.energyGroup.wood = 30;
    this.energyGroup.consume = 2;
    this.energyGroup.produce = 10;

    this.windGroup = this.game.add.group();
    this.buildingGroup.add(this.windGroup);
    this.windGroup.sprite = 'Wind';
    this.windGroup.stone = 35;
    this.windGroup.wood = 30;
    this.windGroup.produce = 5;

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
    pauseSettings.onDownSound = this.game.buttonSound;
    pauseSettings.input.priorityID = 2;
    this.pauseMenu.add(pauseSettings);

    var pauseMinimize = this.game.add.button(pauseBkg.x, pauseBkg.y + 3, "minBttn", this.escape, this, 0, 0, 1);
    pauseMinimize.anchor.setTo(0.5, 0.5);
    pauseMinimize.fixedToCamera = true;
    pauseMinimize.smoothed = false;
    pauseMinimize.onDownSound = this.game.buttonSound;
    pauseMinimize.input.priorityID = 2;
    this.pauseMenu.add(pauseMinimize);

    if (this.mode == 0)
    {
      var saveBttn = this.game.add.button(pauseBkg.x + 72, pauseBkg.y + 3, "saveBttn", function(){this.saveGame(); this.game.gameMusic.stop(); this.game.state.start('main');}, this, 0, 0, 1);
      saveBttn.anchor.setTo(0.5, 0.5);
      saveBttn.fixedToCamera = true;
      saveBttn.smoothed = false;
      saveBttn.onDownSound = this.game.buttonSound;
      saveBttn.input.priorityID = 2;
      this.pauseMenu.add(saveBttn);
    }

    else if (this.mode == 1)
    {
      var pauseExit = this.game.add.button(pauseBkg.x + 72, pauseBkg.y + 3, "exitBttn", function(){this.game.gameMusic.stop();this.game.state.start('main');}, this, 0, 0, 1);
      pauseExit.anchor.setTo(0.5, 0.5);
      pauseExit.fixedToCamera = true;
      pauseExit.smoothed = false;
      pauseExit.onDownSound = this.game.buttonSound;
      pauseExit.input.priorityID = 2;
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

    var volumeText = this.game.add.text(optionsBkg.x, optionsBkg.y - 20, this.game.volume, {font: "50px console"});
    volumeText.anchor.setTo(0.5, 0.5);
    volumeText.fixedToCamera = true;
    volumeText.smoothed = false;
    this.optionsMenu.add(volumeText);

    var optionsMinus = this.game.add.button(optionsBkg.x - 77, optionsBkg.y - 20, "minusBttn", function(){updateVolume.call(this, -5);}, this, 0, 0, 1);
    optionsMinus.anchor.setTo(0.5, 0.5);
    optionsMinus.fixedToCamera = true;
    optionsMinus.smoothed = false;
    optionsMinus.onDownSound = this.game.buttonSound;
    optionsMinus.input.priorityID = 2;
    this.optionsMenu.add(optionsMinus);
    
    var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){updateVolume.call(this, 5);}, this, 0, 0, 1);
    optionsPlus.anchor.setTo(0.5, 0.5);
    optionsPlus.fixedToCamera = true;
    optionsPlus.smoothed = false;
    optionsPlus.onDownSound = this.game.buttonSound;
    optionsPlus.input.priorityID = 2;
    this.optionsMenu.add(optionsPlus);

    var optionsBack = this.game.add.button(optionsBkg.x - 47, optionsBkg.y + 48, "backBttn", function(){this.optionsMenu.visible = false; this.pauseMenu.visible = true; this.game.world.bringToTop(this.pauseMenu);}, this, 0, 0, 1);
    optionsBack.anchor.setTo(0.5, 0.5);
    optionsBack.fixedToCamera = true;
    optionsBack.smoothed = false;
    optionsBack.onDownSound = this.game.buttonSound;
    optionsPlus.input.priorityID = 2;
    this.optionsMenu.add(optionsBack);

    var optionsMute = this.game.add.button(optionsBkg.x + 47, optionsBkg.y + 48, "muteBttn", function(){mute.call(this);}, this, 0, 0, 1);
    optionsMute.anchor.setTo(0.5, 0.5);
    optionsMute.fixedToCamera = true;
    optionsMute.smoothed = false;
    optionsMute.onDownSound = this.game.buttonSound;
    optionsMute.input.priorityID = 2;
    this.optionsMenu.add(optionsMute);

    this.optionsMenu.visible = false;

    function updateVolume(update){
      if(this.game.volume + update >= 0 && this.game.volume + update <= 100){

        this.game.volume += update;
        this.game.gameMusic.volume = this.game.volume / 100;

        this.optionsMenu.forEach(function(text){
          if (text.text !== null)
            text.text = this.game.volume;
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
    this.UIBkg.inputEnabled = true;
    this.UIBkg.input.useHandCursor = false;

    this.UI.add(this.UIBkg);

  //////////////////////////////
  //UI buttons

    var escapeBttn = this.game.add.button(this.UIBkg.right - 5, 5, "exitBttn", function(){this.escape();}, this, 0, 0, 1);
    escapeBttn.anchor.setTo(1, 0);
    escapeBttn.fixedToCamera = true;
    escapeBttn.smoothed = false;
    escapeBttn.scale.setTo(0.7, 0.7);
    escapeBttn.onDownSound = this.game.buttonSound;
    escapeBttn.input.priorityID = 2;
    this.UI.add(escapeBttn);

    var numberOfButtons = 11;
    var buttonX = 55;
    var buttonLimit = 637;
    var scale = 1;
    if(buttonLimit < 60 * numberOfButtons)
      scale = buttonLimit / ((buttonX + 5) * numberOfButtons);

    var buttonOffset = buttonLimit / numberOfButtons - (buttonX * scale) + (buttonX * scale)/2; // 11 = número de botones, 55 = tamaño x del botón
    

    this.roadBttn = this.game.add.button(5 + buttonOffset - (buttonOffset - (55 * scale)/2)/2, this.UIBkg.bottom - 30, "roadBttn", function(){this.buildMode(this, this.roadGroup);}, this, 0, 0, 1);
    this.roadBttn.anchor.setTo(.5, .5);
    this.roadBttn.fixedToCamera = true;
    this.roadBttn.smoothed = false;
    this.roadBttn.scale.setTo(scale, scale);
    this.roadBttn.onDownSound = this.game.buttonSound;
    this.roadBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.roadBttn.visible = false;
      this.roadBttn.input.enabled = false;
    }
    this.UI.add(this.roadBttn);

    this.houseBttn = this.game.add.button(this.roadBttn.right + buttonOffset, this.roadBttn.centerY, "houseBttn", function(){this.buildMode(this, this.houseGroup);}, this, 0, 0, 1);
    this.houseBttn.anchor.setTo(.5, .5);
    this.houseBttn.fixedToCamera = true;
    this.houseBttn.smoothed = false;
    this.houseBttn.scale.setTo(scale, scale);
    this.houseBttn.onDownSound = this.game.buttonSound;
    this.houseBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.houseBttn.visible = false;
      this.houseBttn.input.enabled = false;
    }
    this.UI.add(this.houseBttn);

    this.waterBttn = this.game.add.button(this.houseBttn.right + buttonOffset, this.roadBttn.centerY, "waterBttn", function(){this.buildMode(this, this.waterGroup);}, this, 0, 0, 1);
    this.waterBttn.anchor.setTo(.5, .5);
    this.waterBttn.fixedToCamera = true;
    this.waterBttn.smoothed = false;
    this.waterBttn.scale.setTo(scale, scale);
    this.waterBttn.onDownSound = this.game.buttonSound;
    this.waterBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.waterBttn.visible = false;
      this.waterBttn.input.enabled = false;
    }
    this.UI.add(this.waterBttn);

    this.cropBttn = this.game.add.button(this.waterBttn.right + buttonOffset,  this.roadBttn.centerY, "cropBttn", function(){this.buildMode(this, this.cropGroup);}, this, 0, 0, 1);
    this.cropBttn.anchor.setTo(.5, .5);
    this.cropBttn.fixedToCamera = true;
    this.cropBttn.smoothed = false;
    this.cropBttn.scale.setTo(scale, scale);
    this.cropBttn.onDownSound = this.game.buttonSound;
    this.cropBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.cropBttn.visible = false;
      this.cropBttn.input.enabled = false;
    }
    this.UI.add(this.cropBttn);

    this.woodBttn = this.game.add.button(this.cropBttn.right + buttonOffset,  this.roadBttn.centerY, "woodBttn", function(){this.buildMode(this, this.woodGroup);}, this, 0, 0, 1);
    this.woodBttn.anchor.setTo(.5, .5);
    this.woodBttn.fixedToCamera = true;
    this.woodBttn.smoothed = false;
    this.woodBttn.scale.setTo(scale, scale);
    this.woodBttn.onDownSound = this.game.buttonSound;
    this.woodBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.woodBttn.visible = false;
      this.woodBttn.input.enabled = false;
    }
    this.UI.add(this.woodBttn);

    this.stoneBttn = this.game.add.button(this.woodBttn.right + buttonOffset,  this.roadBttn.centerY, "stoneBttn", function(){this.buildMode(this, this.stoneGroup);}, this, 0, 0, 1);
    this.stoneBttn.anchor.setTo(.5, .5);
    this.stoneBttn.fixedToCamera = true;
    this.stoneBttn.smoothed = false;
    this.stoneBttn.scale.setTo(scale, scale);
    this.stoneBttn.onDownSound = this.game.buttonSound;
    this.stoneBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.stoneBttn.visible = false;
      this.stoneBttn.input.enabled = false;
    }
    this.UI.add(this.stoneBttn);

    this.uraniumBttn = this.game.add.button(this.stoneBttn.right + buttonOffset,  this.roadBttn.centerY, "uraniumBttn", function(){this.buildMode(this, this.uraniumGroup);}, this, 0, 0, 1);
    this.uraniumBttn.anchor.setTo(.5, .5);
    this.uraniumBttn.fixedToCamera = true;
    this.uraniumBttn.smoothed = false;
    this.uraniumBttn.scale.setTo(scale, scale);
    this.uraniumBttn.onDownSound = this.game.buttonSound;
    this.uraniumBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.uraniumBttn.visible = false;
      this.uraniumBttn.input.enabled = false;
    }
    this.UI.add(this.uraniumBttn);

    this.energyBttn = this.game.add.button(this.uraniumBttn.right + buttonOffset,  this.roadBttn.centerY, "energyBttn", function(){this.buildMode(this, this.energyGroup);}, this, 0, 0, 1);
    this.energyBttn.anchor.setTo(.5, .5);
    this.energyBttn.fixedToCamera = true;
    this.energyBttn.smoothed = false;
    this.energyBttn.scale.setTo(scale, scale);
    this.energyBttn.onDownSound = this.game.buttonSound;
    this.energyBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.energyBttn.visible = false;
      this.energyBttn.input.enabled = false;
    }
    this.UI.add(this.energyBttn);

    this.windBttn = this.game.add.button(this.energyBttn.right + buttonOffset,  this.roadBttn.centerY, "windBttn", function(){this.buildMode(this, this.windGroup);}, this, 0, 0, 1);
    this.windBttn.anchor.setTo(.5, .5);
    this.windBttn.fixedToCamera = true;
    this.windBttn.smoothed = false;
    this.windBttn.scale.setTo(scale, scale);
    this.windBttn.onDownSound = this.game.buttonSound;
    this.windBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.windBttn.visible = false;
      this.windBttn.input.enabled = false;
    }
    this.UI.add(this.windBttn);

    this.hospitalBttn = this.game.add.button(this.windBttn.right + buttonOffset,  this.roadBttn.centerY, "hospitalBttn", function(){this.buildMode(this, this.hospitalGroup);}, this, 0, 0, 1);
    this.hospitalBttn.anchor.setTo(.5, .5);
    this.hospitalBttn.fixedToCamera = true;
    this.hospitalBttn.smoothed = false;
    this.hospitalBttn.scale.setTo(scale, scale);
    this.hospitalBttn.onDownSound = this.game.buttonSound;
    this.hospitalBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.hospitalBttn.visible = false;
      this.hospitalBttn.input.enabled = false;
    }
    this.UI.add(this.hospitalBttn);

    this.bulldozeBttn = this.game.add.button(this.hospitalBttn.right + buttonOffset,  this.roadBttn.centerY, "bulldozeBttn", function(){this.destroyMode();}, this, 0, 0, 1);
    this.bulldozeBttn.anchor.setTo(.5, .5);
    this.bulldozeBttn.fixedToCamera = true;
    this.bulldozeBttn.smoothed = false;
    this.bulldozeBttn.scale.setTo(scale, scale);
    this.bulldozeBttn.onDownSound = this.game.buttonSound;
    this.bulldozeBttn.input.priorityID = 2;
    if (this.mode == 1)
    {
      this.bulldozeBttn.visible = false;
      this.bulldozeBttn.input.enabled = false;
    }
    this.UI.add(this.bulldozeBttn);

  //////////////////////////////
  //UI Txt

    this.timeTxtGroup = this.game.add.group();

    this.timeTxt = this.game.add.text(719, 50, this.currentTime.hour + ":00", {font: "50px console", fill: "red"});
    this.timeTxt.anchor.setTo(.5, 0);
    this.timeTxt.fixedToCamera = true;
    this.timeTxt.smoothed = false;

    this.timeTxtGroup.add(this.timeTxt);

    this.timescaleTxt = this.game.add.text(this.timeTxt.x, this.timeTxt.bottom + 5, "Speed: " + this.timeScale, {font: "30px console"});
    this.timescaleTxt.anchor.setTo(.5, 0);
    this.timescaleTxt.fixedToCamera = true;
    this.timescaleTxt.smoothed = false;

    this.timeTxtGroup.add(this.timescaleTxt);

    if(this.mode == 1)
      this.timeTxtGroup.visible = false;

    this.UI.add(this.timeTxtGroup);

  //////////////////////////////
  //UI Resources

    this.foodTxtGroup = this.game.add.group();

    this.foodIcon = this.game.add.sprite(this.timeTxt.left, this.timescaleTxt.bottom + 350/5, "cropIcon");
    this.foodIcon.anchor.setTo(1, 0);
    this.foodIcon.fixedToCamera = true;
    this.foodIcon.smoothed = false;
    this.foodIcon.inputEnabled = true;
    this.foodIcon.input.useHandCursor = false;
    this.foodIcon.input.priorityID = 1;

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

    if(this.mode == 1)
      this.foodTxtGroup.visible = false;

    this.UI.add(this.foodTxtGroup);

  ///////////////

    this.waterTxtGroup = this.game.add.group();

    this.waterIcon = this.game.add.sprite(this.foodIcon.centerX + 10, this.foodIcon.bottom + 7, "waterIcon");
    this.waterIcon.anchor.setTo(1, 0);
    this.waterIcon.fixedToCamera = true;
    this.waterIcon.smoothed = false;
    this.waterIcon.inputEnabled = true;
    this.waterIcon.input.useHandCursor = false;
    this.waterIcon.input.priorityID = 1;

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

    if(this.mode == 1)
      this.waterTxtGroup.visible = false;

    this.UI.add(this.waterTxtGroup);

  ///////////////

    this.woodTxtGroup = this.game.add.group();

    this.woodIcon = this.game.add.sprite(this.foodIcon.centerX, this.waterIcon.bottom + 7, "woodIcon");
    this.woodIcon.anchor.setTo(.5, 0);
    this.woodIcon.fixedToCamera = true;
    this.woodIcon.smoothed = false;
    this.woodIcon.inputEnabled = true;
    this.woodIcon.input.useHandCursor = false;
    this.woodIcon.input.priorityID = 1;

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

    if(this.mode == 1)
      this.woodTxtGroup.visible = false;

    this.UI.add(this.woodTxtGroup);

  ///////////////

    this.stoneTxtGroup = this.game.add.group();

    this.stoneIcon = this.game.add.sprite(this.foodIcon.centerX, this.woodIcon.bottom + 7, "stoneIcon");
    this.stoneIcon.anchor.setTo(.5, 0);
    this.stoneIcon.fixedToCamera = true;
    this.stoneIcon.smoothed = false;
    this.stoneIcon.inputEnabled = true;
    this.stoneIcon.input.useHandCursor = false;
    this.stoneIcon.input.priorityID = 1;
    
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

    if(this.mode == 1)
      this.stoneTxtGroup.visible = false;

    this.UI.add(this.stoneTxtGroup);

  ///////////////

    this.uraniumTxtGroup = this.game.add.group();

    this.uraniumIcon = this.game.add.sprite(this.foodIcon.centerX, this.stoneIcon.bottom + 7, "uraniumIcon");
    this.uraniumIcon.anchor.setTo(.5, 0);
    this.uraniumIcon.fixedToCamera = true;
    this.uraniumIcon.smoothed = false;
    this.uraniumIcon.inputEnabled = true;
    this.uraniumIcon.input.useHandCursor = false;
    this.uraniumIcon.input.priorityID = 1;

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

    if(this.mode == 1)
      this.uraniumTxtGroup.visible = false;

    this.UI.add(this.uraniumTxtGroup);

  ///////////////

    this.energyTxtGroup = this.game.add.group();

    this.energyIcon = this.game.add.sprite(this.foodIcon.centerX, this.uraniumIcon.bottom + 7, "energyIcon");
    this.energyIcon.anchor.setTo(.5, 0);
    this.energyIcon.fixedToCamera = true;
    this.energyIcon.smoothed = false;
    this.energyIcon.inputEnabled = true;
    this.energyIcon.input.useHandCursor = false;
    this.energyIcon.input.priorityID = 1;

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

    if(this.mode == 1)
      this.energyTxtGroup.visible = false;

    this.UI.add(this.energyTxtGroup);

  ///////////////

    this.citizensTxtGroup = this.game.add.group();

    this.citizensIcon = this.game.add.sprite(this.foodIcon.centerX, this.stoneIcon.bottom + 550/5, "citizenIcon");
    this.citizensIcon.anchor.setTo(.5, 0);
    this.citizensIcon.fixedToCamera = true;
    this.citizensIcon.smoothed = false;
    this.citizensIcon.inputEnabled = true;
    this.citizensIcon.input.useHandCursor = false;
    this.citizensIcon.input.priorityID = 1;
    
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

    if(this.mode == 1)
      this.citizensTxtGroup.visible = false;

    this.UI.add(this.citizensTxtGroup);

  ///////////////

    this.homelessTxtGroup = this.game.add.group();

    this.homelessIcon = this.game.add.sprite(this.foodIcon.centerX, this.citizensIcon.bottom + 7, "noHouseIcon");
    this.homelessIcon.anchor.setTo(.5, 0);
    this.homelessIcon.fixedToCamera = true;
    this.homelessIcon.smoothed = false;
    this.homelessIcon.inputEnabled = true;
    this.homelessIcon.input.useHandCursor = false;
    this.homelessIcon.input.priorityID = 1;

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

    if(this.mode == 1)
      this.homelessTxtGroup.visible = false;

    this.UI.add(this.homelessTxtGroup);

  ///////////////

    this.unemployedTxtGroup = this.game.add.group();

    this.unemployedIcon = this.game.add.sprite(this.foodIcon.centerX, this.homelessIcon.bottom + 7, "joblessIcon");
    this.unemployedIcon.anchor.setTo(.5, 0);
    this.unemployedIcon.fixedToCamera = true;
    this.unemployedIcon.smoothed = false;
    this.unemployedIcon.inputEnabled = true;
    this.unemployedIcon.input.useHandCursor = false;
    this.unemployedIcon.input.priorityID = 1;
    
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

    if(this.mode == 1)
      this.unemployedTxtGroup.visible = false;

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
      width: 270,
      height: 100,
      context: "Hospital:\n  Used to heal your citizens.\nCost:\n  25 Wood, 25 Stone, 4 daily energy",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipBulldoze = new Phasetips(this.game, {
      targetObject: this.bulldozeBttn,
      width: 400,
      height: 60,
      context: "Bulldozer:\n  Used to destroy buildings and\n  roads, returns some resources",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

  //////////////////////////////
  //Tutorial tooltips

    if (this.mode == 1){

      this.tipTutorial1 = new Phasetips(this.game, {
        targetObject: this.UIBkg, 
        context: "Welcome to Project Settlers! \nAs a research subject in the project, your job will be to test this new and incredible software, and thus help the government! \n\nPlease note that payment won't be provided unless you manage to \"win\", contact your nearest overseer for more information. \n\n\nFirst, to move the camera around you'll need to use the WASD keys",
        x: this.game.camera.x + this.game.camera.width / 2 - 130,
        y: this.game.camera.y + this.game.camera.height / 2 - 180,
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
        context: "Roads are the core of Project Settlers, as they allow you to build above them and across bodies of water",
        width: 100,
        height: 120,
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
        context: "Energy is a need. Without energy to power your buildings, their production will be halved! \nWith this you can produce energy from uranium",
        width: 250,
        height: 170,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialWind = new Phasetips(this.game, {
        targetObject: this.windBttn,
        context: "This building allows you to obtain energy without uranium, thanks to the power of wind",
        width: 250,
        height: 115,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialHospital = new Phasetips(this.game, {
        targetObject: this.hospitalBttn,
        context: "Hospitals allow you to improve the health of citizens. Sadly, energy is required for them to work",
        width: 315,
        height: 125,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });
    
      this.tipTutorialBulldoze = new Phasetips(this.game, {
        targetObject: this.bulldozeBttn,
        context: "If you want to replace a building, you should bulldoze it first. You'll get some of the resources you spent building it back.",
        width: 420,
        height: 90,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 85,  
        animation: "fade"
      });
    
      this.tipTutorialTime = new Phasetips(this.game, {
        targetObject: this.timeTxt,
        context: "Now you know the basic mechanics to survive. Press SPACE to get the clock running, and 1, 2 or 3 to change the speed. \nKeep testing if you want to, or jump right into the real simulation by exiting this tutorial with the Esc key",
        width: 200,
        height: -30,
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 100,   
        animation: "fade"
      });
    }
    
  //////////////////////////////
  //Keys and inputs
    var key_One = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key_One.onDown.add(this.setTimescale, this);

    var key_Two = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key_Two.onDown.add(this.setTimescale, this);

    var key_Three = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key_Three.onDown.add(this.setTimescale, this);

    var key_Space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key_Space.onDown.add(this.pauseTime, this);

    var key_ESC = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    key_ESC.onDown.add(this.escape, this);

    this.game.input.onDown.add(this.click, this);

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
  //initialitzation of a new game

    if(!this.loading){
      for(var i = 0; i < 5; i++)
        var citizen = new Classes.Citizen(this.homelessArray, this.unemployedArray, this.names, this.surnames, 20);
    }

  //////////////////////////////
  //loading a saved game

    else 
      this.loadGame();
  },


  update: function () {
    if (this.mode == 1)
    {
      this.tutorialCheck();
    }

    if(!this._escapeMenu) {
      if(!this.paused){
        this.currentTime.buffer += this.timeScale; //buffer increment

        if (this.currentTime.buffer >= 20) { //if buffer > 20, update. AKA, speed 1 = every 20 loops, speed 2 = every 10 loops... etc.
          
        ////////////////////////////////////////
        //update time
          this.currentTime.buffer = 0;

          this.currentTime.hour = (this.currentTime.hour + 1) % 24; 

        ////////////////////////////////////////
        //work time update
          if(this.currentTime.hour >= this.shiftStart && this.currentTime.hour < this.shiftEnd){
        
            this.timeTxt.addColor("#008500", 0);

            this.updateBuildings();
          }

        ////////////////////////////////////////
        //citizen update
          else if(this.currentTime.hour == 0){
            
            this.timeTxt.addColor("#000000", 0);

            this.tickCitizens();
          }

          else
            this.timeTxt.addColor("#000000", 0);

        ////////////////////////////////////////
        //try to place citizens in houses/buildings, update the gain and the clock

          this.updateCitizenArrays();

          this.updateGain();

          this.timeTxt.text = this.currentTime.hour + ":00";
        }
      }

      else if(this._buildModeActive){

        if(this.roadBuilding) {

          var auxAngle;
          
          auxAngle = this.getFixedAngle(this._buildingModeSprite, this.game.input);

          this.currentRoadAngle = auxAngle
          
          this.placeRoadGuide();
        }

        else {

          var offset = 0;

          if((this._buildingModeSprite.height / 16) % 2 == 0)
            offset = 8;

          this._buildingModeSprite.x = Math.round(this.game.input.worldX / this._tileSize) * this._tileSize;
          this._buildingModeSprite.y = offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize;

          if(this._buildingModeArea !== undefined){
            this._buildingModeArea.x = Math.round(this.game.input.worldX / this._tileSize) * this._tileSize;
            this._buildingModeArea.y = offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize;
          }
          
          if(this.buildAllowed(this._buildingModeSprite))
            this._buildingModeSprite.tint = 0xFFFFFF;
          else
            this._buildingModeSprite.tint = 0xFF0000;
        }
      }

      this.cameraMovement();

      this.checkEndGame();
    }
  },

  saveGame: function()
  {
    var saveObject = {};

    saveObject.buildings = {};

    saveObject.buildings.roadGroup = this.roadGroup.children.map(function(prod){
      return JSON.parse(prod.serialize());
    }, this);
    
    saveObject.buildings.waterGroup = this.waterGroup.children.map(function(prod){
      return JSON.parse(prod.serialize());
    }, this);
    
    saveObject.buildings.woodGroup = this.woodGroup.children.map(function(prod){
      return JSON.parse(prod.serialize());
    }, this);

    saveObject.buildings.windGroup = this.windGroup.children.map(function(prod){
      return JSON.parse(prod.serialize());
    }, this);

    saveObject.buildings.uraniumGroup = this.uraniumGroup.children.map(function(prod){
      return JSON.parse(prod.serialize());
    }, this);

    saveObject.buildings.cropGroup = this.cropGroup.children.map(function(prod){
      return JSON.parse(prod.serialize());
    }, this);

    saveObject.buildings.stoneGroup = this.stoneGroup.children.map(function(prod){
      return JSON.parse(prod.serialize());
    }, this);

    saveObject.buildings.energyGroup = this.energyGroup.children.map(function(prod){
      return JSON.parse(prod.serialize());
    }, this);

    saveObject.buildings.hospitalGroup = this.hospitalGroup.children.map(function(prod){
      return JSON.parse(prod.serialize());
    }, this);

    saveObject.buildings.houseGroup = this.houseGroup.children.map(function(house){
      return JSON.parse(house.serialize());
    }, this);

    saveObject.citizens = this.houseGroup.children.map(function(house){
      return JSON.parse(house.serializeCitizens());
    }, this);

    saveObject.homeless = this.homelessArray.map(function(citizen){
      return JSON.parse(citizen.serialize());
    }, this);

    saveObject.variables = {};

    saveObject.variables.food = this.food;

    saveObject.variables.wood = this.wood;

    saveObject.variables.uranium = this.uranium;

    saveObject.variables.energy = this.energy;

    saveObject.variables.water = this.water;

    saveObject.variables.stone = this.stone;

    saveObject.variables.currentTime = this.currentTime;

    saveObject.variables.volume = this.game.volume;
    

    localStorage.setItem("save", JSON.stringify(saveObject));
  },

  loadGame:function()
  {
    var state = localStorage.getItem("save");

    var saveobject = JSON.parse(state);

    saveobject.buildings.roadGroup.forEach(function(prod){
      var auxBuilding = Classes.Road.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.roadGroup.add(auxBuilding);
    }, this);
    
    saveobject.buildings.woodGroup.forEach(function(prod){
      var auxBuilding = Classes.Producer.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.woodGroup.add(auxBuilding);
    }, this);

    saveobject.buildings.waterGroup.forEach(function(prod){
      var auxBuilding = Classes.Producer.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.waterGroup.add(auxBuilding);
    }, this);
    
    saveobject.buildings.windGroup.forEach(function(prod){
      var auxBuilding = Classes.Producer.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.windGroup.add(auxBuilding);
    }, this);
    
    saveobject.buildings.uraniumGroup.forEach(function(prod){
      var auxBuilding = Classes.Producer.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.uraniumGroup.add(auxBuilding);
    }, this);
    
    saveobject.buildings.cropGroup.forEach(function(prod){
      var auxBuilding = Classes.Producer.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.cropGroup.add(auxBuilding);
    }, this);
    
    saveobject.buildings.stoneGroup.forEach(function(prod){
      var auxBuilding = Classes.Producer.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.stoneGroup.add(auxBuilding);
    }, this);
    
    saveobject.buildings.energyGroup.forEach(function(prod){
      var auxBuilding = Classes.Producer.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.energyGroup.add(auxBuilding);
    }, this);
    
    saveobject.buildings.hospitalGroup.forEach(function(prod){
      var auxBuilding = Classes.Hospital.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.hospitalGroup.add(auxBuilding);
    }, this);
    
    saveobject.buildings.houseGroup.forEach(function(prod){
      var auxBuilding = Classes.House.unserialize(prod, this.game);

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      this.houseGroup.add(auxBuilding);
    }, this);

    saveobject.citizens.forEach(function(citizen){
      var auxCitizen;

      if(citizen.residentA)
        auxCitizen = Classes.Citizen.unserialize(citizen.residentA, this.homelessArray, this.unemployedArray, this.names, this.surnames, this.houseGroup, this.buildingGroup);
      if(citizen.residentB)
        auxCitizen = Classes.Citizen.unserialize(citizen.residentB, this.homelessArray, this.unemployedArray, this.names, this.surnames, this.houseGroup, this.buildingGroup);

    }, this);

    saveobject.homeless.forEach(function(citizen){
      var auxCitizen = Classes.Citizen.unserialize(citizen, this.homelessArray, this.unemployedArray, this.names, this.surnames, this.houseGroup, this.buildingGroup);
    }, this);

    this.food = JSON.parse(saveobject.variables.food);

    this.wood = JSON.parse(saveobject.variables.wood);

    this.uranium = JSON.parse(saveobject.variables.uranium);

    this.energy = JSON.parse(saveobject.variables.energy);

    this.water = JSON.parse(saveobject.variables.water);

    this.stone = JSON.parse(saveobject.variables.stone);

    this.currentTime = saveobject.variables.currentTime;
    this.timeTxt.text = this.currentTime.hour + ":00";

    this.game.volume = JSON.parse(saveobject.variables.volume);
    this.game.gameMusic.volume = this.game.volume / 100;

    this.optionsMenu.forEach(function(text){
      if (text.text !== null)
        text.text = this.game.volume;
      }, this);
    

    this.foodTxt.text = this.food;
    this.woodTxt.text = this.wood;
    this.stoneTxt.text = this.stone;
    this.waterTxt.text = this.water;
    this.energyTxt.text = this.energy;
    this.uraniumTxt.text = this.uranium;
    this.houseGroup.forEach(function (house) { house.updateHospitals(this.hospitalGroup)}, this);
  },

  updateBuildings: function(){

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
          this.houseGroup.forEach(function (house) { house.updateSingleHospital(prod); }, this);
          prod.off = false
          prod.updateTooltip();
        }
      }
      
      else{
        if(!prod.off){
          this.houseGroup.forEach(function (house) { house.updateSingleHospital(prod); }, this);
          prod.off = true;
          prod.updateTooltip();
        }
      }
    }, this);

    this.foodTxt.text = this.food;
    this.woodTxt.text = this.wood;
    this.stoneTxt.text = this.stone;
    this.waterTxt.text = this.water;
    this.energyTxt.text = this.energy;
    this.uraniumTxt.text = this.uranium;
  },

  tickCitizens: function(){

    this.houseGroup.forEach(function(prod){
      prod.tick(this.food, this.water);

      var count = prod.countCitizens();

      if(this.food >= this.citizenConsume * count)
        this.food -= this.citizenConsume * count;
      if(this.water >= this.citizenConsume * count)
        this.water -= this.citizenConsume * count;

      for(var i = prod.numberOfBirths; i > 0; i--)
        var aux = new Classes.Citizen(this.homelessArray, this.unemployedArray, this.names, this.surnames);
    }, this);

    for (var i = this.homelessArray.length - 1; i >= 0; i--) {
      this.homelessArray[i].tick(this.food, this.water, false);
      if(this.food >= this.homelessConsume)
        this.food -= this.homelessConsume;
      if(this.water >= this.homelessConsume)
        this.water -= this.homelessConsume;
    }
  
    this.foodTxt.text = this.food;
    this.waterTxt.text = this.water;
  },

  updateCitizenArrays: function(){
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
  },

  cameraMovement: function(){
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
  },

  checkEndGame: function(){

    var aux = this.homelessArray.length;

    this.houseGroup.forEach(function(house){aux += house.countCitizens();});
    
    if (aux == 0)
    {
      this.game.gameMusic.stop();
      this.game.state.start('defeat', true, false, 0);
    }

    else if (aux == 1000000)
    {
      this.game.gameMusic.stop();
      this.game.state.start('win', true, false, 1);
    }
  },

  tutorialCheck: function(){
    
    if (this.cameraCheckUp && this.cameraCheckDown && this.cameraCheckLeft && this.cameraCheckRight)
        this.cameraCheck = true;

    if (this.cameraCheck)
    {
      this.citizensTxtGroup.visible = true;
      this.homelessTxtGroup.visible = true;
      this.unemployedTxtGroup.visible = true;
      this.roadCheck = true;
      this.tipTutorial1.destroy();
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
      this.waterTxtGroup.visible = true;
    }

    if (this.cropCheck)
    {
      this.cropBttn.visible = true;
      this.cropBttn.input.enabled = true;
      this.foodTxtGroup.visible = true;
    }

    if (this.woodCheck)
    {
      this.woodBttn.visible = true;
      this.woodBttn.input.enabled = true;
      this.woodTxtGroup.visible = true;
    }

    if (this.stoneCheck)
    {
      this.stoneBttn.visible = true;
      this.stoneBttn.input.enabled = true;
      this.stoneTxtGroup.visible = true;
    }

    if (this.uraniumCheck) 
    {
      this.uraniumBttn.visible = true;
      this.uraniumBttn.input.enabled = true;
      this.uraniumTxtGroup.visible = true;
    }

    if (this.energyCheck) 
    {
      this.energyBttn.visible = true;
      this.energyBttn.input.enabled = true;
      this.energyTxtGroup.visible = true;
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
  },

  updateGain: function(){

    var aux = this.homelessArray.length;

    this.houseGroup.forEach(function(house){aux += house.countCitizens();});


    this.homelessTxt.text = this.homelessArray.length;
    this.unemployedTxt.text = this.unemployedArray.length;
    this.citizensTxt.text = aux;

    this.foodGain = 0;
    this.cropGroup.forEach(function(prod){this.foodGain += prod.amount * (this.shiftEnd - this.shiftStart)}, this);
    this.foodGain -= (this.homelessArray.length * this.homelessConsume + (aux - this.homelessArray.length ) * this.citizenConsume);
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
    this.waterGain -= (this.homelessArray.length * this.homelessConsume + (aux - this.homelessArray.length ) * this.citizenConsume);
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
  },

  buildRoads: function() {

    var obstacle = false;
    this.roadSpriteVisible.forEach(function(sprite){obstacle = obstacle || !this.buildAllowed(sprite);}, this);

    if(!obstacle){
      while(this.roadSpriteVisible.length > 0) {
        var auxBuilding = new Classes.Road(this.game, this.roadSpriteVisible[0].x, this.roadSpriteVisible[0].y, this._buildingModeType.sprite);

        this.wood -= this._buildingModeType.wood;
        this.stone -= this._buildingModeType.stone;

        auxBuilding.anchor.setTo(0.5, 0.5);

        auxBuilding.inputEnabled = true;
        auxBuilding.input.priorityID = 1;
        auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
        auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
        auxBuilding.events.onInputDown.add(this.destroy, this);
        auxBuilding.over = false;
        auxBuilding.visible = true;

        
        this.woodTxt.text = this.wood;
        this.stoneTxt.text = this.stone;

        this._buildingModeType.add(auxBuilding);

        this.roadSpriteVisible[0].visible = false;
        this.roadSpriteVisible[0].tint = 0xFFFFFF;
        this.roadSpriteStack.push(this.roadSpriteVisible[0]);
        this.roadSpriteVisible.splice(0, 1);
      }

      this.updateTutorialChecks();
    }
    
    this.buildMode(this, this._buildingModeType);
    this.buildMode(this, this._buildingModeType);
  },

  placeRoadGuide: function(){

    var auxSprite;
    if(this.roadSpriteVisible.length > 0)
      auxSprite = this.roadSpriteVisible[this.roadSpriteVisible.length - 1];
    else
      auxSprite = this._buildingModeSprite;


    this.resetRoadStack();

    var stopLoop = false;

    for(var i = 0; this.roadSpriteStack.length > 0 && !stopLoop; i++){

      this.roadSpriteStack[0].x = this._buildingModeSprite.x + this._tileSize * i * Math.cos(this.currentRoadAngle * (Math.PI / -180)); //angles are inverted, so we need to fix them to calculate sin and cos
      this.roadSpriteStack[0].y = this._buildingModeSprite.y + this._tileSize * i * Math.sin(this.currentRoadAngle * (Math.PI / -180));
      this.roadSpriteStack[0].visible = true;

      this.game.world.bringToTop(this.roadSpriteStack[0]);

      this.roadSpriteVisible.push(this.roadSpriteStack[0]);
      
      this.roadSpriteStack.splice(0, 1);

      auxSprite = this.roadSpriteVisible[this.roadSpriteVisible.length - 1];
      stopLoop =  (this.currentRoadAngle == 0 && auxSprite.right >= this.game.input.worldX) ||
                  (this.currentRoadAngle == 90 && auxSprite.top <= this.game.input.worldY) ||
                  (this.currentRoadAngle == 180 && auxSprite.left <= this.game.input.worldX) ||
                  (this.currentRoadAngle == 270 && auxSprite.bottom >= this.game.input.worldY);
    }

    var obstacle = false;
    this.roadSpriteVisible.forEach(function(sprite){obstacle = obstacle || !this.buildAllowed(sprite);}, this);

    if(obstacle)
      this.roadSpriteVisible.forEach(function(sprite){sprite.tint = 0xFF0000;}, this);
    else
      this.roadSpriteVisible.forEach(function(sprite){sprite.tint = 0xFFFFFF;}, this);

  },

  resetRoadStack: function(){
      
    while(this.roadSpriteVisible.length > 0) {
      this.roadSpriteVisible[0].visible = false;
      this.roadSpriteVisible[0].tint = 0xFFFFFF;
      this.roadSpriteStack.push(this.roadSpriteVisible[0]);
      this.roadSpriteVisible.splice(0, 1);
    }
  },

  getFixedAngle: function(a, b) {

    var pointA = new Phaser.Point(a.x, a.y);
    var pointB = new Phaser.Point(b.x, b.y);

    if(a.worldX !== undefined)
      pointA = new Phaser.Point(a.worldX, a.worldY);

    if(b.worldX !== undefined)
      pointB = new Phaser.Point(b.worldX, b.worldY);

    var auxAngle = Phaser.Point.angle(pointA, pointB);

    
    var angleCos = Math.round(Math.cos(auxAngle));
    var angleSin = Math.round(Math.sin(auxAngle));

    if(angleCos < 0)
      auxAngle = 0;
    else if(angleCos > 0)
      auxAngle = 180;
    else if(angleSin > 0)
      auxAngle = 90;
    else
      auxAngle = 270;

    return auxAngle;
  },

  checkObstacles: function(a, type){

    if(type == "water")
      return this.map.getTileWorldXY(a.x, a.y, this.map.tileWidth, this.map.tileHeight, "water") !== null;

    else if(type == "mountain")
      return this.map.getTileWorldXY(a.x, a.y, this.map.tileWidth, this.map.tileHeight, "obstacles") !== null;
    
  },

  checkAdjacency: function(a, b){

    var x = a.getBounds();
    x.width = x.width / 2;
    x.y++;
    x.x++;
    var y = b.getBounds();

    var corners = false;
    corners = (x.y == y.bottom || x.bottom == y.y ) && (x.x == y.right || x.right == y.x);

    return Phaser.Rectangle.intersects(x, y) && !corners;
  },

  checkOverlap: function(a, b){

    var x = a.getBounds();
    x.width--;
    x.height--;
    var y = b.getBounds();
    y.width--;
    y.height--;

    return Phaser.Rectangle.intersects(x, y);
  },

  escape: function(key){
    if(key !== undefined && (this._buildModeActive || this._destroyModeActive)){
      if(this._buildModeActive)
        this.buildMode();
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
      
      this.buildingGroup.forEach(function(group){
        group.forEach(function(a){
          if(a.tooltip !== undefined){
              a.tooltip.toggleTooltip(!this._escapeMenu);
          }
        }, this);
      }, this);
    }
  },

  mouseOut: function(sprite){
    sprite.tint = 0xFFFFFF;
    this.over = false;
  },

  mouseOver: function(sprite){
    if(this._destroyModeActive && !this._escapeMenu){
      sprite.tint = 0xFF0000;
      this.over = true;
    }
  },

  buildAllowed: function(sprite){
    var overlap = false;

    this.buildingGroup.forEach(function (group){
      group.forEach(function(building){
        overlap = overlap || this.checkOverlap(sprite, building);
      }, this);
    }, this);

    overlap = overlap || sprite.left < 6 + this.game.camera.x || sprite.right > 640 + this.game.camera.x || sprite.top < 44 + this.game.camera.y || sprite.bottom > 539 + this.game.camera.y;

    var roadAdjacency;
    this.roadGroup.forEach(function (road){
      roadAdjacency = roadAdjacency || this.checkAdjacency(sprite, road);
    }, this);

    var waterObstacle = this.checkObstacles(sprite, "water");
    var mountainObstacle = this.checkObstacles(sprite, "mountain");


    return(!overlap && !mountainObstacle && (this._buildingModeType == this.roadGroup && this.stone >= (this._buildingModeType.stone * this.roadSpriteVisible.length) || (roadAdjacency && this.wood >= this._buildingModeType.wood && this.stone >= this._buildingModeType.stone && !waterObstacle)))
  },

  destroy: function(sprite){
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
          sprite.off = true;
          this.houseGroup.forEach(function (house) { house.updateSingleHospital(sprite); }, this);
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
  },

  click: function(){
    if(!this._escapeMenu){
      if(this.game.input.mousePointer.x < 6 || this.game.input.mousePointer.x > 640 || this.game.input.mousePointer.y < 44 || this.game.input.mousePointer.y > 539){
        if(this._buildModeActive)
          this.buildMode();
        this._destroyModeActive = false;
      }
      else if(this._buildModeActive)
        if(this._buildingModeType == this.roadGroup && !this.roadBuilding && this.buildAllowed(this._buildingModeSprite)){
          this.roadBuilding = true;
          this._buildingModeSprite.visible = false;
          this.resetRoadStack();
        }
        else if(this.roadBuilding)
          this.buildRoads();
        else
          this.build();
    }
  },

  setTimescale: function(key){
    this.timeScale = parseInt(key.event.key);
    this.currentTime.buffer = 0;
    this.timescaleTxt.text = "Speed: " + this.timeScale;
  },

  pauseTime: function(){
      
    if(!this._escapeMenu) {
      this.paused = !this.paused;
      if(!this.paused && this._buildModeActive)
        this.buildMode();
      this._destroyModeActive = false;
      if(this.paused)
        this.timeTxt.addColor("#ff0000", 0);
      else
        this.timeTxt.addColor("#000000", 0);
    }
  },

  destroyMode: function(){
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
  },

  buildMode: function(key = undefined, group){
    if(!this._escapeMenu) {

      if(this._destroyModeActive)
        this._destroyModeActive = false;


      if(!this._buildModeActive){

        this._buildingModeSprite = this.game.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, group.sprite);
        this._buildingModeSprite.anchor.setTo(0.5, 0.5);
        this._buildingModeSprite.alpha = 0.7;
        this._buildingModeSprite.visible = true;

        this._buildingModeType = group;
        
        this.paused = true;
        this._buildModeActive = true;
        this.timeTxt.addColor("#ff0000", 0);

        this.game.world.bringToTop(this._buildingModeSprite);

        if(group == this.hospitalGroup){
          this._buildingModeArea = this.game.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, "area");
          this._buildingModeArea.anchor.setTo(0.5, 0.5);
          this._buildingModeArea.alpha = 0.35;

          this._buildingModeArea.width = 16*this._tileSize;
          this._buildingModeArea.height = 16*this._tileSize;

          this.game.world.bringToTop(this._buildingModeArea);
        }
        
        if(this.roadBuilding)
          this.roadBuilding = false;
      }

      else {
        if(this._buildingModeSprite !== undefined)
          this._buildingModeSprite.destroy();
          
        if(this._buildingModeArea !== undefined)
          this._buildingModeArea.destroy();

        this._buildModeActive = false;
        
        this.resetRoadStack();
      }
    }
  },

  build: function(){
      
    if(this.buildAllowed(this._buildingModeSprite)){
      var auxBuilding;

      var offset = 0;

      if((this._buildingModeSprite.height / 16) % 2 == 0)
        offset = 8;

      if(this._buildingModeType == this.houseGroup)
        auxBuilding = new Classes.House(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite);
        
      else if(this._buildingModeType == this.roadGroup)
          auxBuilding = new Classes.Road(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite);

      else if(this._buildingModeType == this.hospitalGroup)
        auxBuilding = new Classes.Hospital(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite, 2);

      else
        auxBuilding = new Classes.Producer(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite, this._buildingModeType.produce, this._buildingModeType.consume);

      if(this.mode == 1)
        this.updateTutorialChecks();
      
      this.wood -= this._buildingModeType.wood;
      this.stone -= this._buildingModeType.stone;

      auxBuilding.anchor.setTo(0.5, 0.5);

      auxBuilding.inputEnabled = true;
      auxBuilding.input.priorityID = 1;
      auxBuilding.events.onInputOver.add(this.mouseOver, this, 0, auxBuilding);
      auxBuilding.events.onInputOut.add(this.mouseOut, this, 0, auxBuilding);
      auxBuilding.events.onInputDown.add(this.destroy, this);
      auxBuilding.over = false;

      
      this.woodTxt.text = this.wood;
      this.stoneTxt.text = this.stone;
      
      if(this._buildingModeType == this.houseGroup)
      {
        auxBuilding.updateHospitals(this.hospitalGroup);
      }

      this._buildingModeType.add(auxBuilding);

      this.buildMode(this, this._buildingModeType);
      this.buildMode(this, this._buildingModeType);
    }
  },

  updateTutorialChecks: function(){
    if (this._buildingModeType.sprite == 'Water' && !this.cropCheck)
      this.cropCheck = true;

    if (this._buildingModeType.sprite == 'Crops' && !this.woodCheck)
      this.woodCheck = true;
      
    if (this._buildingModeType.sprite == 'Wood' && !this.stoneCheck)
      this.stoneCheck = true;

    if (this._buildingModeType.sprite == 'Stone' && !this.uraniumCheck)
      this.uraniumCheck = true;

    if (this._buildingModeType.sprite == 'Uranium' && !this.energyCheck)
      this.energyCheck = true;

    if (this._buildingModeType.sprite == 'Energy' && !this.windCheck)
      this.windCheck = true;

    if (this._buildingModeType.sprite == 'Wind' && !this.hospitalCheck)
      this.hospitalCheck = true;
          
    if (this._buildingModeType.sprite == "Hospital" && !this.bulldozeCheck)
      this.bulldozeCheck = true;

    if (this._buildingModeType.sprite == "Road" && !this.houseCheck)
      this.houseCheck = true;

    if (this._buildingModeType.sprite == "House" && !this.waterCheck)
      this.waterCheck = true;
  }
};

module.exports = PlayScene;
