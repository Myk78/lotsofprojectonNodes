const express = require("express");
const app = express();

const userModel = require("./model/user");

const cookieparser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const exp = require("constants");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  let { name, email, password, age } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      let createduser = await userModel.create({
        name,
        email,
        password: hash,
        age,
      });
      let token = jwt.sign({ email }, "skkaka");
      res.cookie("token", token);
      res.send(createduser);
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  let auser = await userModel.findOne({ email: req.body.email });
  if (!auser) return res.send("something wrong");
  bcrypt.compare(req.body.password, auser.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email: auser.email }, "skkaka");
      res.cookie("token", token);
      res.send("you are login");
    } else {
      res.send("you not login");
    }
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.listen(3000);
