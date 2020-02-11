require('dotenv').config({path: __dirname + '/.env'})
var mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function(err){
    console.log(err)
}); 
var Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        require:true,
        type:String
    }
})

var User = mongoose.model("User", userSchema);

var findUserByUsername = function(username, done){
    User.findOne({"username":username}, (err, user)=>{
        if (err) console.log(err)
        done(null, user)
    })
}

var findUserById = function(id, done){
    User.findOne({"_id": id}, (err, user) => {
        if (err) console.log(err)
        done(null, user)
    })
}

var createUser = function(username, done){
    var user = new User({"username":username})
    findUserByUsername(username, (err, data)=>{
        if (err) console.log(err)
        if (data){
            done(null, "taken")
        } else {
            user.save(function(err, data){
                if (err) console.log(err);
                done(null, data);
            })
        }
    })
}

var listAllUsers = function(done){
    User.find({}, function(err, users){
        if (err) console.log(err)
        
        var obj = {
          userList:[]
        }
        users.forEach(function(user){
            obj.userList.push(user);
        })
        done(null, obj)
    })
}

module.exports = {
    createUser,
    findUserById,
    findUserByUsername,
    listAllUsers
}