var express = require('express');
var path = require('path');
var app = express();

var defaultPage = function(req,res){
   res.send('Hello World');
};

app.use('/stockMarket/',express.static(path.join(__dirname, 'www')));
app.get("/",defaultPage);


app.listen(8888,function(){
   console.log("Server listening to port 8888");
});