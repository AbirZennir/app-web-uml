const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const diagramRoutes = require("./routes/diagramRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", diagramRoutes);

module.exports = app;
