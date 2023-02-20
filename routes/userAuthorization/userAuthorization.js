const express = require('express');
const passport = require('../../passport-config');
const authController = require('../../controllers/authController');
const accountController = require('../../controllers/accountController');

const router = express.Router();

router.get('/login', authController.checkLoggedIn, (req, res) => {
    res.render('../views/userAuthorization/loginPage', {layout: false});
});

router.post("/login", passport.authenticate('local', {
    successRedirect: "/cars",
    failureRedirect: "/auth/login",
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.end()
    }
})

router.get('/register', authController.checkLoggedIn, (req, res) => {
    res.render('../views/userAuthorization/registerPage', {layout: false});
});


module.exports = router;
