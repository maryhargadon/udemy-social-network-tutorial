const User = require("../../database_models/user_model");


exports.register = function(plugin, options, next){
    plugin.route([
        {
            method: "GET",
            path: "/friends",
            config: {
                auth: "simple-cookie-strategy",
                handler: function(request, reply){
                    User.find({"email": {$ne: request.auth.credentials.user}}, function(err,users){
                        reply.view("friends", {user_friends: users});
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