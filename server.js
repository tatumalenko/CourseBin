const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const dbConnection = require('./server/database');
const passport = require('./server/passport');
const configs = require('./configs/configs');

const app = express();
const PORT = 3001;
// Route requires
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

// Starting Server
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
