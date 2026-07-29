const express = require("express");
const { getTrades } = require("../controllers/tradeController");
const bseMiddleware = require("../middleware/bseMiddleware");

const router = express.Router();

router.get("/", bseMiddleware, getTrades);

module.exports = router;
