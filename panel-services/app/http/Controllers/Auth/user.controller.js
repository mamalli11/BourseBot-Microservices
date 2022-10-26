const axios = require("axios");
const passport = require("passport");

const Controller = require("../controller");

class UserController extends Controller {
    async loginPage(req, res, next) {
        try {
            if (req.user) { return res.redirect('/dashboard'); }
            res.render("login", {
                path: "login",
                layout: false,
                message: req.flash("success_msg"),
                error: req.flash("error"),
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    async handleLogin(req, res, next) {
        try {
            if (!req.body["g-recaptcha-response"]) {
                req.flash("error", "اعتبار سنجی captcha الزامی می باشد");
                return res.redirect("/users/login");
            }

            const secretKey = process.env.CAPTCHA_SECRET;
            const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`;

            const response = await axios({
                method: "post",
                url: verifyUrl,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                },
            });

            const { data } = response;
            if (data.success) {
                passport.authenticate("local", {
                    // successRedirect: "/dashboard",
                    // successReturnToOrRedirect: "/dashboard",
                    failureRedirect: "/users/login",
                    failureFlash: true,
                })(req, res, next);

            } else {
                req.flash("error", "مشکلی در اعتبارسنجی captcha هست");
                res.redirect("/users/login");
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async rememberMe(req, res) {
        console.log('******************** remember ==> ',req.body.remember);
        if (req.body.remember) {
            req.session.cookie.originalMaxAge = 168 * 60 * 60 * 1000; // 7 day 24
        } else {
            req.session.cookie.expire = null;
        }
        res.redirect("/dashboard");
    }
    logout(req, res, next) {
        try {
            req.session = null;
            req.logout(function (err) {
                if (err) { return next(err); }
                res.redirect("/users/login");
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = { UserController: new UserController() };
