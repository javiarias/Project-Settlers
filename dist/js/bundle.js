(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * PHASETIPS is a tooltip plugin for Phaser.io HTML5 game framework
 *
 * COPYRIGHT-2015
 * AUTHOR: MICHAEL DOBEKIDIS (NETGFX.COM)
 *
 **/

var Phasetips = function(localGame, options) {

    var _this = this;
    var _options = options || {};
    var game = localGame || game; // it looks for a game object or falls back to the global one

    this.printOptions = function() {
        window.console.log(_options);
    };

    this.onHoverOver = function() {
        if(_this.enabled) {
            if (_this.tweenObj) {
                _this.tweenObj.stop();
            }
            if (_options.animation === "fade") {
                _this.tweenObj = game.add.tween(_this.mainGroup).to({
                    alpha: 1
                }, _options.animationSpeedShow, Phaser.Easing.Linear.None, true, _options.animationDelay, 0, false);
            } else if (_options.animation === "slide") {

            } else if (_options.animation === "grow") {

                _this.mainGroup.pivot.setTo(_this.mainGroup.width / 2, _this.mainGroup.height);
                _this.mainGroup.pivot.setTo(_this.mainGroup.width / 2, _this.mainGroup.height);
                _this.mainGroup.x = _this.mainGroup.initialX + _this.mainGroup.width / 2;
                _this.mainGroup.y = _this.mainGroup.initialY + _this.mainGroup.height;
                _this.mainGroup.scale.setTo(0, 0);
                _this.mainGroup.alpha = 1;
                _this.tweenObj = game.add.tween(_this.mainGroup.scale).to({
                    x: 1,
                    y: 1
                }, _options.animationSpeedShow, Phaser.Easing.Linear.None, true, _options.animationDelay, 0, false);
            } else {
                _this.mainGroup.visible = true;
                _this.mainGroup.alpha = 1;
            }

            if (_options.onHoverCallback) {
                _options.onHoverCallback(_this);
            }
        }
    };

    this.onHoverOut = function() {
        if(_this.enabled){
            if (_this.tweenObj) {
                _this.tweenObj.stop();
            }

            if (_options.animation === "fade") {
                _this.tweenObj = game.add.tween(_this.mainGroup).to({
                    alpha: 0
                }, _options.animationSpeedHide, Phaser.Easing.Linear.None, true, 0, 0, false);
            } else {
                _this.mainGroup.alpha = 0;
            }

            if (_options.onOutCallback) {
                _options.onOutCallback(_this);
            }
        }
    };

    this.createTooltips = function() {

        _this.enabled = true;

        // layout
        var _width = _options.width || "auto";
        var _height = _options.height || "auto";
        var _x = _options.x === undefined ? "auto" : _options.x;
        var _y = _options.y === undefined ? "auto" : _options.y;
        var _padding = _options.padding === undefined ? 20 : _options.padding;
        var _positionOffset = _options.positionOffset === undefined ? 20 : _options.positionOffset;
        var _bgColor = _options.backgroundColor || 0x000000;
        var _strokeColor = _options.strokeColor || 0xffffff;
        var _strokeWeight = _options.strokeWeight || 2;
        var _customArrow = _options.customArrow || false;
        var _enableCursor = _options.enableCursor || false;
        var _customBackground = _options.customBackground || false;
        var _fixedToCamera = _options.fixedToCamera === undefined ? true : _options._fixedToCamera;
        // Option for rounded corners
        var _roundedCornersRadius = _options.roundedCornersRadius || 1;
        // Option for font style
        var _font = _options.font || 'console';
        var _fontSize = _options.fontSize || 17;
        var _fontFill = _options.fontFill || "#ffffff";
        var _fontStroke = _options.fontStroke || "#1e1e1e";
        var _fontStrokeThickness = _options.fontStrokeThickness || 1;
        var _fontWordWrap = _options.fontWordWrap || true;
        var _fontWordWrapWidth = _options.fontWordWrapWidth || 200;
        // Text style properties
        var _textStyle = _options.textStyle || {
            font: _font,
            fontSize: _fontSize,
            fill: _fontFill,
            stroke: _fontStroke,
            strokeThickness: _fontStrokeThickness,
            wordWrap: _fontWordWrap,
            wordWrapWidth: _fontWordWrapWidth
        };

        //
        var _position = _options.position || "top"; // top, bottom, left, right, auto(?)
        var _animation = _options.animation || "fade"; // fade, slide, grow, none to manually show it
        var _animationDelay = _options.animationDelay || 0;
        var _content = _options.context || "Hello World"; // string, bitmapText, text, sprite, image, group
        var _object = _options.targetObject || game; // any object
        var _animationSpeedShow = _options.animationSpeedShow || 300;
        var _animationSpeedHide = _options.animationSpeedHide || 200;
        var _onHoverCallback = _options.onHoverCallback || function() {};
        var _onOutCallback = _options.onOutCallback || function() {};
        // If alwaysOn option is set to true, the tooltip will not fade in or out upon hover.
        var _initialOn = _options.initialOn || false;

        // If disableInputEvents option is set to true, PHASETIPS will not add input events.
        // Use simulateOnHoverOver, simulateOnHoverOut, hideTooltip or showTooltip methods to manually control the visibility.
        var _disableInputEvents = _options.disableInputEvents || false;

        _options.animation = _animation;
        _options.animationDelay = _animationDelay;
        _options.animationSpeedShow = _animationSpeedShow;
        _options.animationSpeedHide = _animationSpeedHide;
        _options.onHoverCallback = _onHoverCallback;
        _options.onOutCallback = _onOutCallback;

        _this.originalPosition = _object.position;

        ////////////////////////////////////////////////////////////////////////////////////
        var tooltipBG;
        _this.tooltipContent;
        var tooltipArrow;

        _this.mainGroup = game.add.group();
        var mainGroup = _this.mainGroup;

        // add content first to calculate width & height in case of auto
        var type = typeof _content;

        if (type === "string" || type === "number") {
            _this.tooltipContent = game.add.text(_padding / 2, _padding / 2, String(_content), _textStyle);
            _this.tooltipContent.lineSpacing = _textStyle.lineSpacing || 0;
            _this.tooltipContent.updateText();
            _this.tooltipContent.update();
            _this.tooltipContent.x = _padding / 2;
            _this.tooltipContent.y = _padding / 2;
            //_this.tooltipContent.fontWeight = "bold";
            _this.tooltipContent.smoothing = false;
            var bounds = _this.tooltipContent.getBounds();
            /* window.console.log(bounds);
             var debug = game.add.graphics(bounds.width, bounds.height);
             debug.x = _padding/2;
             debug.y = _padding/2;
             debug.beginFill(0xff0000, 0.6);
             debug.drawRect(0, 0, bounds.width, bounds.height, 1);
             window.console.log(debug.x)*/
        } else if (type === "object") {
            _this.tooltipContent = _content;
        }

        if (_width !== "auto" && _height !== "auto") {
            mainGroup.width = _width;
            mainGroup.height = _height;
        } else {
            if (_customBackground === false) {
                mainGroup.width = _this.tooltipContent.width + _padding;
                mainGroup.height = _this.tooltipContent.height + _padding;
            } else {

                if (_customBackground.width > _this.tooltipContent.width) {
                    mainGroup.width = _customBackground.width;
                    mainGroup.height = _customBackground.height;
                } else {
                    mainGroup.width = _this.tooltipContent.width;
                    mainGroup.height = _this.tooltipContent.height;
                }
            }
        }

        // Making it invisible
        if(_initialOn !== true) {
            mainGroup.alpha = 0;
        }
        //////////////////////
        function updatePosition() {
            var _origPosition = _position;
            if (_x !== "auto" && _y !== "auto") {
                var worldPos = _options.targetObject ? _options.targetObject.world : game.world;
                mainGroup.x = _x;
                mainGroup.y = _y;
                if (_fixedToCamera == true) {
                    mainGroup.fixedToCamera = true;
                    mainGroup.cameraOffset.setTo(mainGroup.x, mainGroup.y);
                }
            } else {
                var worldPos = _options.targetObject ? _options.targetObject.world : game.world;
                objectX = worldPos.x || _options.targetObject.x;
                objectY = worldPos.y || _options.targetObject.y;

                // sanity check
                if (_position === "bottom") {
                    if (Math.round(objectY + _object.height + (_positionOffset)) + mainGroup._height > game.height) {
                        _position = "top";
                    }
                } else if (_position === "top") {
                    if (Math.round(objectY - (_positionOffset + mainGroup._height)) < 0) {
                        _position = "bottom";
                    }
                }

                if (_position === "top") {
                    mainGroup.x = Math.round(objectX + ((_object.width / 2) - (mainGroup._width / 2)));
                    mainGroup.y = Math.round(objectY - (_positionOffset + mainGroup._height));
                } else if (_position === "bottom") {
                    mainGroup.x = Math.round(objectX + ((_object.width / 2) - (mainGroup._width) / 2));
                    mainGroup.y = Math.round(objectY + _object.height + (_positionOffset));
                } else if (_position === "left") {
                    mainGroup.x = Math.round(objectX - (_positionOffset + mainGroup._width));
                    mainGroup.y = Math.round((objectY + _object.height / 2) - (mainGroup._height / 2));
                    // mainGroup.scale.x = -1;
                } else if (_position === "right") {
                    mainGroup.x = Math.round(objectX + _object.width + _positionOffset);
                    mainGroup.y = Math.round((objectY + _object.height / 2) - (mainGroup._height / 2));
                }

                if (_fixedToCamera == true) {
                    mainGroup.fixedToCamera = true;
                    mainGroup.cameraOffset.setTo(mainGroup.x, mainGroup.y);
                }
            }

            // clone world position
            mainGroup.initialWorldX = worldPos.x;
            mainGroup.initialWorldY = worldPos.y;

            mainGroup.initialX = mainGroup.x;
            mainGroup.initialY = mainGroup.y;

            // if the world position changes, there might be space for the tooltip
            // to be in the original position.
            _position = _origPosition;
        }

        updatePosition();

        ///////////////////////////////////////////////////////////////////////////////////



        if (_customBackground === false) {
            /// create bg
            tooltipBG = game.add.graphics(_this.tooltipContent.width, _this.tooltipContent.height);
            tooltipBG.beginFill(_bgColor, 1);
            tooltipBG.x = 0;
            tooltipBG.y = 0;
            tooltipBG.lineStyle(_strokeWeight, _strokeColor, 1);

            // if roundedCornersRadius option is set to 1, drawRect will be used.
            if( _roundedCornersRadius == 1 ) {
                tooltipBG.drawRect(0, 0, _this.tooltipContent.width + _padding, _this.tooltipContent.height + _padding, 1);
            } else {
                tooltipBG.drawRoundedRect(0, 0, _this.tooltipContent.width + _padding, _this.tooltipContent.height + _padding, _roundedCornersRadius);
            }
        } else {
            tooltipBG = _customBackground;
        }

        // add all to group
        mainGroup.add(tooltipBG);
        mainGroup.add(_this.tooltipContent);
        //if(debug)
        //mainGroup.add(debug);

        // add event listener
        // if "disableInputEvents" option is set to true, the followings are ignored.
        if(_disableInputEvents !== true) {
            _object.inputEnabled = true;
            if (_enableCursor) {
                _object.input.useHandCursor = true;
            }
            _object.events.onInputOver.add(_this.onHoverOver, this);
            _object.events.onInputDown.add(_this.onHoverOver, this);
            _object.events.onInputOut.add(_this.onHoverOut, this);
            _object.events.onInputUp.add(_this.onHoverOut, this);
        }

        mainGroup.update = function() {
            var worldPos = _options.targetObject ? _options.targetObject.world : game.world;
            game.world.bringToTop(_this.tooltipContent);
            game.world.bringToTop(tooltipBG);
            if (/*worldPos.x !== mainGroup.initialWorldX &&*/ !_fixedToCamera) {
                //updatePosition();

                var auxX = Math.round((10 * Math.round(this.game.input.worldX / 16) * 16)/_this.originalPosition.x);
                var auxY = Math.round((10 * Math.round(this.game.input.worldY / 16) * 16)/_this.originalPosition.y);

                if(worldPos.x < mainGroup.width/2.5)
                    auxX = mainGroup.width/2.5 - worldPos.x/2 + 5;
                else if(worldPos.x + mainGroup.width/2 > 1430){
                    auxX = 1430 - (worldPos.x + mainGroup.width/2 + 10);
                }

                if(worldPos.y - mainGroup.height + auxY < 47)
                    auxY = 47 - mainGroup.height - worldPos.y + 25;
                    

                _this.tooltipContent.x = auxX;
                _this.tooltipContent.y = auxY;
                tooltipBG.x = auxX - 5;
                tooltipBG.y = auxY - 3;
            }
        }
    };

    this.createTooltips();

    return {
        printOptions: function() {
            _this.printOptions();
        },
        updatePosition: function(x, y) {
            _this.mainGroup.x = x;
            _this.mainGroup.y = y;
        },
        destroy: function() {
            _this.mainGroup.removeChildren();
            _this.mainGroup.destroy();
        },
        hideTooltip: function() {
            _this.mainGroup.visible = false;
            _this.mainGroup.alpha = 0;
        },
        showTooltip: function() {
            _this.mainGroup.visible = true;
            _this.mainGroup.alpha = 1;
        },
        simulateOnHoverOver: function () {
            _this.onHoverOver();
        },
        simulateOnHoverOut: function () {
            _this.onHoverOut();
        },
        updateContent: function(string) {
            _this.tooltipContent.text = string;
        },
        toggleTooltip: function(bool) {
            _this.enabled = bool;
        }
    };
};

if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = Phasetips;
}

},{}],2:[function(require,module,exports){
var Phasetips = require("./Phasetips.js");

function House(game, x, y, img, hospitalNear = false) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.residentA = undefined;
    this.residentB = undefined;
    this.hospitalNear = hospitalNear;
    this.full = false;
    this.numberOfBirths = 0;

    this.img = img;

    this.tooltip = new Phasetips(this.game, {
        targetObject: this,
        context: "Hospital in range! MMMMMMMMMMMMMMM: 100 old (Not Great) MMMMMMMMMMMMMMM: 100 old (Not Great)",
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 30,   
        animation: "fade",
        fixedToCamera: false
      });

      this.tooltip.updateContent("Empty");
}


House.prototype = Object.create(Phaser.Sprite.prototype);
House.constructor = House;

House.prototype.add = function(citizen) {

    var added = false;

    if(this.residentA === undefined){
        this.residentA = citizen;
        added = true;
        this.residentA.consume = 3;
    }

    else if(this.residentB === undefined){
        this.residentB = citizen;
        added = true;
        this.residentB.consume = 3;
    }

    this.full = (this.residentA !== undefined && this.residentB !== undefined);

    this.updateTooltip();

    return added;
};

House.prototype.updateHospitals = function(hospitalGroup) {

    this.hospitalNear = false;

    hospitalGroup.forEach(function(hospital){
        if(!this.hospitalNear)
            this.hospitalNear = hospital.checkArea(hospital, this) && !hospital.off;
    }, this);

    this.updateTooltip();
};

House.prototype.updateSingleHospital = function(hospital) {

    if(hospital.checkArea(hospital, this))
        this.hospitalNear = !hospital.off;

    this.updateTooltip();
};

House.prototype.kill = function(citizen) {
    if(this.residentA == citizen){
        this.residentA = undefined;
        this.full = false;
    }

    else if(this.residentB == citizen){
        this.residentB = undefined;
        this.full = false;
    }

    this.updateTooltip();
};

House.prototype.bulldoze = function(homelessArray) {
    
    if(this.residentA !== undefined){
        this.residentA.homeless = true;
        homelessArray.unshift(this.residentA);
        this.residentA.consume = 5;
    }
    if(this.residentB !== undefined){
        this.residentB.homeless = true;
        homelessArray.unshift(this.residentB);
        this.residentB.consume = 5;
    }

    this.tooltip.destroy();
};

House.prototype.tick = function(foodAmount, waterAmount){
    this.numberOfBirths = 0;

    if(this.residentA !== undefined){
        this.residentA.tick(foodAmount, waterAmount, this.hospitalNear);
        if(this.residentA !== undefined && this.residentA.givingBirth){
            this.residentA.givingBirth = false;
            this.residentA.birthCooldown = 10;
            this.numberOfBirths++;
        }
    }

    if(this.residentB !== undefined){
        this.residentB.tick(foodAmount, waterAmount, this.hospitalNear);
        if(this.residentB !== undefined && this.residentB.givingBirth){
            this.residentB.givingBirth = false;
            this.residentB.birthCooldown = 10;
            this.numberOfBirths++;
        }
    }
    
    this.updateTooltip();
};

House.prototype.updateTooltip = function() {

    var nameA = "Empty";
    var nameB = "Empty";
    var ageA = "";
    var ageB = "";
    var healthA = "";
    var healthB = "";
    var hospital = "";
    
    if(this.residentA !== undefined){

        var aux = this.residentA.health;

        if(aux >= 75)
            healthA = "Healthy";
        else if(aux >= 50)
            healthA = "Okay";
        else if(aux >= 25)
            healthA = "Not great";
        else
            healthA = "Dying";

        nameA = this.residentA.name;
        ageA = this.residentA.age;
    }

    if(this.residentB !== undefined){

        var aux = this.residentB.health;

        if(aux >= 75)
            healthB = "Healthy";
        else if(aux >= 50)
            healthB = "Okay";
        else if(aux >= 25)
            healthB = "Not great";
        else
            healthB = "Dying";

        nameB = this.residentB.name;
        ageB = this.residentB.age;
    }

    if(this.hospitalNear)
        hospital = "Hospital in range! \n"

    if (nameA != "Empty"){
        if(nameB == "Empty")
            this.tooltip.updateContent(hospital + nameA + ": " + ageA + " old " + "(" + healthA + ")" + "\n" + nameB);
        else
            this.tooltip.updateContent(hospital + nameA + ": " + ageA + " old " + "(" + healthA + ")" + "\n" + nameB + ": " + ageB + " old " + "(" + healthB + ")");
    }
    else if(nameB != "Empty")
        this.tooltip.updateContent(hospital + nameA + "\n" + nameB + ": " + ageB + " old " + "(" + healthB + ")");
    else
        this.tooltip.updateContent(hospital + nameA+ "\n" + nameB);
};

House.prototype.countCitizens = function(){
    return ((this.residentA !== undefined) + (this.residentB !== undefined));
};

House.prototype.serializeCitizens = function(){

    var obj = {};

    if(this.residentA !== undefined)
        obj.residentA = JSON.parse(this.residentA.serialize());
    if(this.residentB !== undefined)
        obj.residentB = JSON.parse(this.residentB.serialize());

    return JSON.stringify(obj);

};

House.prototype.serialize = function() {

        var fields = [
            "x",
            "y",
            "img",
            'hospitalNear',
            'full'
        ];
    
        var obj = {};
    
        for (var i in fields) {
            var field = fields[i];
            obj[field] = this[field];
        }

        return JSON.stringify(obj);
};

House.unserialize = function(state, game) {
    
	if (typeof state === 'string') {
		state = JSON.parse(state);
    }
    
	var instance = new House(game, state.x, state.y, state.img, state.hospitalNear);
    
	for (var i in state) {
		instance[i] = state[i];
	}

	return instance;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Producer(game, x, y, img, amount, consume = 0) { 
    Phaser.Sprite.call(this, game, x, y, img);
    this.consume = consume;
    this.workerA = undefined;
    this.workerB = undefined;
    this.dataA = "";
    this.dataB = "";
    this.full = false;
    this.img = img;
    this.workers = true;

    this.totalAmount = amount;
    this.amount = 0;

    this.off = true;

    this.tooltip = new Phasetips(this.game, {
        targetObject: this,
        context: "building offline, production halved \n",
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 30,   
        animation: "fade",
        fixedToCamera: false
      });

    this.tooltip.updateContent("Empty");
}
Producer.prototype = Object.create(Phaser.Sprite.prototype);
Producer.constructor = Producer;

Producer.prototype.add = function(citizen) {

    var added = false;

    if(this.workerA === undefined){
        this.workerA = citizen;
        this.dataA = this.workerA.name;
        added = true;
    }

    else if(this.workerB === undefined){
        this.workerB = citizen;
        this.dataB = this.workerB.name;
        added = true;
    }

    this.full = (this.workerA !== undefined && this.workerB !== undefined);
    
    this.updateTooltip();

    return added;
};

Producer.prototype.updateAmount = function() {
    if (this.workerA === undefined && this.workerB === undefined)
        this.amount = 0;

    else if (!this.full)
        this.amount = 0.5 * this.totalAmount;

    else
        this.amount = this.totalAmount;

    if (this.off)
        this.amount = (this.amount * 0.5);

    this.amount = Math.round(this.amount);

    this.updateTooltip();
};

Producer.prototype.kill = function(citizen) {
    if(this.workerA == citizen){
        this.workerA = undefined;
        this.full = false;
    }

    else if(this.workerB == citizen){
        this.workerB = undefined;
        this.full = false;
    }

    this.updateTooltip();
};

Producer.prototype.bulldoze = function(unemployedArray) {
    
    if(this.workerA !== undefined){
        this.workerA.unemployed = true;
        unemployedArray.unshift(this.workerA);
    }
    if(this.workerB !== undefined){
        this.workerB.unemployed = true;
        unemployedArray.unshift(this.workerB);
    }
    
    this.tooltip.destroy();
};

Producer.prototype.updateTooltip = function() {

    var nameA = "Empty";
    var nameB = "Empty";
    var onOff = "Building online, production at max";
    
    if(this.workerA !== undefined){

        nameA = this.workerA.name;
    }

    if(this.workerB !== undefined){

        nameB = this.workerB.name;
    }

    if(this.off)
        onOff = "Building offline, production halved"

    if (nameA !== "Empty")
        this.tooltip.updateContent(onOff + "\n" + nameA + "\n" + nameB);
    else
        this.tooltip.updateContent(onOff + "\n" + nameA);
};

Producer.prototype.serialize = function() {

        var fields = [
            "x",
            "y",
            "img",
            'consume',
            'full',
            'totalAmount',
            'off'
        ];
    
        var obj = {};
    
        for (var i in fields) {
            var field = fields[i];
            obj[field] = this[field];
        }

        return JSON.stringify(obj);
};

Producer.unserialize = function(state, game) {
    
	if (typeof state === 'string') {
		state = JSON.parse(state);
    }
    
	var instance = new Producer(game, state.x, state.y, state.img, state.amount, state.consume);
    
	for (var i in state) {
		instance[i] = state[i];
	}

	return instance;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Hospital(game, x, y, img, amount) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.area = 16; //in tiles
    this.full = false;
    this.consume = amount;
    this.workers = false;
    this.img = img;

    this.off = true;

    this.tooltip = new Phasetips(this.game, {
        targetObject: this,
        context: "building offline, production halved",
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 30,   
        animation: "fade",
        fixedToCamera: false
      });

    this.tooltip.updateContent("Empty");
}
Hospital.prototype = Object.create(Phaser.Sprite.prototype);
Hospital.constructor = Hospital;

Hospital.prototype.updateTooltip = function() {

    var onOff = "Building online, working";

    if(this.off)
        onOff = "Building offline"

    this.tooltip.updateContent(onOff);
};

Hospital.prototype.bulldoze = function(){
    
    this.tooltip.destroy();
    
};

Hospital.prototype.checkArea = function(a, b){

    var x = Phaser.Rectangle.clone(a);
    x.x -= (this.area * 16)/2;
    x.y -= (this.area * 16)/2;
    x.width += this.area * 16 - 1;
    x.height += this.area * 16 - 1;
    var y = Phaser.Rectangle.clone(b);
    y.width--;
    y.height--;

    var ret = Phaser.Rectangle.intersects(x, y)

    return ret;
};

Hospital.prototype.serialize = function() {

        var fields = [
            "x",
            "y",
            "img",
            'consume',
            'full',
            'off'
        ];
    
        var obj = {};
    
        for (var i in fields) {
            var field = fields[i];
            obj[field] = this[field];
        }

        return JSON.stringify(obj);
};

Hospital.unserialize = function(state, game) {
    
	if (typeof state === 'string') {
		state = JSON.parse(state);
    }
    
	var instance = new Hospital(game, state.x, state.y, state.img, state.consume);
    
	for (var i in state) {
		instance[i] = state[i];
	}

	return instance;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Road(game, x, y, img) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.get = "fucked";

    this.img = img;
}
Road.prototype = Object.create(Phaser.Sprite.prototype);
Road.constructor = Road;

Road.prototype.serialize = function() {

        var fields = [
            "x",
            "y",
            "img"
        ];
    
        var obj = {};
    
        for (var i in fields) {
            var field = fields[i];
            obj[field] = this[field];
        }

        return JSON.stringify(obj);
};

Road.unserialize = function(state, game) {
    
	if (typeof state === 'string') {
		state = JSON.parse(state);
    }
    
	var instance = new Road(game, state.x, state.y, state.img);
    
	for (var i in state) {
		instance[i] = state[i];
    }

	return instance;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Citizen(homelessArray, unemployedArray, names, surnames, age = 0, health = 65) {
    
    this.name = names[Math.round(Math.random() * names.length - 1)] + " " + surnames[Math.round(Math.random() * surnames.length - 1)];

    this.age = age;
    this.health = health;
    this.homeless = true;
    this.unemployed = true;
    this.birthCooldown = 0;
    this.givingBirth = false;
    this.home;
    this.job;
    
    homelessArray.unshift(this);
    unemployedArray.unshift(this);


    this.consume = 5;
    this.minAge = 20;
    this.maxAge = 75;
}
Citizen.constructor = Citizen;

Citizen.prototype.addToHouse = function (houseGroup, houseX = -1, houseY = -1){
    var found = false;

    houseGroup.forEach(function (house) {
        if(houseX >= 0 && houseY >= 0){
            if(house.x == houseX && house.y == houseY){
                house.add(this);
                found = true;
                this.homeless = false;
                this.consume = 3;
                this.home = house;
            }
        }

        else if(!house.full && !found){
            if(house.add(this)){
                found = true;
                this.homeless = false;
                this.consume = 3;
                this.home = house;
            }
        }
    }, this);

    return found;
};

Citizen.prototype.addToProducer = function (producerGroup, prodX = -1, prodY = -1){
    var found = false;

    producerGroup.forEach(function (group) {
        group.forEach(function (producer) {
            if(prodX >= 0 && prodY >= 0){
                if(producer.x == prodX && producer.y == prodY){
                    producer.add(this);
                    found = true;
                    this.unemployed = false;
                    this.job = producer;
                    producer.updateAmount();
                }
            }
    
            else if(!producer.full && !found && producer.hospitalNear === undefined && producer.workers){
                if(producer.add(this)){
                    found = true;
                    this.unemployed = false;
                    this.job = producer;
                    producer.updateAmount();
                }
            }
        }, this);
    }, this);

    return found;
};

Citizen.prototype.tick = function(foodAmount, waterAmount, healing){
    this.age++;

    if(this.age > this.maxAge)
    {
        this.health -= 20;
    }    

    if(this.birthCooldown > 0)
        this.birthCooldown--;

    if(foodAmount <= this.consume)
        this.health -= 5;
    else 
        this.health += 2;

    if(waterAmount <= this.consume)
        this.health -= 5;
    else 
        this.health += 2;

    if(healing)
        this.health += 10;
        
    if (!this.homeless && this.home.full && this.birthCooldown <= 0 && this.age >= this.minAge && this.age <= this.maxAge){
        var aux = Math.floor((Math.random() * 100) + 1);
        if(aux <= 10)
            this.givingBirth = true;
    }
    
    else if(this.homeless)
        this.health -= 5;

    if (this.health >= 100)
        this.health = 100;

    else if (this.health < 1){
        if(!this.homeless)
            this.home.kill(this);
        if(!this.unemployed)
            this.job.kill(this);
    }
};

Citizen.prototype.serialize = function() {

        var fields = [
            "name",
            "age",
            "health",
            'homeless',
            'unemployed',
            'birthCooldown',
            "givingBirth"
        ];
    
        var obj = {};
    
        for (var i in fields) {
            var field = fields[i];
            obj[field] = this[field];
        }

        if(!this.homeless) {
            obj.houseX = this.home.x;
            obj.houseY = this.home.y;
        }
        else {
            obj.houseX = -1;
            obj.houseY = -1;
        }

        if(!this.unemployed) {
            obj.jobX = this.job.x;
            obj.jobY = this.job.y;
        }
        else {
            obj.jobX = -1;
            obj.jobY = -1;
        }

        return JSON.stringify(obj);
};

Citizen.unserialize = function(state, homelessArray, unemployedArray, names, surnames, houseGroup, producerGroup) {
    
	if (typeof state === 'string') {
		state = JSON.parse(state);
    }
    
	var instance = new Citizen(homelessArray, unemployedArray, names, surnames);
    
	for (var i in state) {
		instance[i] = state[i];
    }
    
    if(state.houseX >= 0 && state.houseY >= 0)
        instance.addToHouse(houseGroup, state.houseX, state.houseY);
    
    if(state.jobX >= 0 && state.jobY >= 0)
        instance.addToProducer(producerGroup, state.jobX, state.jobY);

	return instance;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    Road: Road,
    House: House,
    Producer: Producer,
    Hospital: Hospital,
    Citizen: Citizen
};
},{"./Phasetips.js":1}],3:[function(require,module,exports){
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

      this.game.load.image('logo', 'images/logo.png');

      
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
      this.game.load.spritesheet('clearBttn', 'images/menu/MenuButtons/clear.png', 55, 48);
      this.game.load.spritesheet('plusBttn', 'images/menu/MenuButtons/plus.png', 55, 48);
      this.game.load.spritesheet('minusBttn', 'images/menu/MenuButtons/minus.png', 55, 48);
      this.game.load.spritesheet('backBttn', 'images/menu/MenuButtons/back.png', 55, 48);
      this.game.load.spritesheet('muteBttn', 'images/menu/MenuButtons/mute.png', 55, 48);
      this.game.load.spritesheet('playBttn', 'images/menu/MenuButtons/play.png', 55, 48);
      this.game.load.spritesheet('tutorialBttn', 'images/menu/MenuButtons/tuto.png', 55, 48);
      this.game.load.spritesheet('saveBttn', 'images/menu/MenuButtons/save.png', 55, 48);
      this.game.load.spritesheet('infoBttn', 'images/menu/MenuButtons/info.png', 55, 48);


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

      if(!this.game.volume)
        this.game.volume = 20;

      if(!this.game.menuMusic){

        this.game.menuMusic = this.game.add.sound('menuSound', 1, true);
        this.game.menuMusic.loop = true;
      }
      
      if(!this.game.menuMusic.isPlaying){
        this.game.menuMusic.play();
        this.game.menuMusic.volume = this.game.volume / 100;
      }
      
      this.game.buttonSound = this.game.add.audio('buttonSound');

    ////////////////////////////////////////
    //interface

      this.background = this.game.add.sprite(0, 0, "mainBkg");
      this.background.smoothed = false;

      this.logo = this.game.add.sprite(this.game.camera.x + (this.game.width/2), this.game.camera.y + (this.game.height/4), "logo");
      this.logo.anchor.setTo(0.5, 0.5);
      this.logo.smoothed = false;

      this.load = this.game.add.button(this.game.camera.x + this.game.width/2, this.game.camera.y + (this.game.height/1.8), 'saveBttn', this.gameLoad, this, 0, 0, 1);
      this.load.anchor.setTo(0.5, 0.5);
      this.load.scale.setTo(3, 3);
      this.load.smoothed = false;
      this.load.onDownSound = this.game.buttonSound;

      this.loadtxt = this.game.add.text(this.load.x, this.load.y + this.game.height/6, "Load", {font: "console", fontSize: 50, fill: "#000000", align: "center" });
      this.loadtxt.anchor.setTo(0.5, 0.5);
      this.loadtxt.smoothed = false;

      this.play = this.game.add.button(this.load.left - 100, this.load.y, 'playBttn', this.gameStart, this, 0, 0, 1);
      this.play.anchor.setTo(0.5, 0.5);
      this.play.scale.setTo(3, 3);
      this.play.smoothed = false;
      this.play.onDownSound = this.game.buttonSound;

      this.playtxt = this.game.add.text(this.play.x, this.play.y + this.game.height/6, "Play", {font: "console", fontSize: 50, fill: "#000000", align: "center" });
      this.playtxt.anchor.setTo(0.5, 0.5);
      this.playtxt.smoothed = false;

      this.tutorial = this.game.add.button(this.load.right + 100, this.load.y, 'tutorialBttn', this.tutorialStart, this, 0, 0, 1);
      this.tutorial.anchor.setTo(0.5, 0.5);
      this.tutorial.scale.setTo(3, 3);
      this.tutorial.smoothed = false;
      this.tutorial.onDownSound = this.game.buttonSound;

      this.tutorialtxt = this.game.add.text(this.tutorial.x, this.tutorial.y + this.game.height/6, "Tutorial", {font: "console", fontSize: 50, fill: "#000000", align: "center" });
      this.tutorialtxt.anchor.setTo(0.5, 0.5);
      this.tutorialtxt.smoothed = false;

      this.options = this.game.add.button(this.load.x, this.game.camera.y + 3.55 * (this.game.height/4), "settBttn", function(){this.optionsMain.visible = true; this.game.world.bringToTop(this.optionsMain); this.play.inputEnabled = false; this.options.inputEnabled = false; this.load.inputEnabled = false; this.tutorial.inputEnabled = false;}, this, 0, 0, 1);
      this.options.anchor.setTo(.5, .5);
      this.options.smoothed = false;
      this.options.onDownSound = this.game.buttonSound;

      this.optionsTxt = this.game.add.text(this.options.x, this.options.y + this.game.height/15, "Options", {font: "console", fontSize: 40, fill: "#000000", align: "center" });
      this.optionsTxt.anchor.setTo(0.5, 0.5);
      this.optionsTxt.smoothed = false;

      this.info = this.game.add.button(this.play.x, this.game.camera.y + 3.55 * (this.game.height/4), "infoBttn", this.goinfo, this, 0, 0, 1);
      this.info.anchor.setTo(.5, .5);
      this.info.smoothed = false;
      this.info.onDownSound = this.game.buttonSound;

      this.infoTxt = this.game.add.text(this.info.x, this.info.y + this.game.height/15, "Info", {font: "console", fontSize: 40, fill: "#000000", align: "center" });
      this.infoTxt.anchor.setTo(0.5, 0.5);
      this.infoTxt.smoothed = false;

      this.deleteSave = this.game.add.button(this.tutorial.x, this.game.camera.y + 3.55 * (this.game.height/4), "clearBttn", this.clearSave, this, 0, 0, 1);
      this.deleteSave.anchor.setTo(.5, .5);
      this.deleteSave.smoothed = false;
      this.deleteSave.onDownSound = this.game.buttonSound;

      this.deleteTxt = this.game.add.text(this.deleteSave.x, this.deleteSave.y + this.game.height/15, "Delete save", {font: "console", fontSize: 40, fill: "#000000", align: "center" });
      this.deleteTxt.anchor.setTo(0.5, 0.5);
      this.deleteTxt.smoothed = false;

    ////////////////////////////////////////
    //volume menu

      this.optionsMain = this.game.add.group();

      var optionsBkg = this.game.add.sprite(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2, "optionsBkg");
      optionsBkg.anchor.setTo(.5, .5);
      optionsBkg.fixedToCamera = true;
      optionsBkg.smoothed = false;

      this.optionsMain.add(optionsBkg);

      var volumeText = this.game.add.text(optionsBkg.x, optionsBkg.y - 20, this.game.volume, {font: "50px console"});
      volumeText.anchor.setTo(0.5, 0.5);
      volumeText.fixedToCamera = true;
      volumeText.smoothed = false;

      this.optionsMain.add(volumeText);

      var optionsMinus = this.game.add.button(optionsBkg.x - 77, optionsBkg.y - 20, "minusBttn", function(){this.updateVolume(-5);}, this, 0, 0, 1);
      optionsMinus.anchor.setTo(0.5, 0.5);
      optionsMinus.fixedToCamera = true;
      optionsMinus.smoothed = false;
      optionsMinus.onDownSound = this.game.buttonSound;

      this.optionsMain.add(optionsMinus);
      
      var optionsPlus = this.game.add.button(optionsBkg.x + 77, optionsBkg.y - 20, "plusBttn", function(){this.updateVolume(5);}, this, 0, 0, 1);
      optionsPlus.anchor.setTo(0.5, 0.5);
      optionsPlus.fixedToCamera = true;
      optionsPlus.smoothed = false;
      optionsPlus.onDownSound = this.game.buttonSound;

      this.optionsMain.add(optionsPlus);

      var optionsBack = this.game.add.button(optionsBkg.x - 47, optionsBkg.y + 48, "backBttn", function(){this.optionsMain.visible = false; this.play.inputEnabled = true; this.options.inputEnabled = true; this.load.inputEnabled = true; this.tutorial.inputEnabled = true;}, this, 0, 0, 1);
      optionsBack.anchor.setTo(0.5, 0.5);
      optionsBack.fixedToCamera = true;
      optionsBack.smoothed = false;
      optionsBack.onDownSound = this.game.buttonSound;

      this.optionsMain.add(optionsBack);

      var optionsMute = this.game.add.button(optionsBkg.x + 47, optionsBkg.y + 48, "muteBttn", function(){this.mute();}, this, 0, 0, 1);
      if(this.game.sound.mute)
        optionsMute.setFrames(2, 2, 3);
      optionsMute.anchor.setTo(0.5, 0.5);
      optionsMute.fixedToCamera = true;
      optionsMute.smoothed = false;
      optionsMute.onDownSound = this.game.buttonSound;

      this.optionsMain.add(optionsMute);

      this.optionsMain.visible = false;

    },

    updateVolume: function(update){
      if(this.game.volume + update >= 0 && this.game.volume + update <= 100){

        this.game.volume += update;
        this.game.menuMusic.volume = this.game.volume / 100;

        this.optionsMain.forEach(function(text){
          if (text.text !== null)
            text.text = this.game.volume;
          }, this);
      }
    },

    mute: function(){
      this.game.sound.mute = !this.game.sound.mute;
      this.optionsMain.forEach(function(button){
        if(button.key == "muteBttn"){
          if(this.game.sound.mute)
            button.setFrames(2, 2, 3);
          else
            button.setFrames(0, 0, 1);
        }
      }, this);
    },

    gameStart: function() {
      this.game.menuMusic.stop();
      this.optionsMain.destroy();
      this.game.state.start('play', true, false, 0, false);
    },

    tutorialStart: function() {
      this.game.menuMusic.stop();
      this.optionsMain.destroy();
      this.game.state.start('tutorial', true, false, 1, false);
    },

    goinfo: function() {
      this.optionsMain.destroy();
      this.game.state.start('info');
    },

    gameLoad: function() {
      var state = localStorage.getItem('save');
      if (state) {
        this.game.menuMusic.stop();
        this.optionsMain.destroy();
        this.game.state.start('play', true, false, 0, true);
      }
    },

    clearSave: function() {
      localStorage.removeItem("save");
      this.optionsMain.destroy();
      this.game.state.start('main');
    }
  };

  var WinLossState = {
    init: function(state){
      this.state = state;
    },

    create: function(){
      this.game.buttonSound = this.game.add.audio('buttonSound');

    ////////////////////////////////////////
    //interface

      this.background = this.game.add.sprite(0, 0, "mainBkg");
      this.background.smoothed = false;

      this.play = this.game.add.button(this.game.camera.x + this.game.width/2, this.game.camera.y + (this.game.height/1.8), 'playBttn', this.gameStart, this, 0, 0, 1);
      this.play.anchor.setTo(0.5, 0.5);
      this.play.scale.setTo(3, 3);
      this.play.smoothed = false;
      this.play.onDownSound = this.game.buttonSound;

      this.playtxt = this.game.add.text(this.play.x, this.play.y + this.game.height/6, "Play Again", {font: "console", fontSize: 40, fill: "#ffffff", align: "center" });
      this.playtxt.anchor.setTo(0.5, 0.5);
      this.playtxt.smoothed = false;

      this.menu = this.game.add.button(this.game.camera.x + (this.game.width/2 + 100), this.game.camera.y + (this.game.height/1.8), 'backBttn', this.goMenu, this, 0, 0, 1);
      this.menu.anchor.setTo(0.5, 0.5);
      this.menu.scale.setTo(3, 3);
      this.menu.smoothed = false;
      this.menu.onDownSound = this.game.buttonSound;

      this.menutxt = this.game.add.text(this.menu.x, this.menu.y + this.game.height/6, "Main Menu", {font: "console", fontSize: 40, fill: "#ffffff", align: "center" });
      this.menutxt.anchor.setTo(0.5, 0.5);
      this.menutxt.smoothed = false;

      if(this.state == 0)
        this.txt = this.game.add.text(this.game.camera.x + (this.game.width/2), this.game.camera.y + (this.game.height/5), "All your citizens have perished,\n and now society is forever doomed. \n \n GAME OVER", {font: "console", fontSize: 60, fill: "#ffffff", align: "center" });
      else
        this.txt = this.game.add.text(this.game.camera.x + (this.game.width/2), this.game.camera.y + (this.game.height/5), "Congratulations!\n You managed to build a sustainable city and maintain society. \n \n YOU WIN!", {font: "console", fontSize: 60, fill: "#ffffff", align: "center" });
      this.txt.anchor.setTo(0.5, 0.5);
      this.txt.smoothed = false;
    },

    gameStart: function() {
      this.game.state.start('play', true, false, 0, false);
    },

    goMenu: function(){
      this.game.state.start('main');
    }
  };

  var infoState = {
    create: function(){
      this.game.buttonSound = this.game.add.audio('buttonSound');

    ////////////////////////////////////////
    //interface
     
      this.background = this.game.add.sprite(0, 0, "mainBkg");
      this.background.smoothed = false;
  
      this.infoTxt = this.game.add.text(this.game.width/2, this.game.height/5, ("Project Settlers is a resource management game in which you will have\nto guide your citizens after a nuclear war, which has made life even\n more difficult (and turned water green)."), {font: "console", fontSize: 30, fill: "#000000", align: "center"});
      this.infoTxt.anchor.setTo(0.5, 0.5);
      this.infoTxt.smoothed = false;

      this.controlsTxt = this.game.add.text(this.infoTxt.x, this.infoTxt.y + 125, ("Controls: \n Camera movement: WASD/Arrow keys \n Interact: Left Click"), {font: "console", fontSize: 30, fill: "#000000", align: "center"});
      this.controlsTxt.anchor.setTo(0.5, 0.5);
      this.controlsTxt.smoothed = false;

      this.controlsUnderline = this.game.add.graphics(this.controlsTxt.left, this.controlsTxt.bottom - 65);
      this.controlsUnderline.lineStyle(2, 0x000000);
      this.controlsUnderline.moveTo(this.controlsTxt.width- 225, 0);
      this.controlsUnderline.lineTo(this.controlsTxt.width - 140, 0);

      this.creatorsTxt = this.game.add.text(this.controlsTxt.x, this.controlsTxt.y + 100, ("Project Settlers has been created by:"), {font: "console", fontSize: 30, fill: "#000000", align: "center"});
      this.creatorsTxt.anchor.setTo(0.5, 0.5);
      this.creatorsTxt.smoothed = false;
  
      this.javiTxt = this.game.add.text(this.infoTxt.x - 100, this.creatorsTxt.y + 50, ("Javier Arias"), {font: "console", fontSize: 30, fill: "#000000", align: "center"});
      this.javiTxt.anchor.setTo(0.5, 0.5);
      this.javiTxt.smoothed = false;
      this.javiTxt.inputEnabled = true;
      this.javiTxt.events.onInputOver.add(this.over, this);
      this.javiTxt.events.onInputOut.add(this.out, this);
      this.javiTxt.events.onInputDown.add(this.down1, this);

      this.javiUnderline = this.game.add.graphics(this.javiTxt.left, this.javiTxt.bottom - 7);
      this.javiUnderline.lineStyle(2, 0x000000);
      this.javiUnderline.moveTo(0, 0);
      this.javiUnderline.lineTo(this.javiTxt.width, 0);
  
      this.ignacioTxt = this.game.add.text(this.infoTxt.x + 100, this.creatorsTxt.y + 50, ("Ignacio Ory"), {font: "console", fontSize: 30, fill: "#000000", align: "center"});
      this.ignacioTxt.anchor.setTo(0.5, 0.5);
      this.ignacioTxt.smoothed = false;
      this.ignacioTxt.inputEnabled = true;
      this.ignacioTxt.events.onInputOver.add(this.over, this);
      this.ignacioTxt.events.onInputOut.add(this.out, this);
      this.ignacioTxt.events.onInputDown.add(this.down2, this);

      this.ignacioUnderline = this.game.add.graphics(this.ignacioTxt.left, this.ignacioTxt.bottom - 7);
      this.ignacioUnderline.lineStyle(2, 0x000000);
      this.ignacioUnderline.moveTo(0, 0);
      this.ignacioUnderline.lineTo(this.ignacioTxt.width, 0);

      this.licenseTxt = this.game.add.text(this.infoTxt.x, this.javiTxt.y + 75, ("Published under the Creative Commons \nAttribution-NonCommercial-ShareAlike license."), {font: "console", fontSize: 30, fill: "#000000", align: "center"});
      this.licenseTxt.anchor.setTo(0.5, 0.5);
      this.licenseTxt.smoothed = false;
      this.licenseTxt.inputEnabled = true;
      this.licenseTxt.events.onInputOver.add(this.over, this);
      this.licenseTxt.events.onInputOut.add(this.out, this);
      this.licenseTxt.events.onInputDown.add(this.down3, this);
      this.licenseUnderline2 = this.game.add.graphics(this.licenseTxt.left, this.licenseTxt.bottom - 35);
      this.licenseUnderline2.lineStyle(2, 0x000000);
      this.licenseUnderline2.moveTo(20, 0);
      this.licenseUnderline2.lineTo(this.licenseTxt.width - 35, 0);
      this.licenseUnderline = this.game.add.graphics(this.licenseTxt.left, this.licenseTxt.bottom - 7);
      this.licenseUnderline.lineStyle(2, 0x000000);
      this.licenseUnderline.moveTo(0, 0);
      this.licenseUnderline.lineTo(this.licenseTxt.width, 0);
  
      this.back = this.game.add.button(this.game.camera.x + this.game.width/2, this.game.camera.y + 3.55 * (this.game.height/4), "backBttn", this.goMenu, this, 0, 0, 1);
      this.back.anchor.setTo(0.5, 0.5);
      this.back.fixedToCamera = true;
      this.back.smoothed = false;
      this.back.onDownSound = this.game.buttonSound;
  
      this.backTxt = this.game.add.text(this.back.x, this.back.y + this.game.height/15, "Back", {font: "console", fontSize: 40, fill: "#000000", align: "center" });
      this.backTxt.anchor.setTo(0.5, 0.5);
      this.backTxt.smoothed = false;

    },

    over: function(item) {
      item.fill = "#ff0044";
    },
    
    out: function(item) {
        item.fill = "#000000";
    },
    
    down1: function(item) {
      window.open("http://github.com/javiarias", "_blank");
    },
  
    down2: function(item) {
      window.open("http://github.com/IgnOry", "_blank");
    },

    down3: function(item) {
      window.open("http://creativecommons.org/licenses/by-nc-sa/4.0/", "_blank");
    },

    goMenu: function(){
      this.game.state.start('main');
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
    game.state.add('defeat', WinLossState);
    game.state.add('win', WinLossState);
    game.state.add('info', infoState);


    game.state.start('boot');
};

},{"./play_scene.js":4}],4:[function(require,module,exports){
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
    this.uraniumGroup.produce = 2;

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
      height: 110,
      context: "Water:\n  Provides 3 Water/hour max.\nCost:\n  10 Wood, 10 Stone, optional 1 Energy/hour",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipCrop = new Phasetips(this.game, {
      targetObject: this.cropBttn,
      width: 250,
      height: 110,
      context: "Farm:\n  Provides 3 Food/hour max.\nCost:\n  10 Wood, 10 Stone, optional 1 Energy/hour",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipStone = new Phasetips(this.game, {
      targetObject: this.stoneBttn,
      width: 250,
      height: 110,
      context: "Quarry:\n  Produces 1 Stone/hour max.\nCost:\n  15 Wood, 15 Stone, optional 3 Energy/hour",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipWood = new Phasetips(this.game, {
      targetObject: this.woodBttn,
      width: 250,
      height: 110,
      context: "Sawmill:\n  Produces 1 Wood/hour max.\nCost:\n  15 Wood, 10 Stone, optional 3 Energy/hour",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });
    
    this.tipUranium = new Phasetips(this.game, {
      targetObject: this.uraniumBttn,
      width: 200,
      height: 110,
      context: "Uranium Mine:\n  Mines 2 Uranium/hour max.\nCost:\n  30 Wood, 30 Stone, optional 3 Energy/hour",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipWind = new Phasetips(this.game, {
      targetObject: this.windBttn,
      width: 250,
      height: 110,
      context: "Wind Turbine:\n  Produces 5 Energy/hour max for free.\nCost:\n  30 Wood, 45 Stone",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipEnergy = new Phasetips(this.game, {
      targetObject: this.energyBttn,
      width: 250,
      height: 125,
      context: "Nuclear Plant:\n  Produces 10 Energy/hour max by consuming Uranium when online.\nCost:\n  30 Wood, 35 Stone, 4 Uranium/hour",
      strokeColor: 0xff0000,
      position: "top",
      positionOffset: 50,   
      
      animation: "fade"
    });

    this.tipHospital = new Phasetips(this.game, {
      targetObject: this.hospitalBttn,
      width: 270,
      height: 100,
      context: "Hospital:\n  Used to heal your citizens.\nCost:\n  25 Wood, 25 Stone, 4 Energy/hour",
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
        height: 195,
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
        height: 145,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialWood = new Phasetips(this.game, {
        targetObject: this.woodBttn,
        context: "Nothing is free, and you will need resources to create more buildings. Let's build a Sawmill",
        width: 250,
        height: 130,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 115,   
        animation: "fade"
      });

      this.tipTutorialStone = new Phasetips(this.game, {
        targetObject: this.stoneBttn,
        context: "You will need Stone as well, so let's will build a Quarry",
        width: 250,
        height: 125,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialUranium = new Phasetips(this.game, {
        targetObject: this.uraniumBttn,
        context: "Uranium is a source of energy. Build Mines to extract it",
        width: 200,
        height: 125,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialEnergy = new Phasetips(this.game, {
        targetObject: this.energyBttn,
        context: "Energy is a need. Without energy to power your buildings, their production will be halved! \nWith this you can produce energy from uranium",
        width: 250,
        height: 200,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialWind = new Phasetips(this.game, {
        targetObject: this.windBttn,
        context: "This building allows you to obtain energy without uranium, thanks to the power of wind",
        width: 250,
        height: 145,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });

      this.tipTutorialHospital = new Phasetips(this.game, {
        targetObject: this.hospitalBttn,
        context: "Hospitals allow you to improve the health of citizens. Sadly, energy is required for them to work",
        width: 315,
        height: 135,
        strokeColor: 0xff0000,
        position: "top",
        positionOffset: 100,  
        animation: "fade"
      });
    
      this.tipTutorialBulldoze = new Phasetips(this.game, {
        targetObject: this.bulldozeBttn,
        context: "If you want to replace a building, you should bulldoze it first. You'll get some of the resources you spent building it back.",
        width: 420,
        height: 130,
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
      this.timeTxtGroup.visible = true;
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

      if(sprite.img == "Hospital"){
        sprite.off = true;
        this.houseGroup.forEach(function (house) { house.updateSingleHospital(sprite); }, this);
        sprite.bulldoze();
      } 
      else if(sprite.img == "House")
        sprite.bulldoze(this.homelessArray);
      else if (sprite.img == "Road"){
        this.buildingGroup.forEach(function (sprite, group)
        {
          var found = false;

          if (group != this.roadGroup && !found)
          {
            group.forEach(function (building){
              if (!found && this.checkAdjacency(building, sprite)){

                found = true;
                building.bulldoze();
                building.destroy();

              }
            }, this);
          }

          if(found){
            this.wood += Math.round(group.wood/2);
            this.stone += Math.round(group.stone/2);
          }
        }.bind(this, sprite));
      }
      else
        sprite.bulldoze(this.unemployedArray);

      sprite.destroy();
      
      this.woodTxt.text = this.wood;
      this.stoneTxt.text = this.stone;


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

},{"./Phasetips.js":1,"./buildings.js":2}]},{},[3]);
