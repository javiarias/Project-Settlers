'use strict';
var Classes = require("./buildings.js");
var Phasetips = require("./Phasetips.js");

var PlayScene = {
  
  create: function () {

    ////////////////////////////////////////////////////////////////////////////////////////////////

        this.map = this.game.add.tilemap('tilemap'); 
        this.map.addTilesetImage("Tileset","patronesTilemap");

        //layers
        this.map.waterLayer = this.map.createLayer ("water");

        this.map.groundLayer = this.map.createLayer ("soil");
        this.map.resourcesLayer = this.map.createLayer ("resources");
        this.map.obstaclesLayer = this.map.createLayer ("obstacles");

        this.map.waterLayer.resizeWorld();


        //music

          this.volume = 50;

          this.gameMusic = this.game.add.audio('gameSound'); 

          this.gameMusic.play();
          this.gameMusic.loop = true;
          this.gameMusic.volume = this.volume / 100;

          this.paused = true;
          this.timeScale = 1;
          this.currentTime = { "hour": 0, "buffer": 0};
          this.homelessArray = [];
          this.shiftStart = 8;
          this.shiftEnd = 20;
          this._tileSize = this.map.tileWidth;
          this._buildModeActive = false;
          this._destroyModeActive = false;
          this._escapeMenu = false;
          this.fade;

          this._buildingModeSprite;
          this._buildingModeType = "";

    /////////GROUPS AND RESOURCES
    this.food = 100;

    this.wood = 50;

    this.coal = 0;

    this.uranium = 0;

    this.energy = 0;

    this.water = 0;

    this.stone = 50;
    
    //etc...
    ////////////////////////////////////////////////////////////////////////////////////////////////

    this.buildingGroup = this.game.add.group();

    this.houseGroup = this.game.add.group();
    this.buildingGroup.add(this.houseGroup);
    this.houseGroup.sprite = 'House';

    this.woodGroup = this.game.add.group();
    this.buildingGroup.add(this.woodGroup);
    this.woodGroup.sprite = 'Wood';

    this.coalGroup = this.game.add.group(); //Comentado de momento, añado un grupo Mine y ya vemos como hacer el reparto de recursos (¿Stone + Coal?)
    this.buildingGroup.add(this.coalGroup);
    this.coalGroup.sprite = 'Coal'

    this.uraniumGroup = this.game.add.group();
    this.buildingGroup.add(this.uraniumGroup);
    this.uraniumGroup.sprite = 'Uranium';

    this.energyGroup = this.game.add.group();
    this.buildingGroup.add(this.energyGroup);
    this.energyGroup.sprite = 'Energy';

    this.windGroup = this.game.add.group();
    this.buildingGroup.add(this.windGroup);
    this.windGroup.sprite = 'Wind';

    this.roadGroup = this.game.add.group();
    this.buildingGroup.add(this.roadGroup);
    this.roadGroup.sprite = 'Road'; //Grupo de sprites (?)

    this.waterGroup = this.game.add.group();
    this.buildingGroup.add(this.waterGroup);
    this.waterGroup.sprite = 'Water';

    this.hospitalGroup = this.game.add.group();
    this.buildingGroup.add(this.hospitalGroup);
    this.hospitalGroup.sprite = 'Hospital';

    this.stoneGroup = this.game.add.group();
    this.buildingGroup.add(this.stoneGroup);
    this.stoneGroup.sprite = 'Stone';

    this.cropGroup = this.game.add.group();
    this.buildingGroup.add(this.cropGroup);
    this.cropGroup.sprite = 'Crops';

    //etc.

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //pause menu
    this.pauseMenu = this.game.add.group();

    var pauseBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "pauseBkg");
    pauseBkg.anchor.setTo(.5, .5);
    pauseBkg.fixedToCamera = true;
    pauseBkg.smoothed = false;
    this.pauseMenu.add(pauseBkg);

    var pauseSettings = this.game.add.button(pauseBkg.x - 72, pauseBkg.y + 3, "settBttn", function(){this.optionsMenu.visible = true; this.pauseMenu.visible = false; this.game.world.bringToTop(this.optionsMenu);}, this, 0, 0, 1);
    pauseSettings.anchor.setTo(0.5, 0.5);
    pauseSettings.fixedToCamera = true;
    pauseSettings.smoothed = false;

    this.pauseMenu.add(pauseSettings);

    var pauseMinimize = this.game.add.button(pauseBkg.x, pauseBkg.y + 3, "minBttn", escape, this, 0, 0, 1);
    pauseMinimize.anchor.setTo(0.5, 0.5);
    pauseMinimize.fixedToCamera = true;
    pauseMinimize.smoothed = false;

    this.pauseMenu.add(pauseMinimize);
    
    var pauseExit = this.game.add.button(pauseBkg.x + 72, pauseBkg.y + 3, "exitBttn", function(){this.game.state.start('main');}, this, 0, 0, 1);
    pauseExit.anchor.setTo(0.5, 0.5);
    pauseExit.fixedToCamera = true;
    pauseExit.smoothed = false;

    this.pauseMenu.add(pauseExit);

    this.pauseMenu.visible = false;

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

    this.optionsMenu.add(optionsMinus);
    
    var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){updateVolume.call(this, 5);}, this, 0, 0, 1);
    optionsPlus.anchor.setTo(0.5, 0.5);
    optionsPlus.fixedToCamera = true;
    optionsPlus.smoothed = false;

    this.optionsMenu.add(optionsPlus);

    var optionsBack = this.game.add.button(optionsBkg.x - 47, optionsBkg.y + 48, "backBttn", function(){this.optionsMenu.visible = false; this.pauseMenu.visible = true; this.game.world.bringToTop(this.pauseMenu);}, this, 0, 0, 1);
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

    //UI

    this.UI = this.game.add.group();

    var UIBkg = this.game.add.sprite(0, 0, "UI");
    UIBkg.fixedToCamera = true;
    UIBkg.smoothed = false;

    this.UI.add(UIBkg);

    var escapeBttn = this.game.add.button(UIBkg.right - 5, 5, "exitBttn", function(){escape.call(this);}, this, 0, 0, 1);
    escapeBttn.anchor.setTo(1, 0);
    escapeBttn.fixedToCamera = true;
    escapeBttn.smoothed = false;
    escapeBttn.scale.setTo(0.7, 0.7);

    this.UI.add(escapeBttn);

    var numberOfButtons = 6;
    var scale = 1;
    if(637 < 60 * numberOfButtons)
      scale = 637 / (60 * numberOfButtons);

    var buttonOffset = 637 / numberOfButtons - (55 * scale) + (55 * scale)/2; // 11 = número de botones, 55 = tamaño x del botón
    

    var roadBttn = this.game.add.button(5 + buttonOffset - (buttonOffset - (55 * scale)/2)/2, UIBkg.bottom - 30, "roadBttn", function(){buildMode.call(this, this, this.roadGroup);}, this, 0, 0, 1);
    roadBttn.anchor.setTo(.5, .5);
    roadBttn.fixedToCamera = true;
    roadBttn.smoothed = false;
    roadBttn.scale.setTo(scale, scale);

    this.UI.add(roadBttn);

    var houseBttn = this.game.add.button(roadBttn.right + buttonOffset, roadBttn.centerY, "houseBttn", function(){buildMode.call(this, this, this.houseGroup);}, this, 0, 0, 1);
    houseBttn.anchor.setTo(.5, .5);
    houseBttn.fixedToCamera = true;
    houseBttn.smoothed = false;
    houseBttn.scale.setTo(scale, scale);

    this.UI.add(houseBttn);

    /*var waterBttn = this.game.add.button(houseBttn.right + buttonOffset,  roadBttn.centerY, "waterBttn", function(){}, this, 0, 0, 1);
    waterBttn.anchor.setTo(.5, .5);
    waterBttn.fixedToCamera = true;
    waterBttn.smoothed = false;
    waterBttn.scale.setTo(scale, scale);

    this.UI.add(waterBttn);*/

    var cropBttn = this.game.add.button(houseBttn.right + buttonOffset,  roadBttn.centerY, "cropBttn", function(){buildMode.call(this, this, this.cropGroup);}, this, 0, 0, 1);
    cropBttn.anchor.setTo(.5, .5);
    cropBttn.fixedToCamera = true;
    cropBttn.smoothed = false;
    cropBttn.scale.setTo(scale, scale);

    this.UI.add(cropBttn);

    var woodBttn = this.game.add.button(cropBttn.right + buttonOffset,  roadBttn.centerY, "woodBttn", function(){buildMode.call(this, this, this.woodGroup);}, this, 0, 0, 1);
    woodBttn.anchor.setTo(.5, .5);
    woodBttn.fixedToCamera = true;
    woodBttn.smoothed = false;
    woodBttn.scale.setTo(scale, scale);

    this.UI.add(woodBttn);

    var stoneBttn = this.game.add.button(woodBttn.right + buttonOffset,  roadBttn.centerY, "stoneBttn", function(){buildMode.call(this, this, this.stoneGroup);}, this, 0, 0, 1);
    stoneBttn.anchor.setTo(.5, .5);
    stoneBttn.fixedToCamera = true;
    stoneBttn.smoothed = false;
    stoneBttn.scale.setTo(scale, scale);

    this.UI.add(stoneBttn);

    /*var coalBttn = this.game.add.button(stoneBttn.right + buttonOffset,  roadBttn.centerY, "coalBttn", function(){}, this, 0, 0, 1);
    coalBttn.anchor.setTo(.5, .5);
    coalBttn.fixedToCamera = true;
    coalBttn.smoothed = false;
    coalBttn.scale.setTo(scale, scale);

    this.UI.add(coalBttn);

    var uraniumBttn = this.game.add.button(coalBttn.right + buttonOffset,  roadBttn.centerY, "uraniumBttn", function(){}, this, 0, 0, 1);
    uraniumBttn.anchor.setTo(.5, .5);
    uraniumBttn.fixedToCamera = true;
    uraniumBttn.smoothed = false;
    uraniumBttn.scale.setTo(scale, scale);

    this.UI.add(uraniumBttn);

    var windBttn = this.game.add.button(uraniumBttn.right + buttonOffset,  roadBttn.centerY, "windBttn", function(){}, this, 0, 0, 1);
    windBttn.anchor.setTo(.5, .5);
    windBttn.fixedToCamera = true;
    windBttn.smoothed = false;
    windBttn.scale.setTo(scale, scale);

    this.UI.add(windBttn);

    var energyBttn = this.game.add.button(windBttn.right + buttonOffset,  roadBttn.centerY, "energyBttn", function(){}, this, 0, 0, 1);
    energyBttn.anchor.setTo(.5, .5);
    energyBttn.fixedToCamera = true;
    energyBttn.smoothed = false;
    energyBttn.scale.setTo(scale, scale);

    this.UI.add(energyBttn);

    var hospitalBttn = this.game.add.button(energyBttn.right + buttonOffset,  roadBttn.centerY, "hospitalBttn", function(){}, this, 0, 0, 1);
    hospitalBttn.anchor.setTo(.5, .5);
    hospitalBttn.fixedToCamera = true;
    hospitalBttn.smoothed = false;
    hospitalBttn.scale.setTo(scale, scale);

    this.UI.add(hospitalBttn);*/

    var bulldozeBttn = this.game.add.button(stoneBttn.right + buttonOffset,  roadBttn.centerY, "bulldozeBttn", function(){destroyMode.call(this);}, this, 0, 0, 1);
    bulldozeBttn.anchor.setTo(.5, .5);
    bulldozeBttn.fixedToCamera = true;
    bulldozeBttn.smoothed = false;
    bulldozeBttn.scale.setTo(scale, scale);

    this.UI.add(bulldozeBttn);



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

      this.foodTxtGroup = this.game.add.group();

      this.foodIcon = this.game.add.sprite(this.timeTxt.centerX, this.timescaleTxt.bottom + 550/5, "cropIcon");
      this.foodIcon.anchor.setTo(1, 0);
      this.foodIcon.fixedToCamera = true;
      this.foodIcon.smoothed = false;

      this.foodTxtGroup.add(this.foodIcon);

      
      this.foodTxt = this.game.add.text(this.foodIcon.right + 15, this.foodIcon.centerY + 3, this.food, {font: "30px console"});
      this.foodTxt.anchor.setTo(0, .5);
      this.foodTxt.fixedToCamera = true;
      this.foodTxt.smoothed = false;

      this.foodTxtGroup.add(this.foodTxt);

      this.foodTxtTooltip = new Phasetips(this.game, {
        targetObject: this.foodIcon,
        context: "Food",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        
        animation: "fade"
      });

    this.UI.add(this.foodTxtGroup);

      this.woodTxtGroup = this.game.add.group();

      this.woodIcon = this.game.add.sprite(this.foodIcon.centerX, this.foodIcon.bottom + 7, "woodIcon");
      this.woodIcon.anchor.setTo(.5, 0);
      this.woodIcon.fixedToCamera = true;
      this.woodIcon.smoothed = false;

      this.woodTxtGroup.add(this.woodIcon);
      
      this.woodTxt = this.game.add.text(this.foodTxt.x, this.woodIcon.centerY + 4, this.wood, {font: "30px console"});
      this.woodTxt.anchor.setTo(0, .5);
      this.woodTxt.fixedToCamera = true;
      this.woodTxt.smoothed = false;

      this.woodTxtGroup.add(this.woodTxt);

      this.woodTxtTooltip = new Phasetips(this.game, {
        targetObject: this.woodIcon,
        context: "Wood",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        
        animation: "fade"
      });

    this.UI.add(this.woodTxtGroup);

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

      this.stoneTxtTooltip = new Phasetips(this.game, {
        targetObject: this.stoneIcon,
        context: "Stone",
        strokeColor: 0xff0000,
        position: "left",
        positionOffset: 30,   
        
        animation: "fade"
      });

      this.stoneTxtGroup.add(this.stoneTxt);

    this.UI.add(this.stoneTxtGroup);

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
    
    this.tip1 = new Phasetips(this.game, {
      targetObject: roadBttn,
      context: "Road:\n  You can build right above them.\nCost:\n  Free",
      width: 150,
      height: 100,
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 30,   
      
      animation: "fade"
    });

    this.tip2 = new Phasetips(this.game, {
      targetObject: houseBttn,
      context: "House:\n  Provides shelter for 2 citizens.\nCost:\n  10 Wood, 10 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 30,   
      
      animation: "fade"
    });

    this.tip3 = new Phasetips(this.game, {
      targetObject: cropBttn,
      context: "Farm:\n  Provides food for your citizens.\nCost:\n  10 Wood, 10 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 30,   
      
      animation: "fade"
    });

    this.tip4 = new Phasetips(this.game, {
      targetObject: stoneBttn,
      context: "Quarry:\n  Used to mine stone for building.\nCost:\n  10 Wood, 10 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 30,   
      
      animation: "fade"
    });

    this.tip5 = new Phasetips(this.game, {
      targetObject: woodBttn,
      context: "Sawmill:\n  Used to cut wood for building.\nCost:\n  10 Wood, 10 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 30,   
      
      animation: "fade"
    });

    this.tip6 = new Phasetips(this.game, {
      targetObject: bulldozeBttn,
      context: "Bulldozer:\n  Used to destroy buildings and\n  roads.",
      width: 362,
      height: 80,
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 30,   
      
      animation: "fade"
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////

    //keyboard phaser
    var key_One = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key_One.onDown.add(setTimescale, this);

    var key_Two = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key_Two.onDown.add(setTimescale, this);

    var key_Three = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key_Three.onDown.add(setTimescale, this);

    var key_Space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key_Space.onDown.add(pauseTime, this);

    var key_K = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
    key_K.onDown.add(buildMode, this, 0, this.houseGroup);

    var key_J = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
    key_J.onDown.add(buildMode, this, 0, this.woodGroup);

    var key_L = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
    key_L.onDown.add(destroyMode, this);

    var key_Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    key_Q.onDown.add(addCitizen, this);

    var key_ESC = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    key_ESC.onDown.add(escape, this);

    this.game.input.onDown.add(click, this);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.cursorsAlt = this.game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );

    
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

          this.game.world.bringToTop(this.UI);
        }

        else {
          if(this._buildingModeSprite !== undefined)
            this._buildingModeSprite.destroy();

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
        if(sprite.full !== undefined)
          sprite.bulldoze(this.homelessArray);
        sprite.destroy();
      }
    }

    function build(){
      var overlap = false;

      this.buildingGroup.forEach(function (group){
        group.forEach(function(building){
          overlap = overlap || this.checkOverlap.call(this, this._buildingModeSprite, building);
        }, this)
      }, this);

      overlap = overlap || this.game.input.mousePointer.x < 6 || this.game.input.mousePointer.x > 640 || this.game.input.mousePointer.y < 44 || this.game.input.mousePointer.y > 539;

      var roadAdjacency;
      this.roadGroup.forEach(function (road){
        roadAdjacency = roadAdjacency || this.checkAdjacency.call(this, this._buildingModeSprite, road);
      }, this);

      var obstacle = this.checkObstacles.call(this, this._buildingModeSprite);


      if(!overlap && (this._buildingModeType == this.roadGroup || (roadAdjacency && this.wood >= 10 && this.stone >= 10 && !obstacle))){
        var auxBuilding;

        var offset = 0;

        if((this._buildingModeSprite.height / 16) % 2 == 0)
          offset = 8;

        if(this._buildingModeType == this.houseGroup)
          auxBuilding = new Classes.House(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite, 1);
        else
          auxBuilding = new Classes.Producer(this.game, Math.round(this.game.input.worldX / this._tileSize) * this._tileSize, offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize, this._buildingModeType.sprite, 1);
        auxBuilding.anchor.setTo(0.5, 0.5);

        auxBuilding.inputEnabled = true;
        auxBuilding.input.priorityID = 1;
        auxBuilding.events.onInputOver.add(mouseOver, this, 0, auxBuilding);
        auxBuilding.events.onInputOut.add(mouseOut, this, 0, auxBuilding);
        auxBuilding.events.onInputDown.add(destroy, this);
        auxBuilding.over = false;

        //WIP
        if(this._buildingModeType != this.roadGroup){
          this.wood -= 10;
          this.stone -= 10;
          this.woodTxt.text = "Wood: " + this.wood;
          this.stoneTxt.text = "Stone: " + this.stone;
        }

        this._buildingModeType.add(auxBuilding);

        this._buildModeActive = false;
        if(this._buildingModeSprite !== undefined)
            this._buildingModeSprite.destroy();
        buildMode.call(this, this, this._buildingModeType);


        if(this.wood < 10)
          this.woodTxt.addColor("#FF0000", 0);

        if(this.stone < 10)
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

    this.checkObstacles = function(a){

      return this.map.getTileWorldXY(a.x, a.y, this.map.tileWidth, this.map.tileHeight, "water") !== null || this.map.getTileWorldXY(a.x, a.y, this.map.tileWidth, this.map.tileHeight, "obstacles") !== null;
      
    }

    function addCitizen()
    {
      var citizen = new Classes.Citizen(this.homelessArray);
    } 

    for(var i = 0; i < 5; i++)
      addCitizen.call(this);
  },


  update: function () {
    if(!this._escapeMenu) {
      if(!this.paused){
        this.currentTime.buffer += this.timeScale; //buffer increment

        if (this.currentTime.buffer >= 20) { //if buffer > 3, update. AKA, speed 1 = every 3 loops, speed 2 = every 2 loops... etc.
          
          //update clock
          this.currentTime.buffer = 0;

          this.currentTime.hour = (this.currentTime.hour + 1) % 24; 
        
          ////////////////////////////////////////
          //update producers
          if(this.currentTime.hour >= this.shiftStart && this.currentTime.hour<= this.shiftEnd){

            this.timeTxt.addColor("#008500", 0);

            this.woodGroup.forEach(function(prod){
              this.wood += prod.amount;
            }, this);

            this.coalGroup.forEach(function(prod){
              this.coal += prod.amount;
            }, this);

            this.uraniumGroup.forEach(function(prod){
              this.uranium += prod.amount;
            }, this);

            this.cropGroup.forEach(function(prod){
              this.food += prod.amount;
            }, this);

            this.stoneGroup.forEach(function(prod){
              this.stone += prod.amount;
            }, this);

            //etc...

            //update consumers
            this.energyGroup.forEach(function(prod){
              this.energy += prod.amount;

              switch(prod.consumes){

                case "uranium":
                this.uranium -= prod.consumed;
                  break;

                  //other cases for other consumers
              }
            }, this);


            this.foodTxt.text = "Food: " + this.food;
            this.woodTxt.text = "Wood: " + this.wood;
            this.stoneTxt.text = "Stone: " + this.stone;
          }

          else if(this.currentTime.hour == 0){
            
            this.timeTxt.addColor("#000000", 0);

            this.houseGroup.forEach(function(prod){
              if(this.food > 0)
                this.food -= 5 * prod.countCitizens();
              prod.tick(this.food, this.homelessArray);

              for(var i = prod.numberOfBirths; i > 0; i--)
                var aux = new Classes.Citizen(this.homelessArray);

            }, this);

            for (var i = this.homelessArray.length - 1; i >= 0; i--) {
              if(this.food > 0)
                this.food -= 5;
              this.homelessArray[i].tick(this.food, false, null, this.homelessArray, this.houseGroup);
            }

            this.foodTxt.text = "Food: " + this.food;
          }

          else
            this.timeTxt.addColor("#000000", 0);

          var originalLength = this.homelessArray.length;
          for (var i = this.homelessArray.length - 1; i >= 0; i--) {
            if(!this.homelessArray[i].homeless || this.homelessArray[i].health <= 0 || this.homelessArray[i].addToHouse(this.homelessArray, this.houseGroup))
              this.homelessArray.splice(i, 1);

            if(this.homelessArray.length > originalLength)
              i += (this.homelessArray.length - originalLength);
          }

          this.timeTxt.text = this.currentTime.hour + ":00";

          var aux = this.homelessArray.length;

          this.houseGroup.forEach(function(house){aux += house.countCitizens();});
          
          this.homelessTxt.text = "Homeless: " + this.homelessArray.length;
          this.citizensTxt.text = "Total Citizens: " + aux;

          if(this.food < 5)
            this.foodTxt.addColor("#FF0000", 0);
          else
            this.foodTxt.addColor("#000000", 0);

          if(this.wood < 10)
            this.woodTxt.addColor("#FF0000", 0);
          else  
            this.woodTxt.addColor("#000000", 0);

          if(this.stone < 10)
            this.stoneTxt.addColor("#FF0000", 0);
          else
            this.stoneTxt.addColor("#000000", 0);

        }
      }

      else if(this._buildModeActive){

        var offset = 0;

        if((this._buildingModeSprite.height / 16) % 2 == 0)
          offset = 8;

        this._buildingModeSprite.x = Math.round(this.game.input.worldX / this._tileSize) * this._tileSize;
        this._buildingModeSprite.y = offset + Math.round(this.game.input.worldY / this._tileSize) * this._tileSize;

        var overlap = false;

        this.buildingGroup.forEach(function (group){
          group.forEach(function(building){
            overlap = overlap || this.checkOverlap.call(this, this._buildingModeSprite, building);
          }, this)
        }, this);

        overlap = overlap || this.game.input.mousePointer.x < 6 || this.game.input.mousePointer.x > 640 || this.game.input.mousePointer.y < 44 || this.game.input.mousePointer.y > 539;

        var roadAdjacency = (this._buildingModeType == this.roadGroup);

        this.roadGroup.forEach(function (road){
          roadAdjacency = roadAdjacency || this.checkAdjacency.call(this, this._buildingModeSprite, road);
        }, this);

        var obstacle = this.checkObstacles.call(this, this._buildingModeSprite);

        if(!overlap && (this._buildingModeType == this.roadGroup || (roadAdjacency && this.wood >= 10 && this.stone >= 10 && !obstacle)))
          this._buildingModeSprite.tint = 0xFFFFFF; //el sprite se pone de color normal si se puede construir
        else
          this._buildingModeSprite.tint = 0xFF0000;
      }

      if (this.cursors.up.isDown || this.cursorsAlt.up.isDown){
        this.game.camera.y -= 16;}

      else if (this.cursors.down.isDown || this.cursorsAlt.down.isDown){
        this.game.camera.y += 16;}

      if (this.cursors.left.isDown || this.cursorsAlt.left.isDown){
        this.game.camera.x -= 16;}

      else if (this.cursors.right.isDown || this.cursorsAlt.right.isDown){
        this.game.camera.x += 16;}
    }
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
