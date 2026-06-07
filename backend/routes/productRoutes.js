const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
} = require("../controllers/productControllers");

// Map the routes to the controller logic
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
