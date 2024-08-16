const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("Successfully connected to Edunova Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

module.exports = main;