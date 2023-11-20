const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const userroute = require("./routes/approute");
const cors = require("cors");
const { secretKey } = require("./config/keys");
const cookieparser = require("cookie-parser");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());


// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  console.log("path " + req.path + " method " + req.method);
  next();
});

app.use(
  cors({
   origin: "https://flavorfuse.netlify.app",
    credentials: true, 
  })
);
app.options('*', cors());



// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 3001; 
    app.listen(port, () => {
      console.log("DB connected Successfully and listening to " + port);
    });
  })
  .catch((error) => console.log(error));

app.use("/api/users", userroute);
