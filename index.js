const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const dotenv = require("dotenv");
const app = express();

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {})
  .then(console.log("DB Successfully Connected"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const url = await ShortUrl.findOne({ short: id });

  if (!url) {
    res.status(404).send("Can Not Find Short");
  }

  url.clicks++;
  await url.save();
  res.redirect(url.full);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("App Is Running On Port " + PORT);
});
