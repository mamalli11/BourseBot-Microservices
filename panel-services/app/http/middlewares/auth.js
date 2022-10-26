exports.authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/404");
};

exports.checkLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/users/login");
};
