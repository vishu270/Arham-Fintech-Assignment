const express = require("express");
const { getClients } = require("../controllers/clientController");
const bseMiddleware = require("../middleware/bseMiddleware");

const router = express.Router();

router.get("/", bseMiddleware, getClients);

module.exports = router;
