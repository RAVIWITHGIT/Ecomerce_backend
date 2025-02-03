const { z } = require("zod");
const userModel = require("../models/userModel");
require("dotenv").config();
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const jwt = require("jsonwebtoken");
const OrderModel = require("../models/OrderModel");

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.send({ message: "Name is Required" });
    } else if (!email) {
      return res.send({ message: "Email is Required" });
    } else if (!password) {
      return res.send({ message: "password is Required" });
    } else if (!phone) {
      return res.send({ message: "phone is Required" });
    } else if (!address) {
      return res.send({ message: "address is Required" });
    } else if (!answer) {
      return res.send({ message: "answer is Required" });
    }

    //check request type using zod
    const userRequestCheck = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      phone: z.string(),
      address: z.string(),
      answer: z.string(),
    });
    const userzod = userRequestCheck.safeParse(req.body);
    if (!userzod.success) {
      const error = userzod.error.format();
      return res.status(400).send({ message: false, error });
    }

    //check user
    const exisitingUser = await userModel.findOne({ email });

    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register",
      });
    }

    //register user
    const match = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      password: match,
      phone,
      address,
      answer,
    }).save();

    res.status(200).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation for blank data
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registered",
      });
    }

    //match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

const testController = async (req, res) => {
  res.send("protect route");
};

const forgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is Required" });
    } else if (!answer) {
      res.status(400).send({ message: "answer is Required" });
    } else if (!newPassword) {
      res.status(400).send({ message: "new Password is Required" });
    }

    // check
    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user.id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password breat successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (!password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Update profile",
      error,
    });
  }
};

//order controller for user
const getOrderController = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    return res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

// order controller for admin
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

const userController = async (req, res) => {
  try {
    const getAllUser = await userModel.find({ role: 0 });
    return res.json(getAllUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error While fetching user Details",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  testController,
  forgetPasswordController,
  updateProfileController,
  getOrderController,
  getAllOrdersController,
  orderStatusController,
  userController,
};
