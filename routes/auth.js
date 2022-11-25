const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { route } = require(".");

const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.render("auth/signup", {
        errorMessage: "All field are required",
      });
    }
    await User.create({ username, password });
    res.redirect("/user/profile");
  } catch (error) {
    next(error);
  }
});

router.get("/profile", (req, res, next) => {
  try {
    const{username} = req.session;
    res.render("auth/profile",username);
  } catch (error) {
    next(error);
  }
});

router.get("/login", (req, res, next) => {
  try {
    res.render("auth/login");
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // console.log("--> Session",req.session)
    if (username === "" || password === "") {
      return res.render("auth/login", {
        errorMessage: "Please enter both username and password.",
      });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("auth/profile", {
        //when we are expecting an error we put return
        errorMessage: "User is not registered",
      });
    }else{
        req.session.currentUser = user;
       res.redirect("/user/profile");  
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
