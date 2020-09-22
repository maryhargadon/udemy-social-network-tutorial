const User = require("../../database_models/user_model");


exports.register = function(plugin,options,next){
    plugin.route([
        {
            method: "GET",
            path: "/user_profile",
            config: {
                auth: "simple-cookie-strategy",
                handler: function(request,reply){
                    
                }
            }
        }
    ])
    next();
}

exports.register.attributes = {
    pkg: require("./package.json")
}