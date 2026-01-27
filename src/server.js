require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");


if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  const port = process.env.PORT || 5000;
  app.listen(port, () =>
    console.log(`Server running on port ${port}`)
  );
});
