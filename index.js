//requires
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");
require("dotenv").config();

//express server
const app = express();

//DB Connection
dbConnection();

//CORS
app.use(cors());

//public
app.use(express.static("public"));

//lectura y parseo de Auth
app.use(express.json("./routes/auth"));

//Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

//excceptionn
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//listen
app.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}`);
});
