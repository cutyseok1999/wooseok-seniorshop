const express = require("express");

const ordersController = require("../controllers/orders.controller");

const router = express.Router();

router.post("/", ordersController.addOrder); // /orders

router.get("/", ordersController.getOrders); // /orders

router.post("/direct", ordersController.addOrderDirectly);

router.patch("/cancel/:id", ordersController.cancelOrder);

module.exports = router;
