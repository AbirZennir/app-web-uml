const express = require("express");
const { generateCode } = require("../controllers/diagramController");

const router = express.Router();

router.post("/generate-code", generateCode);

module.exports = router;
