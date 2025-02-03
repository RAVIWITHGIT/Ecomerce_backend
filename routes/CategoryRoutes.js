// import { createCategoryController } from "../controllers/CreateCategoryController";

const express = require("express");
const {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  getOneCategoryController,
  deleteCategoryController,
  categoryPhotoController,
} = require("../controllers/CreateCategoryController");
const formidableMiddleware = require("express-formidable");

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

const categoryRouter = express.Router();

//create category
categoryRouter.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  createCategoryController
);

//update category
categoryRouter.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  updateCategoryController
);

categoryRouter.get("/get_category", getCategoryController);
categoryRouter.get("/get_OneCategory/:slug", getOneCategoryController);
categoryRouter.delete(
  "/deleteCategory/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

categoryRouter.get("/category-photo/:pid", categoryPhotoController);

module.exports = categoryRouter;
