var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var expressValidator = require('express-validator');
const flash = require('express-flash');


var app = express();
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}));

//set static path
//session middleware
app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());
app.use(require('connect-flash')());
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';

    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
app.use(flash());
app.use(express.json());
app.post('/user', (req, res) => {
  User.create({
    first_name: req.session.first_name,
    last_name: req.session.last_name,
    userName: req.session.userName,
    password: req.session.password
  }).then(user => res.json(user));
});

const {
  check,
  validationResult
} = require('express-validator/check');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  if (req.session.userName, req.session.password) {
    res.redirect("/user");
  } else if (req.session.first_name, req.session.last_name, req.session.userName, req.session.password) {
    res.redirect("/user");
  } else {
    res.render('index.ejs', {
      errors: []
    });
  }

});
app.get('/loginPage', function (req, res) {
  res.render('loginPage')
})


app.post('/registration',
  [
    check('first_name').isLength({
      min: 4
    }).withMessage('First Name must be at least 5 chars long'),
    check('last_name').isLength({
      min: 5
    }).withMessage('Last Name must be at least 5 chars long'),
    // username must be an email
    check('userName').isLength({
      min: 5
    }).withMessage('Email must be a valid address'),
    // password must be at least 5 chars long
    check('password').isLength({
      min: 5
    }).withMessage('Password must be at least 5 chars long')
  ],
  function (req, res) {

    req.session.first_name = req.body.first_name;
    req.session.last_name = req.body.last_name;
    req.session.userName = req.body.userName;
    req.session.password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("index.ejs", {
        errors: req.flash('errors', errors.array())
      });

    } else {
      return res.redirect('/');
    }

  }
);


app.post('/login', function (req, res) {
  req.session.userName = req.body.userName;
  req.session.password = req.body.password;
  res.redirect('/');

});


app.get("/user", function (req, res) {

  if (req.session.userName) {
    check('req.session.userName').isEmail(),
      res.render("user", {
        userName: req.session.userName
      });

  } else if (req.session.first_name, req.session.last_name, req.session.email) {
    res.render("user", {
      userName: req.session.first_name
    });
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