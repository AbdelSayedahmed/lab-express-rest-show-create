const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Welcome to our log app!"));

module.exports = app;
