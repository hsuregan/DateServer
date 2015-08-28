var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloworld', function(req, res){
	res.send(400,{title: 'Hello, World!'});
});

router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.send(400, docs);
        // res.render('userlist', {
        //     "userlist" : docs
        // });
    });
});

//get a list of all the collections
router.get('/collections',function(req,res){
  var db = req.db;
  db.driver.collectionNames(function(e,names){
    res.json(names);
  })
});

router.get('/collections/:name',function(req,res){
  var db = req.db;
  var collection = db.get(req.params.name);
  collection.find({},{limit:20},function(e,docs){
    res.json(docs);
  })
});

//get the object by id
router.get('/collections/:name/:id', function(req, res) {
	var db = req.db;
	var collection = db.get(req.params.name);
	var id = req.params.id;
	console.log(id);
	collection.findById(id, function(err, doc){
		res.send(400, doc);
	});
});



//modify user's id and stuff
router.put('/collections/:name/:id', function(req, res) {
	var db = req.db;
	var collection = db.get(req.params.name);
	var object = req.body;
	console.log(object);

	var id = req.params.id;

	collection.findAndModify({ _id: id }, { $set: object });
	res.status(201).send(object);
	// collection.findById(id, function(err, doc){
	// 	res.send(400, doc);

	// });
});

router.get('/calculate_distance/:name/:id1/:id2', function(req, res) {
	var db = req.db;
	var collection = db.get(req.params.name);
	var id_1 = req.params.id1;
	var id_2 = req.params.id2;
	var user1;
	var user2;
	console.log(id_2);

	//get user1
	collection.findById(id_1, function(err, doc){
		user1 = doc; 

		//get  user2
		collection.findById(id_2, function(err, obj){
			user2 = obj; 
			console.log(user1);
			console.log(user2);

			var dist = Math.pow(user1["long"] - user2["long"],2) - Math.pow(user1["lat"] - user2["lat"],2); //+ (user1.lat - user2.lat)^2;
			dist = Math.sqrt(Math.abs(dist));
			
			console.log(dist);
			var val = { "dist":dist};

			var ugh = [user1, user2];
			res.send(400, val);
		});		
	});


});

/*

localhost:3000/calculate_distance/:user1/:user2

router.get('/calculate_distance/:user1/:user2', function(req, res) {
	//query the database for user1 
	//query the database for user2

	users.find({'name': 'Lisa'}, function (err, docs){});
	-> Lisa
	var Lisa_long = Lisa[long]


	//var x = perform function on user1[long, lat] and user2[long, lat] == distance


	//x -> JSON
	//return JSON
}

*/



//example in the terminal:
//curl -H "Content-Type: application/json" -X POST -d '{"title":"Hello World", "director":"xoreganox"}' http://localhost:3000/collections/moviecollection
router.post('/collections/:name', function(req, res) {
	var db = req.db;
	var object = req.body;
	var collection = db.get(req.params.name);
	console.log(collection);
		console.log(object);

	//var collection = db.get(req.params.name);
	//var username = req.params.username;
	//console.log(username);
	collection.insert(object);
	res.status(201).send(object);
});




module.exports = router;
