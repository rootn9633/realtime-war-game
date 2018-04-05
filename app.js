var express = require ('express');
var bodyParser = require ('body-parser');
var session = require("express-session");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const server = {
  host: '127.0.0.1',
  port: 3000
}

const users = {
  rootn: 'How',
}

var localStrategy = new LocalStrategy(
  function (username, password, done) {
    console.log(username, password);
    user = users[username];
    console.log(user);

    if (user == null) {
      return done(null, false, { message: 'Invalid user' });
    };

    if (user !== password) {
      return done(null, false, { message: 'Invalid password' });
    };

    done(null, user);
  }
)

passport.use('local', localStrategy);



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.use(bodyParser({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get('/', (req, res) => {
  if (req.user) {
    // logged in
    console.log(req.user);
    res.send('hi');
  } else {
    // not logged in
    res.redirect('/login.html');
  }
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.get('/login', (req, res) => {
  res.redirect('/login.html');
});


app.get('*', (req, res) => {
  res.status(404).send({ message: '404_not_found' });
});

app.listen(server.port, async (err) => {
  if (err) {
    console.error(err);
    throw (err);
  }
  console.log(`Server is listening on ${server.host}:${server.port}`);
});