let express = require("express");
let mongoose = require("mongoose");
let Data = require("./models/book");
let path = require("path");
const { log } = require("console");
const app = express();
app.listen(8080, () => {
  console.log("server started");
});
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
main()
  .then(() => {
    console.log("connection establish");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/books");
}
app.get("/books", async (req, res) => {
  let queryTitle = req.query.title; 
  let filter = {};

  if (queryTitle) {
      let searchWords = queryTitle.split(" ");
      let wordFilters = [];

      searchWords.forEach(word => {
          let wordRegex = new RegExp(word, "i"); // Word boundary ka istemal hata diya
          wordFilters.push({ title: wordRegex });
      });

      filter.$and = wordFilters;
  }

  let allData = await Data.find(filter);
  res.render("books.ejs", { allData, queryTitle });
});
app.get("/books/:id", async (req, res) => {
  let { id } = req.params;
  let bookdata = await Data.findById(id);

  res.render("info.ejs", { bookdata });
});
app.post("/books/book", (req, res) => {
  res.redirect("/books");
});
