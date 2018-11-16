function House(game, x, y, img) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.coziness = 0;
    this._calculateCoziness(); //editarlo para groups
    this.residentA = undefined;
    this.residentB = undefined;
    this.hospitalNear = false;
}
House.prototype = Object.create(Phaser.Sprite.prototype);
House.constructor = House;

House.prototype._calculateCoziness = function() {
    var coziness = 0;

    for(i = -1; i <= 1; i++)
        for(j = -1; j <= 1; j++)
            if (this.x + i >= 0 && this.x + i < map.mapSize && this.y + j >= 0 && this.y + j < map.mapSize){
                var aux = map.mapArray.get(x + i, y + j);
                if(aux.terrain == 0 || aux.terrain == 3)
                    coziness += 1;
                else if(aux.terrain == 2)
                    coziness += 2;

                //CHECK IF THERE ARE DECORATIONS NEARBY
            }

    this.coziness = coziness;
};

House.prototype.add = function(citizen) {
    var ret = true;
    if(this.residentA === undefined){
        this.residentA = citizen;
    }
    else if(this.residentB === undefined){
        this.residentB = citizen;
    }
    else
        ret = false;

    return ret;
};

House.prototype.bulldoze = function(homelessArray) {
    
    if(this.residentA !== undefined){
        homelessArray.push(this.residentA);
    }
    if(this.residentB !== undefined){
        homelessArray.push(this.residentB);
    }
};

House.prototype.tick = function(foodAmount){
    this.residentA.tick(false, foodAmount, this.hospitalNear);
    this.residentB.tick(false, foodAmount, this.hospitalNear);
};

House.prototype.countCitizens = function(){
    var ret = 0;
    if(this.residentA !== undefined){
        ret++;
    }
    if(this.residentB !== undefined){
        ret++;
    }

    return ret;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Producer(game, x, y, img, amount, consumes = "none", consumed = 0) { 
    Phaser.Sprite.call(this, game, x, y, img); //img needs to be filtered depending on resource. Done outside the function?
    this.amount = amount;
    this.consumes = consumes;
    this.consumed = consumed;
}
Producer.prototype = Object.create(Phaser.Sprite.prototype);
Producer.constructor = Producer;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Hospital(game, x, y, img) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.get = "fucked";
}
Hospital.prototype = Object.create(Phaser.Sprite.prototype);
Hospital.constructor = Hospital;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Road(game, x, y, img) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.get = "fucked";
}
Road.prototype = Object.create(Phaser.Sprite.prototype);
Road.constructor = Road;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Cleaner(game, x, y, img) {} //i'd leave the code for this for when we have a bunch of the game made. It'd probably be mid/late-game stuff and we need an algorithm to process stuff around it
Cleaner.prototype = Object.create(Phaser.Sprite.prototype);
Cleaner.constructor = Cleaner;

function Decor(game, x, y, img) {} //i'd leave the code for this for when we have a bunch of the game made, too
Decor.prototype = Object.create(Phaser.Sprite.prototype);
Decor.constructor = Decor;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Citizen() {
    this.name = "Get Fucked";
    this.age = 0;
    this.health = 100;
    this.sick = false;
}
Citizen.constructor = Citizen;

Citizen.prototype.tick = function(homeless, foodAmount, healing){
    age++;
    if(homeless)
        //do something?
        this.health -= 0;
    if(sick)
        this.health -= 5;
    if(foodAmount <= 0)
        this.health -= 5;
    if(age > 100)
        this.health = this.health / 2;
    if(healing)
        this.health += 10;

    return (this.health <= 0);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = {
    Road: Road,
    House: House,
    Producer: Producer,
    Cleaner: Cleaner,
    Decor: Decor,
    Hospital: Hospital,
    Citizen: Citizen
};