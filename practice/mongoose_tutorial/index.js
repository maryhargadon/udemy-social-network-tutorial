//didnt install node modules or mongoose
//in this folder, this file is for reference.

const mongoose = require("mongoose");
var carSchema = mongoose.Schema({
    type: String,
    year: Number
})

var Car = mongoose.model("Car", carSchema);

mongoose.connect("mongodb://localhost/example");

var new_car = new Car({"type": "Tesla", "year": 2015});

new_car.save(function(err,result){

})