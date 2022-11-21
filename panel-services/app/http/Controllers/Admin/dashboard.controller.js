const Controller = require("../controller");

class DashboardController extends Controller {
    async index(req, res, next) {
        try {
            res.render("private/dashboard", {
                path: "/dashboard",
                layout: "./layouts/dashLayout",
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = { DashboardController: new DashboardController() };