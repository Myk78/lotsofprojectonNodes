const express = require("express");
const cookieparser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cookieparser());
app.get("/", (req, res) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash("myk", salt, function (err, hash) {
      console.log(salt);
    });
  });

  //cookies
  //   res.cookie("myk", "yaseen");
  //   //   console.log(req.cookies);
  //   res.send("done cookie");
});
app.get("/decrypt", (req, res) => {
  bcrypt.compare(
    "myk",
    "$2b$10$ZjsW/6tFr7qz3bANaVV0WukyXIsu5PjC9oo8JQpmVX8TS2jsqM4Gm",
    function (err, result) {
      console.log(result);
    }
  );
  res.send("check the decryption");
});

app.get("/jwt", (req, res) => {
  let token = jwt.sign({ email: "myk@gmail.com" }, "mykass");
  res.cookie("token", token);
  res.send("jwt token send the client browser");
  console.log(req.cookies.token);
});

app.listen(3000);
