const request = require("request-promise");

const { IdValidator } = require("../../../utils/IdValidator");

class indexController {
  async index(req, res, next) {
    const { id } = req.params;
    try {
      if (IdValidator(id) || id.length > 12) {
        const user = await Users.findById(id);
        if (user) {
          res.render("index", { id });
        } else {
          throw { Code: "400", Title: "خطا شناسایی کاربر", Message: "نمی تونم بشناسمت چرا آیا." };
        }
      } else {
        throw { Code: "406", Title: "خطا شناسایی کاربر", Message: "یه مشکلی پیش امده، فک می کنم غریبه ای" };
      }
    } catch (err) {
      next(err);
    }
  }
  async buyPanel(req, res, next) {
    try {
      const { id, panel } = req.params;
      const user = await Users.findById(id);

      if (user.phone) {
        let params = {
          MerchantID: process.env.MERCHANTID,
          Amount: panel == "Gold" ? "10000" : "5000",
          CallbackURL: `http://localhost:3000/api/payment/callbackurl`,
          Description: "خرید محصول",
          Mobile: user.phone,
        };

        let options = {
          method: "POST",
          url: "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
          header: {
            "cache-control": "no-cache",
            "content-type": "application/json",
          },
          body: params,
          json: true,
        };

        const data = await request(options);

        if (!data) {
          errors.push({ message: "در حال حاضر امکان خرید وجود ندارد" });
          throw error;
        }

        await Payment.create({
          user: user.id,
          product: panel,
          resnumber: data.Authority,
          price: panel == "Gold" ? "10000" : "5000",
        });

        res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.Authority}`);
      } else {
        res.status(400).json({ message: "قبل از خرید اطلاعات حساب کاربری را تکمیل کنید" });
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
}

module.exports = { IndexController: new indexController() };
