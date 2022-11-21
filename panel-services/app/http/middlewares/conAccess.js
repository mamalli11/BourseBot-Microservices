const Role = require("../../models/Role");
const helpers = require("../../helper/index");

function check(Permission) {
    return async function (req, res, next) {
        try {

            if (req?.user?.isAdmin) { return next(); }

            for (const roleId of req.user.Role) {

                const role = await Role.findById(roleId);

                if (await helpers.roleHasPermission(role.id, Permission)) { return next(); }
            }
            res.redirect("/404");
        } catch (error) {
            console.log(error);
            res.redirect("/500");
        }
    }
}

function AccessMenu(Permission) {
    return async function (req, res, next) {
        try {

            if (req.user.isAdmin) { return true; }

            for (const roleId of req.user.Role) {

                const role = await Role.findById(roleId);

                if (await helpers.roleHasPermission(role.id, Permission)) { return true; }
            }
            return false;
        } catch (error) {
            console.log(error);
            res.redirect("/500");
        }
    }
}


module.exports = { check, AccessMenu }