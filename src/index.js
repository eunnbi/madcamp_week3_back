const router = require('./routes');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require("dotenv").config();
// MongoDB 연결
mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(process.env.PORT, () => console.log("Start Server"));