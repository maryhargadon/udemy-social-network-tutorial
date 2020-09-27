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
        },
        {
            method: "GET",
            path: "/friend_request",
            config: {
                auth: "simple-cookie-strategy",
                handler: function(request, reply){
                    User.find({"email": request.auth.credentials.user}, function(err, sending_user){
                        User.find({"member_id": request.payload.friend_member_id}, function(err, potential_friend){
                            potential_friend[0].update({$push: {"friend_requests": {"member_id": sending_user[0].member_id, "friend_name": sending_user[0].name, "profile_pic": sending_user[0].user_profile[0].profile_pic}}}, function(err){
                                reply();
                            });   
                        });
                    });
                }
            }
        }
    ]);

    next();
}

exports.register.attributes = {
    pkg: require("./package.json")
};