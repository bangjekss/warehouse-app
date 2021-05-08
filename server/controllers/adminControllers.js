const { Op } = require("sequelize");
const sequelize = require("../database");
const fs = require("fs");
const pify = require("pify");
const { uploader } = require("../handlers");

const {
	transaction,
	user,
	monthly_report,
	product,
	warehouse,
	inventory,
	productImage,
	category,
} = require("../models");

const newCategory = async (req, res, next) => {
	try {
		console.log("ea");
		await category.create({
			category: req.body.newCategory,
		});
		return res.status(200).send("add new Category");
	} catch (err) {
		next(err);
	}
};

const getCategories = async (req, res, next) => {
	try {
		const response = await category.findAll();
		const categories = response.map((value) => {
			return {
				value: value.id,
				label: value.category,
			};
		});
		return res.status(200).send(categories);
	} catch (err) {
		next(err);
	}
};

const getWarehouses = async (req, res, next) => {
	try {
		const response = await warehouse.findAll();
		return res.status(200).send(response);
	} catch (err) {
		next(err);
	}
};

const deleteMultipleProduct = async (req, res, next) => {
	try {
		console.log(req.body);
		await product.destroy({
			where: {
				id: {
					[Op.in]: req.body.check,
				},
			},
		});
		await inventory.destroy({
			where: {
				product_id: {
					[Op.in]: req.body.check,
				},
			},
		});
		await productImage.destroy({
			where: {
				product_id: {
					[Op.in]: req.body.check,
				},
			},
		});
		return res.status(200).send("delete");
	} catch (err) {
		next(err);
	}
};

const addProduct = async (req, res, next) => {
	try {
		const path = "/products";
		const imageFile = pify(uploader(path, "PRD").fields([{ name: "image" }]));
		await imageFile(req, res);
		const { name, price, weight, description, categoryId, stock } = JSON.parse(req.body.data);
		console.log(name);
		console.log(req.files);
		const newProduct = await product.create({
			name,
			price,
			weight,
			description,
			category_id: categoryId,
		});
		stock.forEach(async (value) => {
			await inventory.create({
				stock: value.stock,
				warehouse_id: value.warehouseId,
				product_id: newProduct.id,
			});
		});
		req.files.image.forEach(async (value) => {
			await productImage.create({
				imagepath: `${path}/${value.filename}`,
				product_id: newProduct.id,
			});
		});
		return res.status(200).send("nice");
	} catch (err) {
		next(err);
	}
};

const getCategoriesAndWarehouse = async (req, res, next) => {
	try {
		const getCategories = await category.findAll();
		const getWarehouse = await warehouse.findAll();
		const categories = [];
		getCategories.forEach((value) => categories.push({ value: value.id, label: value.category }));
		const response = {
			categories,
			warehouse: getWarehouse,
		};
		return res.status(200).send(response);
	} catch (err) {
		next(err);
	}
};

const getProducts = async (req, res, next) => {
	try {
		// console.log(req.body);
		console.log("ea");
		const limit = parseInt(req.body.limit);
		const offset = parseInt(req.body.currentPage) * limit - limit;
		let query = {
			offset,
			limit: parseInt(req.body.limit),
			where: {
				is_available: 1,
			},
		};
		if (req.query.keyword) {
			query.where = {
				...query.where,
				name: {
					[Op.like]: `%${req.query.keyword}%`,
				},
			};
		}
		if (req.query.category)
			query.where = {
				...query.where,
				category_id: parseInt(req.query.category),
			};
		if (req.query.max && req.query.min)
			query.where = {
				...query.where,
				price: {
					[Op.between]: [parseInt(req.query.min), parseInt(req.query.max)],
				},
			};
		if (req.query.sort == 1) query = { ...query, order: [["created_at", "DESC"]] };
		if (req.query.sort == 2) query = { ...query, order: [["created_at", "ASC"]] };
		if (req.query.sort == 3) query = { ...query, order: [["price", "ASC"]] };
		if (req.query.sort == 4) query = { ...query, order: [["price", "DESC"]] };
		query = {
			...query,
			include: [
				{
					model: inventory,
					as: "inventory",
					attributes: ["id", "stock", "booked_stock", "warehouse_id", "product_id", "updated_at"],
				},
				{
					model: category,
				},
			],
		};
		const getProducts = await product.findAll(query);
		const productsLength = await product.findAll();
		const productImg = await productImage.findAll();
		const getInventory = await inventory.findAll();
		const productsGetImageAndStock = getProducts.map((value) => {
			let num = 0;
			getInventory.forEach((item) => {
				if (item.product_id === value.dataValues.id) {
					num += item.stock;
				}
			});
			return {
				...value.dataValues,
				stock: num,
				image: productImg.filter((item) => {
					return item.product_id === value.dataValues.id;
				}),
			};
		});
		const response = {
			totalProducts: productsLength.length,
			products: productsGetImageAndStock,
		};
		return res.status(200).send(response);
	} catch (err) {
		next(err);
	}
};

