var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var PORT = 4500;
var app = express();

var peopleList = [];

// ================================================================

//Code for data parsing when receiving POST requests from the browser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// ========================== GET ROUTES ======================================

//returns home.html when client hits home page
app.get('/', function(req, res) {

	res.sendFile(path.join(__dirname, "./app/public/home.html"));
	// res.send('hello');

});

//returns survey.html when client hits specified path
app.get('/survey', function(req, res) {

	res.sendFile(path.join(__dirname, "./app/public/survey.html"));

});

//returns an array of objects in the JSON format when client hits
//specified path
app.get('/api/friends', function(req, res) {

	res.json(peopleList);

});

// ========================== POST ROUTES ======================================

//after the necessary logic and calculations are executed within 
//said function, this route returns the best match whenever the client
//makes a POST request to the specified path
app.post('/api/friends', function(req, res) {

	var data = req.body;

	console.log(data);
	peopleList.push(data);

	//missing the response with the best match here.
	//will probably will write a function that handles all
	//of the logic, returns an object, and sends it back to client in the response

});

// ========================== SERVER ======================================

//Here we set up our server, which is listening on PORT 6000
app.listen(PORT, function(){
	console.log("Server listening on PORT " + PORT);
});