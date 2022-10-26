const router = require("express").Router();

const Payment = require("../../../http/Controllers/Client/PaymentController");

router.get("/callbackurl", Payment.CallBackUrl);

module.exports = { paymentRouter: router };
