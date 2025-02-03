const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProductController,
  getProductController,
  getOneProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  brainTreePaymentController,
} = require("../controllers/ProductController");
const formidableMiddleware = require("express-formidable");
const { orderStatusController } = require("../controllers/authController");

const productRouter = express.Router();

productRouter.post(
  "/create_product",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  createProductController
);

productRouter.put(
  "/update_product/:pid",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  updateProductController
);

productRouter.get("/get-product", getProductController);
productRouter.get("/get-product/:slug", getOneProductController);
productRouter.get("/product-photo/:pid", productPhotoController);
productRouter.delete("/deleteProduct/:pid", deleteProductController);
productRouter.post("/productFilter", productFilterController);
productRouter.get("/product-count", productCountController);
productRouter.get("/product-list/:page", productListController);
productRouter.get("/search/:keyword", searchProductController);
productRouter.get("/related-product/:pid/:cid", relatedProductController);
productRouter.get("/product-category/:slug", productCategoryController);

//payment route
productRouter.get("/braintree/token", braintreeTokenController);

//payments
productRouter.post(
  "/braintree/payment",
  requireSignIn,
  brainTreePaymentController
);

module.exports = productRouter;
