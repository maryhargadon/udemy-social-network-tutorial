const User = require("../../database_models/user_model");
const UserStatus = require("../../database_models/user_status_model");

module.exports.register = function(plugin,options,next){
    plugin.route([
        {
        method: "GET",
        path: "/home",
        config: {
            auth: "simple-cookie-strategy",
            handler: function(request,reply){
                var name = request.auth.credentials.name;
                var user_statuses;
                UserStatus.find({}, function (err,statuses){
                    user_statuses = statuses;
                    console.log("user_statuses",user_statuses);
                    reply.view("home",{name: name, user_statuses: user_statuses});
            })
            }
        }
    },
    {
        method: "POST",
        path: "/user_status/create",
        config: {
            auth: "simple-cookie-strategy",
            handler: function(request,reply){
                User.findOne({"email": request.auth.credentials.user},function(err,user){
                    console.log("user is", user);
                    var user_status = new UserStatus({"user_email": request.auth.credentials.user,
                                                      "user_status": request.payload.user_status,
                                                      "name": request.auth.credentials.name,
                                                      //"profile_pic": user.user_profile[0].profile_pic
                                                    });
                console.log("new user status", user_status);
                user_status.save(function(err,result){
                    if(err){
                        reply().code(400);
                    }else{
                        reply();
                    }
                });
                });
            }
        }
    }
])
    next();
}

module.exports.register.attributes = {
    pkg: require("./package.json")
};