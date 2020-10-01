const User = require("../../database_models/user_model");
const shortid = require("shortid");
const fs = require("fs");
const UserStatus = require("../../database_models/user_status_model");

exports.register = function(plugin, options, next){
    plugin.route([
        {
            method: "GET",
            path: "/user_profile",
            config: {
                auth: "simple-cookie-strategy",
                handler: function(request, reply){
                    User.findOne({"email": {$ne: request.auth.credentials.user}}, function(err,user){
                        reply.view("user_profile", {user_profile: user});
                    });
                    // User.findOne({"email": request.auth.credentials.user}, function(err,user){
                    //     reply.view("user_profile",{user: user});
                    //});
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
                        });
                    });
                }
            }
        },
        {
            method: "POST",
            path: "/profile_pic/upload",
            config: {
                auth: "simple-cookie-strategy",
                handler: function(request,reply){
                    var user_profile_image = "user_" + request.auth.credentials.member_id + "_" + shortid.generate() + "." + request.payload.image_type;
                    fs.writeFile("user_profile_images/" + user_profile_image, Buffer(request.payload.image_data, "base64"), function(err){
                        if (err){
                            reply().code(400);
                        }else{
                            User.findOne({"email": request.auth.credentials.user}, function(err, user){
                                user.user_profile[0].profile_pic = user_profile_image;
                                user.save(function(err){
                                    if(err){
                                        reply().code(400);
                                    }else{
                                        UserStatus.update({"user_email": request.auth.credentials.user}, {"profile_pic": user_profile_image}, {multi: true}, function(){
                                            if(err){
                                            reply().code(400);
                                    }else{
                                        reply();
                                    }
                                        });
                                    }
                                })
                            });
                        }
                    });
                }
            }
        },
        {
            method: "GET",
            path: "/user_profile/{member_id}",
            config: {
                auth: "simple-cookie-strategy",
                handler: function(request,reply){
                    User.find({"email": request.auth.credentials.user}, function(err,user){
                        var all_user_friends = user[0].friends;
                        var request_profile_member_id = request.params.member_id;
                        all_user_friends.forEach(function(friend){
                            if(friend.member_id === request_profile_member_id){
                                User.findOne({"member_id": friend.member_id}, function(err,visting_friend){
                                    reply.view("user_profile_visit", {user: visiting_friend});
                                });
                            }
                        });
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