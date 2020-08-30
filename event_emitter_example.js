const events = require("events");
const eventEmitter = events.EventEmitter;
const util = require("util");

var ee = new eventEmitter();

ee.on("speak", function(){
    console.log("saying hello");
});

ee.on("eat", function(){
    console.log("eating");
});

ee.emit("speak");
ee.emit("eat");

util.inherits(Car,eventEmitter);
function Car(){
    eventEmitter.call(this);
    this.hitGasPedal = function(){
        this.emit("acclerate");
    };

    this.hitBreakPedal = function(){
        this.emit("brake");
    };
}

var car = new Car();

car.on("acclerate", function(){
    console.log("acclerating to 100 mph");
});

car.on("brake", function(){
    console.log("stopping");
});

car.hitGasPedal();
car.hitBreakPedal();