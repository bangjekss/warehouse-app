const { Op } = require("sequelize");
const { apiURL } = require("../helpers");
const { product, inventory, category, productImage } = require("../models");

const addProduct = async (req, res, next) => {
	try {
		const { name, price, category_id, stock, warehouse_id, description } = req.body;
		const newProduct = await product.create({
			name,
			price,
			category_id,
			description,
		});
		await inventory.create({
			stock,
			product_id: newProduct.id,
			warehouse_id,
		});
		return res.status(200).send("successfully added product");
	} catch (err) {
		next(err);
	}
};

const getProducts = async (req, res, next) => {
	try {
		const limit = parseInt(req.query.limit);
		let query = {
			limit,
			offset: parseInt(req.query.page) * limit - limit,
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
		if (req.query.category && req.query.category != 0)
			query.where = {
				...query.where,
				category_id: parseInt(req.query.category),
			};
		if (req.query.min)
			query.where = {
				...query.where,
				price: { [Op.gte]: parseInt(req.query.min) },
			};
		if (req.query.max)
			query.where = {
				...query.where,
				price: { [Op.lte]: parseInt(req.query.max) },
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
			include: [{ model: category }],
		};
		const checkProductsStock = await product.findAll({
			include: [{ model: inventory, as: "inventory" }, { model: category }],
		});
		// console.log();
		let getIndex = [];
		checkProductsStock.forEach((value) => {
			if (value.inventory[0].stock === 0 && value.inventory[1].stock === 0 && value.inventory[2].stock === 0) {
				getIndex.push(value.id);
			}
		});
		await product.update(
			{ is_available: 0 },
			{
				where: {
					id: {
						[Op.in]: getIndex,
					},
				},
			}
		);
		console.log(query);
		const getProducts_ = await product.findAll({
			where: {
				is_available: 1,
			},
		});
		const getProducts = await product.findAll(query);
		const productImg = await productImage.findAll();
		const getInventory = await inventory.findAll();
		const getMaxPrice = await product.findOne({
			order: [["price", "DESC"]],
		});
		const getMinPrice = await product.findOne({
			order: [["price", "ASC"]],
		});
		const productsGetImageAndStock = getProducts.map((value) => {
			let num = 0;
			getInventory.forEach((item) => {
				if (item.product_id === value.id) {
					num += item.stock;
				}
			});
			return {
				...value.dataValues,
				stock: num,
				image: productImg
					.filter((item) => {
						return item.product_id === value.id;
					})
					.map((item) => {
						return { ...item.dataValues, imagepath: `${apiURL}${item.dataValues.imagepath}` };
					}),
			};
		});
		const response = {
			totalProducts: getProducts_.length,
			maxPrice: getMaxPrice.price,
			minPrice: getMinPrice.price,
			products: productsGetImageAndStock,
		};
		return res.status(200).send(response);
	} catch (err) {
		next(err);
	}
};

const getCategories = async (req, res, next) => {
	try {
		console.log("ea");
		const categories = await category.findAll();
		const response = [];
		categories.forEach((value) => response.push({ value: value.id, label: value.category }));
		return res.status(200).send(response);
	} catch (err) {
		next(err);
	}
};

const getProductById = async (req, res, next) => {
	try {
		const getById = await product.findOne({
			raw: true,
			attributes: [
				"id",
				"name",
				"price",
				"description",
				"category.category",
				"inventory.stock",
				"product_images.imagepath",
			],
			include: [
				{
					model: category,
					attributes: [],
				},
				{
					model: inventory,
					as: "inventory",
					attributes: [],
				},
				{
					model: productImage,
					attributes: [],
				},
			],
			where: { id: req.params.id },
		});
		res.status(200).send(getById);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	addProduct,
	getProducts,
	getCategories,
	getProductById,
};
