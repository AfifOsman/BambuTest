var express = require('express'),
  app = express(),
  port = process.env.PORT || 8888,
  bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routes/profileRoute'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Server Started on: ' + port);