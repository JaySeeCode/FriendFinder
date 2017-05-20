var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var PORT = 4500;
var app = express();

//this array will act as our local database since we didn't use MySQL for this assignment
var peopleList = [
	{
	    name: "Joseph E. Messer",
	    photo: "http://blogs.ucl.ac.uk/ucl-researchers/files/2015/05/profile-pic.jpg",
	    scores: [5,3,4,3,2,1,1,5,3,4]
	},
	{
	    name: "Lauren E. Lee",
	    photo: "https://s-media-cache-ak0.pinimg.com/736x/cd/32/30/cd32305b2a778c2a3805a7baea545b9b.jpg",
	    scores: [1,5,2,5,5,3,4,2,2,3]
	},
	{
	    name: "Laura E. Barrett",
	    photo: 'http://steminist.com/wp-content/uploads/2015/03/1518673_10201566207622374_144606819_o.jpg',
	    scores: [3,2,5,4,3,1,2,5,4,1]
	},
	{
	    name: "Oliver M. Alvarez",
	    photo: "http://zirki.info/wp-content/uploads/2010/09/havjer.jpeg",
	    scores: [5,1,4,4,5,1,2,5,4,1]
	},
	{
	    name: "Donna F. Driscoll",
	    photo: "http://i1.wp.com/therighthairstyles.com/wp-content/uploads/2013/12/11-shoulderlength-curly-African-American-style.jpg?resize=750%2C799",
	    scores: [4,3,4,5,5,1,3,4,2,3]
	},
	{
	    name: "Glenn D. Walker",
	    photo: "http://www.mens-hairstyle.com/wp-content/uploads/2016/12/Asian-Men-Hairstyle.jpg",
	    scores: [3,2,2,1,5,3,2,4,2,4]
	}
];

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

	peopleList.push(data);

	//after we get a request from the user with the answers from the survey,
	//we extract the data from the body of the request object an send it to the
	//findMatch function. This initiates our 'match-finding' process and returns
	//a match once it is finished.
	var match = findMatch(data);

	//for development purposes
	// console.log('\nMATCH FOUND: ' + match[1]);

	//now that we have a match, we need to render a JSON we can send back as a response
	//with the match's information. In order to do this, we'll grab the respective match
	//from our database and send it back to the client
	var response = {};

	//looping through list of users to extract the match
	peopleList.forEach(function(ele) {
		if(match[1] === ele.name) {response = ele;}
	});

	//for development purposes
	// console.log(response);

	//sending response back to client
	res.json(response);

});

// ========================== SERVER ======================================

//Here we set up our server, which is listening on PORT 6000
app.listen(PORT, function(){
	console.log("Server listening on PORT " + PORT);
});

// ========================== FUNCTIONS ======================================

function findMatch(surveyData) {

	//this variable holds the lowest possible total difference... meaning, the most
	// compatible user along with his or her name for purposes of identification.
	//we need to know who we're sending back in the request as the most compatible 'friend'
	var totalDifference = [];

	//User 1 represents the current user being compared to all other users
	//User 2 is a 'dynamic variable' whose content will be updated once we're done
	//with each comparison

	var user1Scores = convertScoresIntoArray(surveyData);

	//if there are existing users in the 'database'...
	if (peopleList.length > 0) {

		//iterate through content of database/array
		for (var i = 0; i < peopleList.length; i++) {

			//grab just the array of scores
			var user2Scores = convertScoresIntoArray(peopleList[i]);

			//for development purposes
			// console.log('USER1 SCORES ARRAY: ' + user1Scores);
			// console.log('USER2 SCORES ARRAY: ' + user2Scores);


			//if i > 0... meaning it will only run after the first iteration
			// console.log(peopleList[i].name + ' | ' + surveyData.name);
			if(i > 0){
				//if the code in here runs, it is implied that we
				//are past the first iteration

				//if they are not the same person, compare and find total difference
				if(peopleList[i].name !== surveyData.name) {
					let temp = findTotalDifference(user1Scores, user2Scores);

					//if the current value is less than the previous value
					//of total difference... meaning, if this user is more 
					//compatible than the previous one, save the new score along
					//with his or her name. 
					if(temp < totalDifference[0]) {
						totalDifference = [temp, peopleList[i].name];
					}

					//for development purposes
					// console.log("TOTAL DIFFERENCE: " +  totalDifference);
				}
				

			}else{
				//the code in here will only run once; that is, during the
				//first iteration. after this point, totalDifference is not undefined
				//anymore.
				totalDifference = [findTotalDifference(user1Scores, user2Scores), peopleList[i].name];

				//for development purposes
				// console.log("TOTAL DIFFERENCE: " +  totalDifference);
			}
		};

		//return the name of the person
		return totalDifference;

	};

}

function convertScoresIntoArray (obj) {

	let scoresArr = [];

	for (var i = 0; i < obj.scores.length; i++) {
		scoresArr[i] = obj.scores[i];
	};

	return scoresArr;

}

function findTotalDifference(user1, user2) {
	
	//user1 and user2 are both arrays containing the scores of each user
	var totalDifference = 0;
	var difference = 0;

	
	for (var i = 0; i < user1.length; i++) {
		
		if(!(user1[i] === user2[i])) {

			if (user1[i] > user2[i]) {
				difference = user1[i] - user2[i];
				// console.log('incrementing...');
				totalDifference += difference;
			} else{
				difference = user2[i] - user1[i];
				// console.log('incrementing...');
				totalDifference += difference;
			};
		}
	};

	return totalDifference;

}
