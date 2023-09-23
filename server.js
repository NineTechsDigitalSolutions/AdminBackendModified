require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const moment = require("moment");
const multer = require("multer");

const CronJob = require("cron").CronJob;

const app = express();
http.createServer(app);

//init middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get("/", (req, res) => res.send("Server Running1"));

app.use(multer().array("pictures"));

//define routes
app.use("/auth", require("./routes/auth"));
app.use("/library", require("./routes/library"));
app.use("/user", require("./routes/user"));
app.use("/librarian", require("./routes/librarian"));
app.use("/plan", require("./routes/plan"));
app.use("/material", require("./routes/material"));
app.use("/category", require("./routes/category"));
app.use("/book", require("./routes/book"));
app.use("/author", require("./routes/author"));
app.use("/sales", require("./routes/sales"));
app.use("/banner", require("./routes/banner"));
app.use("/content", require("./routes/content"));
app.use("/order", require("./routes/order"));
app.use("/product", require("./routes/product"));
app.use("/query", require("./routes/query"));
app.use("/admin", require("./routes/admin"));
app.use("/home", require("./routes/home"));
app.use("/payments", require("./routes/payments"));
app.use("/notification", require("./routes/notification"));

// app.use(express.static(require("path").join(__dirname, "/uploads")));

mongoose
  .connect("mongodb+srv://mlb:4VFXOY91R63FdGA6@cluster0.k2k69pk.mongodb.net/?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then((result) => {
    const port = process.env.PORT || 5002;
    app.listen(port);
    console.log(`Connected to PORT ${port} `);
  })
  .catch((err) => {
    console.log(err);
  });
