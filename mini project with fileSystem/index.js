const express = require("express");
const path = require("path");
const file = require("fs");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function (req, res) {
  file.readdir(`./files`, "utf8", function (err, files) {
    res.render("index", { fs: files });
  });
});

app.post("/createpost", function (req, res) {
  file.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    function (err) {
      res.redirect("/");
      console.log(err);
    }
  );
});

app.get("/task/:detail", function (req, res) {
  const filepath = `./files/${req.params.detail}`;
  file.readFile(filepath, "utf8", function (err, data) {
    if (err) {
      console.log("error is occur in read the file", filepath);
      return res.status(404).send("not found a file");
    }
    // console.log(data);
    res.render("detail", { fs: req.params.detail, data });
  });
});
app.get("/edit/:filename", function (req, res) {
  res.render("edit", { filename: req.params.filename });
});
app.post("/edit", function (req, res) {
  file.rename(
    `./files/${req.body.old_title}`,
    `./files/${req.body.newtitle}`,
    function (err) {
      if (err) {
        console.log("sorry we cn,t the change file name");
        return err;
      } else {
        console.log("name change successfully");
      }
    }
  );
  res.redirect("/");
});

app.listen(3000, function (req, res) {
  console.log("server bhag rah h");
  //   res.send("");
});
// app.listen(3000);
