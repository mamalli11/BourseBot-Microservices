const router = require("express").Router();

const { ProductsController } = require("../../../http/Controllers/Admin/products.controller");

const { authenticated } = require("../../../http/Middlewares/auth");


router.route("/", authenticated)
    .get(ProductsController.allProducts)         
    .post(ProductsController.handleSendAllProducts);     

//^  @desc   Products Page
//&  @route  GET /
// router.get("/", authenticated, ProductsController.allProducts);

//^  @desc   Products Page
//&  @route  GET /
router.get("/new", authenticated, ProductsController.newProducts);

//^  @desc   Products Page
//&  @route  GET /
router.post("/new", authenticated, ProductsController.handleNewProducts);

//^  @desc   Products Page
//&  @route  GET /
router.get("/edit/:id", authenticated, ProductsController.editProducts);

module.exports = { ProductsRouter: router };