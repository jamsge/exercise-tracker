require('dotenv').config({path: __dirname + '/.env'})
var mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function(err){
    console.log(err)
}); 
var Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    userId:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    },
    duration:{
        required:true,
        type:Number
    },
    date:{
        required:false,
        type:Date
    }
})

var Exercise = mongoose.model("Exercise", exerciseSchema);

var addExercise = function(userId, description, duration, date, done){
    if (!date){
        date = new Date().toISOString();
    }
    var exercise = new Exercise({
        "userId":userId,
        "description":description, 
        "duration":duration, 
        "date":date
    });
    exercise.save(function(err, data){
        if (err) console.log(err)
        done(null, data)
    })
}

var findUserById = require("./user.js").findUserById;
var getExerciseLog = function(userId, done){
    findUserById(userId, function(err, data){
        if (err) console.log(err);
        if (!data){
          return done(null, "no user found")
        }
        Exercise.find({"userId":userId}, (err, data) => {
            if (err) console.log(err)
            var exerciseList = [];
            data.forEach(exercise => {
                exerciseList.push(exercise);
            });
            done(null, data);
        })
    })
}

var getExerciseLogFromTo = function(userId, from, to, done){
    findUserById(userId, function(err, data){
        if (err) console.log(err);
        if (!data){
            return done(null, "no user found");
        }
        Exercise.find({
          date:{
            $gte:from,
            $lte:to
          }
        }, (err, data) => {
            if (err) console.log(err);
            var exerciseList = [];
            data.forEach(exercise => {
                exerciseList.push(exercise);
            })
            done(null, data);
        })
    })
}

module.exports = {
    addExercise,
    getExerciseLog,
    getExerciseLogFromTo
}