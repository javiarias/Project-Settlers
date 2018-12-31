function House(game, x, y, img) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.coziness = this._calculateCoziness();
    this.residentA = undefined;
    this.residentB = undefined;
    this.hospitalNear = false;
    this.full = false;
    this.numberOfBirths = 0;
}
House.prototype = Object.create(Phaser.Sprite.prototype);
House.constructor = House;

House.prototype._calculateCoziness = function() {
    var coziness = 0;

    //cálculo de coziness

    return coziness;
};

House.prototype.add = function(citizen) {

    var added = false;

    if(this.residentA === undefined){
        this.residentA = citizen;
        added = true;
    }

    else if(this.residentB === undefined){
        this.residentB = citizen;
        added = true;
    }

    this.full = (this.residentA !== undefined && this.residentB !== undefined);

    return added;
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
};

House.prototype.bulldoze = function(homelessArray) {
    
    if(this.residentA !== undefined){
        this.residentA.homeless = true;
        homelessArray.unshift(this.residentA);
    }
    if(this.residentB !== undefined){
        this.residentB.homeless = true;
        homelessArray.unshift(this.residentB);
    }
};

House.prototype.tick = function(foodAmount, homelessArray){
    this.numberOfBirths = 0;

    if(this.residentA !== undefined){
        this.residentA.tick(foodAmount, this.hospitalNear, this, homelessArray);
        if(this.residentA.givingBirth){
            this.residentA.givingBirth = false;
            this.residentA.birthCooldown = 10;
            this.numberOfBirths++;
        }
    }

    if(this.residentB !== undefined){
        this.residentB.tick(foodAmount, this.hospitalNear, this, homelessArray);
        if(this.residentB.givingBirth){
            this.residentB.givingBirth = false;
            this.residentB.birthCooldown = 10;
            this.numberOfBirths++;
        }
    }
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
    this.consumes = consumes;
    this.consumed = consumed;
    this.workerA = undefined;
    this.workerB = undefined;
    this.full = false;

    this.totalAmount = amount;
    this.amount = 0;
}
Producer.prototype = Object.create(Phaser.Sprite.prototype);
Producer.constructor = Producer;

Producer.prototype.add = function(citizen) {

    var added = false;

    if(this.workerA === undefined){
        this.workerA = citizen;
        added = true;
    }

    else if(this.workerB === undefined){
        this.workerB = citizen;
        added = true;
    }

    this.full = (this.workerA !== undefined && this.workerB !== undefined);

    return added;
};

Producer.prototype.updateAmount = function() {
    if (this.workerA === undefined && this.workerB === undefined)
        this.amount = 0;

    else if (!this.full)
        this.amount = 0.5 * this.totalAmount;

    else
        this.amount = this.totalAmount;
}

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


function Citizen(homelessArray, unemployedArray) {
    this.name = (Math.random() * 100) + 1;
    this.age = 0; //De momento no es necesario
    this.health = 100; //Valor modificable
    this.sick = false;
    this.homeless = true;
    this.unemployed = true;
    this.birthCooldown = 0;
    this.givingBirth = false;
    homelessArray.unshift(this);
    unemployedArray.unshift(this);
}
Citizen.constructor = Citizen;

Citizen.prototype.addToHouse = function (houseGroup){
    var found = false;

    houseGroup.forEach(function (house) {
        if(!house.full && !found){
            if(house.add(this)){
                found = true;
                this.homeless = false;
            }
        }
    }, this);

    return found;
};

Citizen.prototype.addToProducer = function (producerGroup){
    var found = false;

    producerGroup.forEach(function (group) {
        group.forEach(function (producer) {
            if(!producer.full && !found){
                if(producer.add(this)){
                    found = true;
                    this.unemployed = false;
                }
            }
        }, this);
    }, this);

    return found;
};

Citizen.prototype.tick = function(foodAmount, healing, house, homelessArray, houseGroup = null){
    this.age++;

    if(this.birthCooldown > 0)
        this.birthCooldown--;

    if(this.sick)
        this.health -= 5;
    if(foodAmount <= 0)
        this.health -= 5;
    if(this.age > 100)
        this.health = this.health * .9;
    if(healing)
        this.health += 10;

    if (this.health <= 0){
        if(!this.homeless)
            house.kill(this);
    }

    var aux = Math.floor((Math.random() * 100) + 1);
    if (!this.homeless && house.full && this.birthCooldown <= 0 && aux < 5) //Probabilidad que se puede cambiar
        this.givingBirth = true;

    
    else if(this.homeless){
        this.health -= 0;
    }
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