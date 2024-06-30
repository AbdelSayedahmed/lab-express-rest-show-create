const express = require("express");
const router = express.Router();
const logs = require("../models/logs");

router.get("/NotFound", (req, res) => res.send("Index not found!"));

router.get("/", (req, res) => {
  const { order, mistakes, lastCrisis } = req.query;

  let newLogs = [...logs];

  if (order !== undefined) {
    if (order === "asc") {
      newLogs.sort((a, b) => a.captainName.localeCompare(b.captainName));
    } else if (order === "desc") {
      newLogs.sort((a, b) => b.captainName.localeCompare(a.captainName));
    } else {
      return res
        .status(404)
        .send({ error: `Query "${order}" is invalid for order` });
    }
  }

  if (mistakes !== undefined) {
    if (mistakes === "true") {
      newLogs = newLogs.filter((log) => log.mistakesWereMadeToday);
    } else if (mistakes === "false") {
      newLogs = newLogs.filter((log) => !log.mistakesWereMadeToday);
    }
  }

  if (lastCrisis !== undefined) {
    const days = parseInt(lastCrisis.slice(3));
    if (lastCrisis.startsWith("gth")) {
      newLogs = newLogs.filter((log) => log.daysSinceLastCrisis > days);
    } else if (lastCrisis.startsWith("gte")) {
      newLogs = newLogs.filter((log) => log.daysSinceLastCrisis >= days);
    } else if (lastCrisis.startsWith("lte")) {
      newLogs = newLogs.filter((log) => log.daysSinceLastCrisis <= days);
    } else {
      return res
        .status(404)
        .send({ error: `Query "${lastCrisis}" is invalid for lastCrisis` });
    }
  }

  res.status(200).send(newLogs);
});

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

// router.get("/:id", (req, res) => {
//   const { id } = req.params;
//   const log = logs.find((input) => input.id === +id);
//   log
//     ? res.status(200).send(log)
//     : res.status(404).json({ error: `log with id: ${id} not found!` });
// });

module.exports = router;
