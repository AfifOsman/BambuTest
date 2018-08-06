'use strict';

const MongoClient  = require('mongodb').MongoClient;
const url          = "mongodb://localhost:27017/";

exports.list_all_profile = function(req, res) {

  var retVal = {};

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ProfileDB");
    dbo.collection("profile").find({}).toArray(function(err, result) {
      if (err) throw err;

      var arrObj = [];
      for (var i=0; i < result.length; i++){
          arrObj[i] = {
                     name    : result[i].name,
                     profile : profileDefinition(calculateScore(result[i].answer))
                  }
         }
         retVal.data = arrObj;
      res.json(retVal);
      db.close();
    });
  });

};

exports.get_a_profile = function(req, res) {

  var name = req.params.name;
  var retVal = {};

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ProfileDB");
    dbo.collection("profile").find({name: name}).toArray(function(err, result) {
      if (err) throw err;

      var arrObj = [];
      for (var i=0; i < result.length; i++){
          arrObj[i] = {
                     name    : result[i].name,
                     profile : profileDefinition(calculateScore(result[i].answer))
                  }
         }
         retVal.data = arrObj;
      res.json(retVal);
      db.close();
    });
  });

};

exports.reg_profile = function(req, res) {

  var userData = JSON.parse(req.params.data);
  var newAns = userData.answer;
  var newAnsJson = newAns.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
  newAnsJson = newAnsJson.replace(/'/g, '"');
  userData.answer = JSON.parse(newAnsJson);

  var retVal = {};

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ProfileDB");
    dbo.collection("profile").insertOne({"name":userData.name,"answer":userData.answer}, function(err, result) {
      if (err) throw err;
      console.log("1 profile inserted");

      retVal.data = {
         name    : userData.name,
         profile : profileDefinition(calculateScore(userData.answer))
      }

      res.json(retVal);
      db.close();
    });
  });

};

var calculateScore = function(answer){

  var score = 0;
  for(var i=0;i<answer.length;i++){
    if(answer[i].q_id == 1){ 
      //if saving
      switch(answer[i].ans){
        case 0 : score += 0;
        break;
        case 2000 : score += 1;
        break;
        case 4000 : score += 2;
        break;
        case 6000 : score += 3;
        break;
        case 8000 : score += 4;
        break;
        case 10000 : score += 5;
        break;
      }
    }else if(answer[i].q_id == 2){
      //if loan
      switch(answer[i].ans){
        case 0 : score += 5;
        break;
        case 2000 : score += 4;
        break;
        case 4000 : score += 3;
        break;
        case 6000 : score += 2;
        break;
        case 8000 : score += 1;
        break;
        case 10000 : score += 0;
        break;
      }
    }
  }
  return score;
}

var profileDefinition = function(score){
  var profile;
  if(score >= 8 )      profile = "Profile A";
  else if(score >= 6 ) profile = "Profile B";
  else if(score >= 4 ) profile = "Profile C";
  else if(score >= 2 ) profile = "Profile D";
  return profile;
}