const getDashboard = async (req, res, next) => {
	try {
		const totalOrder = await transaction.count("id", {
			where: { order_status_id: 5 },
		});

		const totalProfit = await transaction.sum("amount", {
			where: { order_status_id: 5 },
		});

		const totalClient = await user.count();

		const dailyProfit = await transaction.sum("amount", {
			where: {
				created_at: {
					[Op.between]: [sequelize.fn("subdate", sequelize.fn("now"), 1), sequelize.fn("now")],
				},
				order_status_id: 5,
			},
		});

		const weeklyProfit = await transaction.sum("amount", {
			where: {
				created_at: {
					[Op.between]: [sequelize.fn("subdate", sequelize.fn("now"), 7), sequelize.fn("now")],
				},
				order_status_id: 5,
			},
		});

		const monthlyProfit = await transaction.sum("amount", {
			where: {
				created_at: {
					[Op.between]: [
						sequelize.fn("subdate", sequelize.fn("now"), sequelize.fn("dayofmonth", sequelize.fn("now"))),
						sequelize.fn("now"),
					],
				},
				order_status_id: 5,
			},
		});

		const [[rangeMonthly]] = await sequelize.query(`
			SELECT
				DAYNAME(SUBDATE(NOW(), DAYOFMONTH(NOW()))) AS from_dayname,
    		DAYOFMONTH(SUBDATE(NOW(), DAYOFMONTH(now())-1)) AS from_date,
    		EXTRACT(MONTH FROM SUBDATE(NOW(), DAYOFMONTH(NOW())-1)) AS from_month,
				MONTHNAME(SUBDATE(NOW(), DAYOFMONTH(NOW())-1)) AS from_monthname,
    		YEAR(SUBDATE(NOW(), DAYOFMONTH(NOW()))) AS from_year,
    		DATE_FORMAT(SUBDATE(NOW(), DAYOFMONTH(NOW()) -1), '%M, %D %Y') AS from_date_format,
    		SUBDATE(NOW(), DAYOFMONTH(NOW())-1) AS from_spesific_date,
    		DAYNAME(NOW()) AS to_dayname,
				DAYOFMONTH(NOW()) AS to_date,
				EXTRACT(MONTH FROM NOW()) AS to_month,
    		MONTHNAME(NOW()) AS to_monthname,
    		YEAR(NOW()) AS to_year,
				DATE_FORMAT(NOW(), '%M, %D %Y') AS to_date_format,
    		NOW() AS to_spesific_date 
			FROM transaction;
		`);

		const [[rangeWeekly]] = await sequelize.query(`
			SELECT
				DAYNAME(SUBDATE(NOW(), 7)) AS from_dayname,
    		DAYOFMONTH(SUBDATE(NOW(), 7)) AS from_date,
       	MONTHNAME(SUBDATE(NOW(), 1)) AS from_monthname,
    		EXTRACT(MONTH FROM SUBDATE(created_at, 7)) AS from_month,
        YEAR(SUBDATE(NOW(), DAYOFMONTH(NOW()))) AS from_year,
    		DATE_FORMAT(SUBDATE(NOW(), 7), '%M, %D %Y') AS from_date_format,
    		SUBDATE(NOW(), 7) AS from_spesific_date,
    		DAYNAME(NOW()) AS to_dayname,
				DAYOFMONTH(NOW()) AS to_date,
				EXTRACT(MONTH FROM NOW()) AS to_month,
				MONTHNAME(NOW()) AS to_monthname,
				YEAR(NOW()) AS to_year,
				DATE_FORMAT(NOW(), '%M, %D %Y') AS to_date_format,
    		NOW() AS to_spesific_date 
			FROM transaction ;
		`);

		const [[rangeDaily]] = await sequelize.query(`
			SELECT
				DAYNAME(SUBDATE(NOW(), 1)) AS from_dayname,
    		DAYOFMONTH(SUBDATE(NOW(), 1)) AS from_date,
    		EXTRACT(MONTH FROM SUBDATE(created_at, 1)) AS from_month,
				MONTHNAME(SUBDATE(NOW(), 1)) AS from_monthname,
				YEAR(SUBDATE(NOW(), DAYOFMONTH(NOW()))) AS from_year,
    		DATE_FORMAT(SUBDATE(NOW(), 1), '%M, %D %Y') AS from_date_format,
    		SUBDATE(NOW(), 1) AS from_spesific_date,
    		DAYNAME(NOW()) AS to_dayname,
				DAYOFMONTH(NOW()) AS to_date,
				MONTHNAME(NOW()) AS to_monthname,
				EXTRACT(MONTH FROM NOW()) AS to_month,
				YEAR(NOW()) AS to_year,
				DATE_FORMAT(NOW(), '%M, %D %Y') AS to_date_format,
   		 	NOW() AS to_spesific_date 
			FROM transaction;
		`);

		const monthlyTransaction = await transaction.findAll({
			where: {
				created_at: {
					[Op.between]: [
						sequelize.fn("subdate", sequelize.fn("now"), sequelize.fn("dayofmonth", sequelize.fn("now"))),
						sequelize.fn("now"),
					],
				},
				order_status_id: 5,
			},
		});

		const weeklyTransaction = await transaction.findAll({
			where: {
				created_at: {
					[Op.between]: [sequelize.fn("subdate", sequelize.fn("now"), 7), sequelize.fn("now")],
				},
				order_status_id: 5,
			},
		});

		const dailyTransaction = await transaction.findAll({
			where: {
				created_at: {
					[Op.between]: [sequelize.fn("subdate", sequelize.fn("now"), 1), sequelize.fn("now")],
				},
				order_status_id: 5,
			},
		});
		console.log(rangeDaily);
		const monthlyReport = {
			range: rangeMonthly ? rangeMonthly : null,
			profit: parseInt(monthlyProfit),
			transaction: monthlyTransaction,
		};
		const weeklyReport = {
			range: rangeWeekly ? rangeWeekly : null,
			profit: parseInt(weeklyProfit),
			transaction: weeklyTransaction,
		};
		const dailyReport = {
			range: rangeDaily ? rangeDaily : null,
			profit: parseInt(dailyProfit),
			transaction: dailyTransaction,
		};

		const getMonthlyReportGroup = await monthly_report.findAll({
			group: "year",
		});

		const getMonthlyReport = await monthly_report.findAll();

		const anualReport = [];

		getMonthlyReportGroup.forEach((group, index) => {
			return anualReport.push({
				id: group.year,
				data: getMonthlyReport.map((month, index) => {
					return {
						x: month.month,
						y: month.total_order,
						profit: month.profit,
					};
				}),
			});
		});

		const response = {
			totalOrder,
			totalProfit,
			totalClient,
			monthlyReport,
			weeklyReport,
			dailyReport,
			anualReport,
		};

		return res.status(200).send(response);
	} catch (err) {
		next(err);
	}
};

