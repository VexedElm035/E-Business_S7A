const express = require("express");
const router = express.Router();
const addController = require("../controllers/addController.js");

router.get("/",addController.addService);
router.post("/add",addController.newService);

module.exports = router;