import { User, validate } from "../models/user.model.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi from "joi";
import JoiPasswordComplexity from "joi-password-complexity";
import dotenv from "dotenv";

dotenv.config();

// Authentication of a valid user
const authenticateUser = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    // Verify the token and extract the user information
    const decoded = Jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = decoded; // Store user information in req.user for further processing
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Sign-Up a new User
export async function signUpUser(req, res) {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

// Sign-In an existing User
export async function signInUser(req, res) {
  try {
    const { error } = validation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const token = user.generateAuthToken();
    res.status(200).send({
      data: {
        token: token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      message: "logged in successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

const validation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

// Delete an existing User
export function deleteUser(req, res) {
  authenticateUser(req, res, async () => {
    try {
      const { error } = validation(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(404).send({ message: "User not found" });

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(401).send({ message: "Invalid Password" });

      await User.deleteOne({ email: req.body.email });

      res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
}

// Change Password for an existing User
export async function changePassword(req, res) {
  authenticateUser(req, res, async () => {
    try {
      const { error } = validationUpdate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(404).send({ message: "User not found" });

      const validPassword = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!validPassword)
        return res.status(401).send({ message: "Invalid Old Password" });

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const newHashPassword = await bcrypt.hash(req.body.newPassword, salt);

      // Update the user's password in the database
      await User.updateOne(
        { email: req.body.email },
        { $set: { password: newHashPassword } }
      );

      res.status(200).send({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
}

const validationUpdate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    oldPassword: Joi.string().required().label("Old Password"),
    newPassword: JoiPasswordComplexity().required().label("New Password"),
  });
  return schema.validate(data);
};
