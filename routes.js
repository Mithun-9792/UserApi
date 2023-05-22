const express = require("express");
const User = require("../model/model");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.Secret_Key;

//Login Method

router.post("/login", async (req, res) => {
  const user = await User.findOne({ name: req.body.name });
  if (user) {
    const userAllowed = await bcrypt.compare(req.body.password, user.password);
    if (userAllowed) {
      const accessToken = jwt.sign(user.toJSON(), key, { expiresIn: 604800 });
      res.status(200).send({ token: accessToken });
    } else {
      res.send("No user found or invalid password were provided!");
    }
  } else {
    res.status(404).send("User Not found!");
  }
});

router.post("/me", async (req, res) => {
  const token = req.rawHeaders[1].slice(7);
  const tokenDecodablePart = token.split(".")[1];
  const decoded = Buffer.from(tokenDecodablePart, "base64").toString();
  if (decoded) {
    res.status(200).send(decoded);
  } else {
    res.status(401).send("Token is not valid!");
  }
});
//Post Method
router.post("/", async (req, res) => {
  let hashedPassword;

  await bcrypt.hash(req.body.password, 10).then((hash) => {
    hashedPassword = hash;
  });
  const data = new User({
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    phone: req.body.phone,
    password: hashedPassword,
    dept: req.body.dept,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
router.get("/", async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/:id", async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
