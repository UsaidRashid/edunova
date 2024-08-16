require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3088;
const path = require("path");

require("./configs/dbConfig");
require("./configs/multerConfig");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./configs/uploads")));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const userRouter = require("./routes/users");

app.use("/", userRouter);

app.get("/", (req, res, next) => {
  res.send("It's the backend of Edunova!");
});

app.listen(port, () => {
  console.log(`Edunova running on port ${port}`);
});
