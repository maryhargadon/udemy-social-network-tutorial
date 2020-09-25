const User = require("../../database_models/user_model");


module.exports.register = function(plugin,options,next){
    plugin.route([
        {
            method: "GET",
            path: "/user_profile",
            config: {
                auth: "simple-cookie-strategy",
                handler: function(request,reply){
                    User.findOne({"email": request.auth.credentials.user}, function(err,user){
                        reply.view("user_profile",{user: user});
                    });
                }
            }
        },
        {
            method: "POST",
            path: "/user_profile/edit",
            config: {
                auth: "simple-cookie-strategy",
                handler: function(request,reply){
                    User.findOne({"email": request.auth.credentials.user}, function(err,user){
                        user.name = request.payload.name;
                        user.user_profile[0].location = request.payload.location;
                        user.user_profile[0].description = request.payload.description;
                        user.user_profile[0].interests = request.payload.interests;
                        user.save(function(err){
                            if(err){
                                reply().code(400);
                            }else{
                                reply();
                            }
                        })
                    });
                }
            }
        }
    ])
    next();
}

exports.register.attributes = {
    pkg: require("./package.json")
}