var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var app = express();
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

//set static path
//session middleware
app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({extended: true}));



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.post('/login', function (req, res) {
  req.session.userName = req.body.userName;
  req.session.password = req.body.password;
  res.redirect('/');
});

app.get('/', function (req, res) {
  if (req.session.userName) {
    res.redirect("/user");
  } else {
    res.render('index.ejs');
    }
});

app.get("/user", function (req, res) {
  
  if (req.session.userName) {
    res.render("user", {userName: req.session.userName});

  } else {
    res.render('index');
  }
  
});

app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      res.negociate(err);
    }
    res.redirect('/');

  });
});


app.listen(3000);
console.log('Express started on port 3000');
