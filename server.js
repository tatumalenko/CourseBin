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
const catalog = require('./server/routes/catalog');
const timetable = require('./server/routes/timetable');
const degree = require('./server/routes/degree');

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
app.use('/catalog', catalog);
app.use('/timetable', timetable);
app.use('/degree', degree);

if (configs.nodeEnv === 'production') {
  // Express will serve up production assets
  app.use(express.static('client/build'));

  // ============== ALWAYS KEEP THIS AS THE LAST ROUTE ==============
  app.get('*', (req, res) => {
    console.log("404 page error");
    res.status(404).sendFile(path.resolve(__dirname, 'client', 'build', 'error_page.html')); // temporary error page until front end stylizes it
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
