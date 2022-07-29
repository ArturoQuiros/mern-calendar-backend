const { response } = require("express");
const { generateJWT } = require("../helpers/jwt");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //new instance of user
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "email already in use",
      });
    }

    //create the new user
    user = new User(req.body);

    //Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //save on mongo
    await user.save();

    //generate JWT
    const token = await generateJWT(user.id, user.name);

    //correct response
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    //error
    res.status(500).json({
      ok: false,
      msg: "Error, contact sys admin",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "user does not exists",
      });
    }

    //confirm password
    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) {
      return res.status(400).json({
        ok: false,
        msg: "user/password wrong",
      });
    }

    //generate JWT
    const token = await generateJWT(user.id, user.name);

    //correct password
    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    //error
    res.status(500).json({
      ok: false,
      msg: "Error, contact sys admin",
    });
  }
};

const revalidateToken = async (req, res = response) => {
  const uid = req.uid;
  const name = req.name;

  //generate JWT and return
  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  revalidateToken,
};
