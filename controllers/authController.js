exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/auth/login")
}

exports.checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/cars")
    }
    next();
}