const express = require("express");
const app = express();

const userModel = require("./models/user");
const postModel = require("./models/post");

app.get("/", (req, res) => {
  res.send("okay ki report");
});

app.get("/create", async (req, res) => {
  let user = await userModel.create({
    name: "myk",
    email: "myk@gmail.com",
  });
  res.send(user);
});

app.get("/create/post", async (req, res) => {
  let post = await postModel.create({
    name: "post1",
    data: "hello i am post",
    userid: "66e55d378d35253990d2e83a",
  });
  let user = await userModel.findOne({ _id: "66e55d378d35253990d2e83a" });
  user.post.push(post._id);
  await user.save();
  res.send({ post, user });
});

app.listen(3000);
