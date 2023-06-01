import app from "./app";
import mongoose from "mongoose";
import config from "./config/index";

const port = 5000;

// database connection
async function dbFunction() {
  try {
    // db
    await mongoose.connect(config.database_url as string);
    // app
    app.listen(port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
    // checking
    console.log(`Successfully db is connected`);
  } catch (err) {
    console.log(err);
  }
}

dbFunction();
