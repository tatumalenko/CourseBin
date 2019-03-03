const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const dbConnection = require('./server/database');
const passport = require('./server/passport');
const configs = require('./configs/configs');

const app = express();
const PORT = process.env.PORT || 3001;
const user = require('./server/routes/user');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());

// Sessions
app.use(
  session({
    secret: configs.dbMongo.sessionSecret,
    store: new MongoStore({ mongooseConnection: dbConnection }),
    resave: false, // required
    saveUninitialized: false, // required
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session()); // calls the deserializeUser

// Routes
app.use('/user', user);

if (configs.nodeEnv === 'production') {
  // Express will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  app.get('*', (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    res.end('Page not found!'); // temporary until 404 page created by front end
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
