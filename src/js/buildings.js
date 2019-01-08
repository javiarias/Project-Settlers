var Phasetips = require("./Phasetips.js");

function House(game, x, y, img, hospitalNear = false) {
    Phaser.Sprite.call(this, game, x, y, img);
    this.residentA = undefined;
    this.residentB = undefined;
    this.hospitalNear = hospitalNear;
    this.full = false;
    this.numberOfBirths = 0;

    this.tooltip = new Phasetips(this.game, {
        targetObject: this,
        context: "Hospital in range! aaaaaaa: 100 old (Not Great) aaaaaaa: 100 old (Not Great)",
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
            this.hospitalNear = hospital.checkArea(hospital, this);
    }, this);

    this.updateTooltip();
};

House.prototype.updateSingleHospital = function(hospital, turnOn = true) {

    if(hospital.checkArea(hospital, this))
        this.hospitalNear = turnOn;

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
        if(nameB == "")
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

    obj.residentA = JSON.parse(residentA.serialize());
    obj.residentB = JSON.parse(residentB.serialize());

    return JSON.stringify(obj);

};

House.prototype.serialize = function() {

        var fields = [
            "x",
            "y",
            "img",
            'hospitalNear',
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

House.prototype.unserialize = function(state, game) {
    
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

Producer.prototype.unserialize = function(state, game) {
    
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
    this.area = 16; //en tiles
    this.full = false;
    this.consume = amount;

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

Hospital.prototype.unserialize = function(state, game) {
    
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
}
Road.prototype = Object.create(Phaser.Sprite.prototype);
Road.constructor = Road;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Citizen(homelessArray, unemployedArray, names, surnames, age = 0) {
    
    this.name = names[Math.round(Math.random() * names.length)] + " " + surnames[Math.round(Math.random() * surnames.length)];

    this.age = age;
    this.health = 65;
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
        this.health = this.health * 0.75;

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
            obj.houseX = this.house.x;
            obj.houseY = this.house.y;
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

Citizen.prototype.unserialize = function(state, homelessArray, unemployedArray, names, surnames, houseGroup, producerGroup) {
    
	if (typeof state === 'string') {
		state = JSON.parse(state);
    }
    
	var instance = new Citizen(homelessArray, unemployedArray, names, surnames);
    
	for (var i in state) {
		instance[i] = state[i];
    }
    
    if(state.houseX >= 0 && state.houseY >= 0)
        this.addToHouse(houseGroup, state.houseX, state.houseY);
    
    if(state.jobX >= 0 && state.jobY >= 0)
        this.addToProducer(producerGroup, state.jobX, state.jopY);

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