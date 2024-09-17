const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");

const userModel = require("./models/user");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  let { name, username, password, email, age } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("the email is already taken");
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      let createdUser = await userModel.create({
        name,
        username,
        password: hash,
        email,
        age,
      });
      res.send(createdUser);
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let userLogin = await userModel.findOne({ email });
  if (!userLogin) return res.status(500).send("Something is wrong");
  bcrypt.compare(password, userLogin.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ email: email, userid: userLogin._id }, "myk");
      res.cookie("token", token);
      res.redirect("/pro");
    } else {
      res.status(500).send("somethingi is wrong ");
    }
  });
});

app.get("/pro", isloggedIn, (req, res) => {
  console.log(req.user);
  res.render("profile");
});

function isloggedIn(req, res, next) {
  let token = req.cookies.token;
  if (!token) return res.send("Plz login first");
  else {
    let data = jwt.verify(token, "myk");
    req.user = data;
    next();
  }
}

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.listen(3000);
