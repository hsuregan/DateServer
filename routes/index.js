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


router.put('/:collection/:name', function(req, res){
	var  db = req.db;
	var object = req.body;
	console.log(body);

});


module.exports = router;
