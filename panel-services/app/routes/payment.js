const router = require("express").Router();

const Payment = require("../controllers/PaymentController");

router.get("/payment/callbackurl", Payment.CallBackUrl);

module.exports = { paymentRouter: router };
