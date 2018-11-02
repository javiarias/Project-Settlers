///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function GameManager(){

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Tile(terrainType, Resource, Contains) {  //mainly for sprite related purposes
    this.terrain = terrainType; //integer value. 0 = water, 1 = soil, 2 = purified soil, 3 = mountain/obstacle
    this.resource = Resource; //string that defines the resource contained within the tile (if the terrain is water, the resource will be water.
                               //If it's an obstacle, it will be empty)
    this.contains = Contains; //string that defines the building on top of that tile
}

Tile.prototype.edit = function(edit) {
    this.terrain = edit;
};
 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//revisar si necesitamos esto
function BiArray(sizeX){
    this.x = [];
    for(var i = 0; i < sizeX; i++)
        this.x[i] = [];
}

BiArray.prototype.get = function(coordX, coordY){
    return this.x[coordX][coordY];
};

BiArray.prototype.set = function(obj, coordX, coordY){
    this.x[coordX][coordY] = obj;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Map(size) {
    this.mapSize = size;
    this.mapArray = new BiArray(size);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Building(x, y) {
    this.x = x;
    this.y = y;
/* Splice method to remove two elements starting from position three (zero based index):


var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
array.splice(2,2);
array = [1, 2, 5, 6, 7, 8, 9, 0];*/
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function House(x, y, map) {
    Building.apply(this, x, y);
    this.coziness = _calculateCoziness(x, y, map);
}

House.prototype._calculateCoziness = function(x, y, map) {
    var coziness = 0;

    for(i = -1; i <= 1; i++)
        for(j = -1; j <= 1; j++)
            if (x + i >= 0 && x + i < map.mapSize && y + j >= 0 && y + j < map.mapSize){
                var aux = map.mapArray.get(x + i, y + j);
                if(aux.terrain == 0 || aux.terrain == 3)
                    coziness += 1;
                else if(aux.terrain == 2)
                    coziness += 2;
                //CHECK IF THERE ARE DECORATIONS NEARBY (BUILDING ARRAY IN GAMEMANAGER)
            }

    return coziness;
};

function Producer(x, y, amount, map) {
    Building.apply(this, x, y);
    this.resource = map.mapArray.get(x, y).resource;
    this.amount = amount;
}

//NOTE: I'm assuming we're using an object with properties related to each type of resource, each of them containing an array of those kinds of producers
//that way, to update the resource amount it'd be a matter of going through each array with each resource amount variable
//example: var producers = {wood: [producera, producerb], coal: []};
Producer.prototype.tick = function(resourceVar){
    resourceVar += this.amount;
};

function Cleaner() {} //i'd leave the code for this for when we have a bunch of the game made. It'd probably be mid/late-game stuff and we need an algorithm to process stuff around it

function Decor() {} //i'd leave the code for this for when we have a bunch of the game made, too

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Citizen() {}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    GameManager: GameManager,
    Tile: Tile,
    BiArray: BiArray,
    Map: Map,
    Building: Building,
    House: House,
    Producer: Producer,
    Cleaner: Cleaner,
    Decor: Decor,
    Citizen: Citizen
};