ess = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/create", async function (req, res) {
  //   let { name, email, image } = req.body;
  const createduser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    description: req.body.description,
    image: req.body.image,
  });
  //   const listeduser = await userModel.find();
  res.redirect("/read");
});

app.get("/read", async function (req, res) {
  const listeduser = await userModel.find();
  res.render("read", { users: listeduser });
});

app.get("/delete/:id", async (req, res) => {
  const del = await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});
app.get("/edit/:id", async (req, res) => {
  const fuser = await userModel.findOne({ _id: req.params.id });
  res.render("edit", { fuser });
});
app.post("/update/:id", async (req, res) => {
  const up = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      email: req.body.email,
      image: req.body.image,
      description: req.body.description,
    },
    { new: true }
  );
  res.redirect("/read");
});

app.listen(3000);