const sentPackage = async (req, res, next) => {
	try {
		return res.status(200).send(response);
	} catch (err) {
		next(err);
	}
};

const approveBukti = async (req, res, next) => {
	const { transactionId } = req.params;
	try {
		await transaction.update(
			{
				order_status_id: 4,
			},
			{ where: { id: transactionId } }
		);

		res.status(200).send({ message: "Updated" });
	} catch (err) {
		next(err);
	}
};

const rejectBukti = async (req, res, next) => {
	const { transactionId } = req.params;
	try {
		await transaction.update(
			{
				order_status_id: 3,
			},
			{ where: { id: transactionId } }
		);

		res.status(200).send({ message: "Updated" });
	} catch (err) {
		next(err);
	}
};

const kirimBarang = async (req, res, next) => {
	const { transactionId } = req.params;

	try {
		await transaction.update(
			{
				order_status_id: 5,
			},
			{ where: { id: transactionId } }
		);

		req.body.map((val) => {
			const { stock_gateway, product_id } = val;

			stock_gateway.map(async (val) => {
				const { warehouse_id, qty } = val;

				const getData = await inventory.findOne({
					where: {
						[Op.and]: [{ product_id }, { warehouse_id }],
					},
				});

				const bookedStock = getData.booked_stock;

				await inventory.update(
					{
						booked_stock: bookedStock - qty,
					},
					{
						where: {
							[Op.and]: [{ product_id }, { warehouse_id }],
						},
					}
				);
			});
		});

		res.status(200).send({ message: "Updated" });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	deleteMultipleProduct,
	addProduct,
	getCategoriesAndWarehouse,
	getProducts,
	getDashboard,
	sentPackage,
	approveBukti,
	rejectBukti,
	kirimBarang,
	newCategory,
	getCategories,
	getWarehouses,
};
