const express = require("express");
const router = express.Router();
const {
	sentPackage,
	approveBukti,
	rejectBukti,
	kirimBarang,
	getProducts,
	addProduct,
	getCategoriesAndWarehouse,
	deleteMultipleProduct,
	newCategory,
	getCategories,
	getWarehouses,
} = require("../controllers/adminControllers");
const { getDashboard } = require("../controllers/adminControllers");

router.get("/categories", getCategories);
router.get("/warehouses", getWarehouses);
router.get("/dashboard", getDashboard);
router.post("/products", addProduct);
router.put("/products", getProducts);
router.patch("/products", deleteMultipleProduct);
router.get("/product-categories-and-warehouse", getCategoriesAndWarehouse);
router.get("/sent-package", sentPackage);
router.patch("/approve-bukti/:transactionId", approveBukti);
router.patch("/reject-bukti/:transactionId", rejectBukti);
router.patch("/kirim-barang/:transactionId", kirimBarang);
router.post("/add-new-category", newCategory);

module.exports = router;
