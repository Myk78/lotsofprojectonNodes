const express = require("express");
const app = express();

const cookieparser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("./models/user");
const PostModel = require("./models/post");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  let { name, password, username, email, age } = req.body;

  let user = await userModel.findOne({ email: email });
  if (user) return res.status(500).send("the email is already used");

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      let user = await userModel.create({
        name,
        username,
        password: hash,
        email,
        age,
      });
    });
  });

  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isloggedIn, async (req, res) => {
  // console.log(req.user);
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("post");
  // console.log(user);
  res.render("profile", { user });
});

app.post("/createPost", isloggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  let { content, likes } = req.body;
  let post = await PostModel.create({ content, likes, user: user._id });
  user.post.push(post._id);
  await user.save();
  res.redirect("/profile");
});

app.get("/like/:liked", isloggedIn, async (req, res) => {
  let post = await PostModel.findOne({ _id: req.params.liked }).populate(
    "user"
  );
  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }
  // console.log(req.user);

  await post.save();
  res.redirect("/profile");
});

app.get("/edit/:postid", isloggedIn, async (req, res) => {
  let editpost = await PostModel.findOne({ _id: req.params.postid }).populate(
    "user"
  );
  res.render("editpost", { editpost });
});

app.post("/editPost/:postid", isloggedIn, async (req, res) => {
  let updatepost = await PostModel.findOneAndUpdate(
    { _id: req.params.postid },
    { content: req.body.content },
    { new: true }
  );
  console.log(updatepost);
  // res.send("hugaya");
  res.redirect("/profile");
});

app.get("/delete/:postid", isloggedIn, async (req, res) => {
  let user = await PostModel.findOneAndDelete({ id: req.user.postid });
  res.redirect("/profile");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let auser = await userModel.findOne({ email: email });
  if (!auser) return res.status(500).redirect("/login");

  bcrypt.compare(password, auser.password, (err, result) => {
    if (result) {
      let = token = jwt.sign({ email: email, userid: auser._id }, "shhhh");
      res.cookie("token", token);
      res.status(200).redirect("/profile");
    } else {
      res.status(500).send("something is wrong!");
    }
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

function isloggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("login");
  // Verify the JWT token
  try {
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
    next();
  } catch (err) {
    return res.send("invalid or expired token");
  }
}
app.listen(3000);
