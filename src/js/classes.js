///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function GameManager(){

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function BaseTile(x, y, img, terrainType) {
    phaser.Sprite.apply(this, game, x, y, img);
    this.terrain = terrainType; //integer value. 0 = water, 1 = soil, 2 = purified soil, 3 = mountain/obstacle
}

function ResourceTile(x, y, img, Resource) {
    phaser.Sprite.apply(this, game, x, y, img);
    this.resource = Resource; //string that defines the resource contained within the tile (if the terrain is water, the resource will be water.
                               //If it's an obstacle, it will be empty)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function House(x, y, img) {
    phaser.Sprite.apply(this, game, x, y, img);
    this.coziness = 0;
    this._calculateCoziness(); //editarlo para groups
    this.residentA = undefined;
    this.residentB = undefined;
    this.hospitalNear = false;
}

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

                //CHECK IF THERE ARE DECORATIONS NEARBY (BUILDING ARRAY IN GAMEMANAGER)
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


function Producer(x, y, img) { 
    phaser.Sprite.apply(this, game, x, y, img); //img needs to be filtered depending on resource. Done outside the function?
    this.amount = 10;
}

//NOTE: I'm assuming we're using an object with properties related to each type of resource, each of them containing an array of those kinds of producers
//that way, to update the resource amount it'd be a matter of going through each array with each resource amount variable
//example: var producers = {wood: [producerA, producerB], coal: []};
Producer.prototype.tick = function(resourceVar){
    resourceVar += this.amount;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Hospitals(x, y, img) {
    phaser.Sprite.apply(this, game, x, y, img);
    this.get = "fucked";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Cleaner(x, y, img) {} //i'd leave the code for this for when we have a bunch of the game made. It'd probably be mid/late-game stuff and we need an algorithm to process stuff around it

function Decor(x, y, img) {} //i'd leave the code for this for when we have a bunch of the game made, too

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Citizen() {
    this.name = "Get Fucked";
    this.age = 0;
    this.health = 100;
    this.sick = false;
}

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
    GameManager: GameManager,
    BaseTile: BaseTile,
    ResourceTile: ResourceTile,
    House: House,
    Producer: Producer,
    Cleaner: Cleaner,
    Decor: Decor,
    Hospital: Hospital,
    Citizen: Citizen
};