var express = require("express");
var app = express();
var bodyParser = require("body-parser")
var router = express.Router();
try{
  var mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

const timeout = 10000;

var createUser = require("./user.js").createUser;
var findUserByUsername = require("./user.js").findUserById;
var findUserById = require("./user.js").findUserById;
var listAllUsers = require("./user.js").listAllUsers;

var addExercise = require("./exercise.js").addExercise;
var getExerciseLog = require("./exercise.js").getExerciseLog;
var getExerciseLogFromTo = require("./exercise.js").getExerciseLogFromTo;

app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

router.post("/exercise/new-user", (req, res, next)=>{
    var t = setTimeout(() => {next({message:'timeout'})}, timeout);
    // console.log(req.body)
    createUser(req.body.username, function(err, data) {
        clearTimeout(t);
        if (err) return (next(err))
        if(!data) {
            console.log('Missing `done()` argument');
            return next({message: 'Missing callback argument'});
        }
        if (data === "taken"){
            return res.send("username already taken")
        }
        findUserById(data._id, function(err, user){
            if (err) return(next(err))
            res.json(user)
        })
    })
})

router.post("/exercise/add", (req, res, next) => {
    var t = setTimeout(() => {next({message:'timeout'})}, timeout);
    addExercise(req.body._id, req.body.description, req.body.duration, req.body.date, (err, data)=>{
        if (err) console.log(err);
        res.json(data);
    })
})

router.get("/exercise/users", (req, res, next) => {
    var t = setTimeout(() => {next({message:'timeout'})}, timeout);
    // console.log(req.body)
    listAllUsers(function(err, data){
        clearTimeout(t);
        if (err) return(next(err));
        if (!data){
            console.log('Missing `done()` argument');
            return next({message: 'Missing callback argument'});
        }
        res.json(data);
    })
})

router.get("/exercise/log", (req, res, next) => {
    var t = setTimeout(() => {next({message:'timeout'})}, timeout);
    if (!req.query.from && !req.query.to){
        getExerciseLog(req.query.userId, (err, data)=>{
            if (err) console.log(err);
                return res.json(data);
        })
    } else {
        getExerciseLogFromTo(req.query.userId, req.query.from, req.query.to, (err, data) => {
            if (err) console.log(err);
            return res.json(data);
        })
    }
})

router.get("/", (req,res,next) => {
    res.json({online:true});
})

app.use("/api", router);

app.listen(3000, ()=>{
    console.log("Listening on Port 3000");
}) 