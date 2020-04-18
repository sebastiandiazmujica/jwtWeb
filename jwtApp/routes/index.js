var express = require('express');
var router = express.Router();
const MongoLib = require("../MongoLib");

var HandlerGenerator = require("../handlegenerator.js");
var middleware = require("../middleware.js");


HandlerGenerator = new HandlerGenerator();

/* GET home page. */
router.get('/', middleware.checkToken, HandlerGenerator.index);
router.post('/createUser', middleware.checkToken,HandlerGenerator.createUser);
router.post( '/login', HandlerGenerator.login);



module.exports = router;