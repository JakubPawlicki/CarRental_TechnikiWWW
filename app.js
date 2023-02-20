const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(express.static('public'))

const handlebars = expressHbs.create({extname: '.hbs'});
handlebars.handlebars.registerHelper('formatTime', function (date, format) {
    var mmnt = new Date(date);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    return`${year}-${month}-${day}`;
});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use(express.static(__dirname + '/public'));

app.use(flash());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 8
    }
}));
const passport = require('./passport-config');

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/userAuthorization/userAuthorization'));
app.use('/cars', require('./routes/carManagement/carManagement'));
app.use('/user', require('./routes/userManagement/userManagement'));


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

app.get('/', (req, res) => {
    res.redirect('/cars');
});

