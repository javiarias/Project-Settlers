///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function GameManager(mapSize){
    this.map = new Map(mapSize);
}

GameManager.prototype.birth = function(building, buildingArray, freeArray) {
    if(this.contains.building === undefined){
        if(freeArray[0] != undefined){
            this.contains.building = building;
            this.contains.arrayIndex = freeArray[0];
            buildingArray[freeArray[0]] = building;
            freeArray.splice(0, 1);
        }
        else{
            this.contains.building = building;
            this.contains.arrayIndex = buildingArray.length;
            buildingArray.push(building);
        }
    }

    return (contains.building !== undefined);
};

GameManager.prototype.death = function(buildingArray, freeArray) {
    if(this.contains.building !== undefined){
        this.contains.building = undefined;
        buildingArray[this.contains.arrayIndex] = undefined;
        freeArray.push(arrayIndex);
        this.contains.arrayIndex = -1;
    }

    return (contains.building === undefined);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Tile(terrainType, Resource) {  //mainly for sprite related purposes
    phaser.Sprite.apply(this, game, x, y, img);
    this.terrain = terrainType; //integer value. 0 = water, 1 = soil, 2 = purified soil, 3 = mountain/obstacle
    this.resource = Resource; //string that defines the resource contained within the tile (if the terrain is water, the resource will be water.
                               //If it's an obstacle, it will be empty)
    this.contains = {arrayIndex: -1, building: undefined}; //string that defines the building on top of that tile
}

Tile.prototype.build = function(building, buildingArray, freeArray) {
    if(this.contains.building === undefined){
        if(freeArray[0] != undefined){
            this.contains.building = building;
            this.contains.arrayIndex = freeArray[0];
            buildingArray[freeArray[0]] = building;
            freeArray.splice(0, 1);
        }
        else{
            this.contains.building = building;
            this.contains.arrayIndex = buildingArray.length;
            buildingArray.push(building);
        }
    }

    return (contains.building !== undefined);
};

Tile.prototype.bulldoze = function(buildingArray, freeArray) {
    if(this.contains.building !== undefined){
        this.contains.building = undefined;
        buildingArray[this.contains.arrayIndex] = undefined;
        freeArray.push(arrayIndex);
        this.contains.arrayIndex = -1;
    }

    return (contains.building === undefined);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function House(x, y) {
    phaser.Sprite.apply(this, game, x, y, img);
    this.coziness = -1;
    this._calculateCoziness();//editarlo para groups
    this.contains = {residentA: {}, };
    //THIS.HOSPITALQUETIENECERCA
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

function Producer(x, y) {
    phaser.Sprite.apply(this, game, x, y, img);
    this.resource; // = BUSCAR LA resource;
    this.amount = 10;
}

//NOTE: I'm assuming we're using an object with properties related to each type of resource, each of them containing an array of those kinds of producers
//that way, to update the resource amount it'd be a matter of going through each array with each resource amount variable
//example: var producers = {wood: [producerA, producerB], coal: []};
Producer.prototype.tick = function(resourceVar){
    resourceVar += this.amount;
};

function Hospitals(x, y) {
    phaser.Sprite.apply(this, game, x, y, img);
    this.get = "fucked";
}

function Cleaner() {} //i'd leave the code for this for when we have a bunch of the game made. It'd probably be mid/late-game stuff and we need an algorithm to process stuff around it

function Decor() {} //i'd leave the code for this for when we have a bunch of the game made, too

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Citizen() {
    this.name = "Get Fucked";
    this.age = 0;
    this.health = 100;
    this.sick = false;
}

Citizen.prototype.tick = function(foodAmount, healing){
    age++;
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
    Tile: Tile,
    House: House,
    Producer: Producer,
    Cleaner: Cleaner,
    Decor: Decor,
    Hospital: Hospital,
    Citizen: Citizen
};