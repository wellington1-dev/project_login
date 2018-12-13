var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');

// var express = require('../..');
// var hash = require('pbkdf2-password')()
var path = require('path');

var app = module.exports = express();
// app.HTTP_VERB('URL', function (req, res){}); 
const {
    check,
    validationResult
} = require('express-validator/check');

// new code:
var session = require('express-session');
// original code:

app.use(express.urlencoded({
    extended: false
}))
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));
app.use(function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});


var app = express();

//Global Variables
var logger = function (req, res, next) {
    console.log("logging...");
    next();
}

app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
});

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + "/static"));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', function (req, res) {

    res.render('index');

});
// app.get("/users", function (request, response) {

//     var users_array = [{
//             name: "Michael",
//             email: "michael@codingdojo.com"
//         },
//         {
//             name: "Jay",
//             email: "jay@codingdojo.com"
//         },
//         {
//             name: "Brendan",
//             email: "brendan@codingdojo.com"
//         },
//         {
//             name: "Andrew",
//             email: "andrew@codingdojo.com"
//         }
//     ];
//     response.render('users', {
//         users: users_array
//     });
// })

// route to process new user form data:
app.post('/user', function (req, res) {
    req.session.first_name = req.body.first_name;
    req.session.last_name = req.body.last_name;
    req.session.email = req.body.email;
    console.log(req.session.first_name);
    console.log(req.session.last_name);
    console.log(req.session.email);
    // redirect the user back to the root route. 
    // All we do is specify the URL we want to go to:
    res.redirect('/');
})


app.get("/users/:id", function (req, res) {
    console.log("The user id requested is:", req.params.id);
    // just to illustrate that req.params is usable here:
    res.send("You requested the user with id: " + req.params.id);
    // code to get user from db goes here, etc...
});


app.listen(6789, function () {
    console.log("listening on port 6789");
})