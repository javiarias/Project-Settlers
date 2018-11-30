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

    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/HERO.png');
    this.game.load.image('test', 'images/Phaser.png');

    this.game.load.image('buildTest', 'images/building test.png');

 
    this.game.load.tilemap('tilemap', 'images/map/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('patronesTilemap', 'images/map/tileset.png');

  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
