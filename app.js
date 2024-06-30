const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("Welcome to the captain's log!"));

const logsController = require("./controllers/logsController");

app.use("/logs", logsController);
app.get("*", (req, res) => res.status(404).json({ error: "Page not found" }));

module.exports = app;
