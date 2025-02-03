// const { default: categoryModel } = require("../models/categoryModel");
const slugify = require("slugify");
const categoryModel = require("../models/categoryModel");
const fs = require("fs");

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(500)
        .send({ error: "photo is Required and should be less then 1mb" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exisits",
      });
    }

    const category = new categoryModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }

    await category.save();

    return res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

const categoryPhotoController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.pid);
    if (category.photo.data) {
      res.set("Content-type", category.photo.contentType);
      return res.status(200).send(category.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(500)
        .send({ error: "photo is Required and should be less then 1mb" });
    }
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }

    await category.save();
    res.status(200).send({
      success: true,
      message: "category update successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

// get all category
const getCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    return res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

//get one category

const getOneCategoryController = async (req, res) => {
  try {
    const oneCategory = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "get Single Category Successfully",
      oneCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const id = req.params.id;
    await categoryModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  getOneCategoryController,
  deleteCategoryController,
  categoryPhotoController,
};
