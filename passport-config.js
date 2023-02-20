const passport = require('passport');
const connection = require("./database");
const {Strategy: LocalStrategy} = require("passport-local");

const authUser = (email, password, done) => {
    connection.query('SELECT * FROM user Where user_email = ?', [email], async (error, result) => {
        console.log(result);
        if (result.length == 0) {
            done(null, false, {message: 'Nieprawidłowy email!'});
        } else if (result[0].user_password != password) {
            done(null, false, {message: 'Nieprawidłowe hasło!'});
        } else {
            let authenticated_user = {id: result[0].user_id, name: result[0].user_email}
            done(null, {authenticated_user});
        }
    });
}

passport.use(new LocalStrategy({usernameField: 'email'}, authUser));

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

module.exports = passport;
