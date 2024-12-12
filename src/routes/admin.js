const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const categoriesController = require("../controllers/categoriesController.js");
const customerController = require("../controllers/customerController.js");
const serviceController = require("../controllers/servicesController.js");
const orderController = require("../controllers/orderController");

router.get("/",adminController.print);

router.get("/categories", categoriesController.list);
router.post("/categories/add", categoriesController.add);
router.get('/categories/delete/:name',categoriesController.delete);
router.get('/categories/update/:name',categoriesController.edit);
router.post('/categories/update/:name',categoriesController.update);

router.get("/users", customerController.list);
router.get('/users/update/:id',customerController.edit);
router.post('/users/update/:id',customerController.update);
router.get('/users/delete/:id',customerController.delete);

router.get("/services", serviceController.getAllServices);

router.get("/orders", orderController.list);

module.exports = router;