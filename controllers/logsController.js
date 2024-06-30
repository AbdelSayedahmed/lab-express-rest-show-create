const express = require("express");
const router = express.Router();
const logs = require("../models/logs");

router.get("/NotFound", (req, res) => res.send("Index not found!"));

router.get("/", (req, res) => res.status(200).send(logs));

router.post("/", (req, res) => {
  const currentLog = { ...req.body };
  logs.push(currentLog);
  res.status(201).send(logs[logs.length - 1]);
});

router.get("/:indexArray", (req, res) => {
  logs[req.params.indexArray]
    ? res.json(logs[req.params.indexArray])
    : res.status(404).redirect("/logs/NotFound");
});

router.delete("/:indexArray", (req, res) => {
  const { indexArray } = req.params;
  const logIndex = parseInt(indexArray, 10);

  if (logIndex >= 0 && logIndex < logs.length) {
    logs.splice(logIndex, 1);
    res.status(200).send(`Log with index ${indexArray} has been deleted`);
  } else {
    res
      .status(404)
      .send({ error: `Log with indexArray: ${indexArray} not found!` });
  }
});

module.exports = router;
