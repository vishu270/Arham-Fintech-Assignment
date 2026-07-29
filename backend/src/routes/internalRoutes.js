const express = require("express");
const { getEmployees, getMappings } = require("../controllers/internalController");

const router = express.Router();

router.get("/employees", getEmployees);
router.get("/mappings", getMappings);

module.exports = router;
