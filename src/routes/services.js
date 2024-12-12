const express = require("express");
const router = express.Router();
const servicesController = require("../controllers/servicesController");


router.get("/", servicesController.getAllServices);
router.get("/myservices", servicesController.getMyServices);
router.get("/myservice/detail/:id", servicesController.getServiceDetail);

router.get("/add", servicesController.addService);
router.post("/add-new",servicesController.newService);

router.get("/catalogue", servicesController.getServices);
router.get("/detail/:id", servicesController.getSe);

module.exports = router;