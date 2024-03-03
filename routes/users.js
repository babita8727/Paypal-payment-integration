var express = require("express");
var router = express.Router();
require("express-group-router");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

const { verifyToken } = require("../middleware/auth");
const AUTH_CONTROLLER = require("../app/auth/controller/auth.controller");
const PRODUCT_CONTROLLER = require("../app/product/controller/product.controller.js");

/*AUTH ROUTES*/
router.post("/register", AUTH_CONTROLLER.register);
router.post("/login", AUTH_CONTROLLER.login);

/*PRODUCT ROUTES*/
router.post("/add-product", verifyToken, PRODUCT_CONTROLLER.addProduct);
router.post("/create_order", verifyToken, PRODUCT_CONTROLLER.createOrder);
router.post("/purchaseProduct", verifyToken, PRODUCT_CONTROLLER.purchaseProduct);
router.get("/success", verifyToken, PRODUCT_CONTROLLER.successPage);
router.get("/cancel", verifyToken, PRODUCT_CONTROLLER.cancelPage);


module.exports = router;
