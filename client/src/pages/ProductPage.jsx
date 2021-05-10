import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsAction } from "../redux/actions";
import { Button, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import Select from "react-select";
import axios from "axios";
import { accentColor, apiUrl_product } from "../helpers";
import Paginate from "react-reactstrap-pagination";
import { CardProduct, History, Pagination, UserFooter } from "../components";
import { Header } from "../components";
import { RESET_INITIAL_STATE } from "../redux/types";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const sortBy = [
	{ value: 1, label: "Default sorting" },
	{ value: 2, label: "Sort by oldest" },
	{ value: 3, label: "Sort by low price" },
	{ value: 4, label: "Sort by high price" },
];
const limit = 8;

const ProductPage = (props) => {
	const history = useHistory();
	const styles = useStyles();
	const dispatch = useDispatch();
	const { products, totalProducts } = useSelector((state) => state.productReducer);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);
	const [category, setCategory] = useState(0);
	const [categories, setCategories] = useState([]);
	const [sort, setSort] = useState(1);
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(0);
	const [filter, setFilter] = useState(false);

	const { wantToChangePass, id } = useSelector((state) => state.authReducer);

	if (wantToChangePass) {
		dispatch({
			type: RESET_INITIAL_STATE,
		});
	}

	useEffect(async () => {
		const pageQuery = parseInt(new URLSearchParams(props.location.search).get("page"));
		const sortQuery = parseInt(new URLSearchParams(props.location.search).get("sort"));
		const categoryQuery = parseInt(new URLSearchParams(props.location.search).get("cat"));
		const keywordQuery = new URLSearchParams(props.location.search).get("keyword");
		const minQuery = parseInt(new URLSearchParams(props.location.search).get("min"));
		const maxQuery = parseInt(new URLSearchParams(props.location.search).get("max"));
		const payload = {
			limit,
			page: pageQuery,
			category: categoryQuery,
			sort: sortQuery,
			keyword: keywordQuery,
			min: minQuery,
			max: maxQuery,
		};
		console.log(payload);
		dispatch(getProductsAction(payload));
		const response = await axios.get(`${apiUrl_product}/categories`);
		setCategories([{ value: 0, label: "All" }, ...response.data]);
		if (pageQuery) {
			setPage(pageQuery);
		} else {
			setPage(1);
		}
	}, []);

	useEffect(() => {
		console.log("eaeae");
		const pageQuery = parseInt(new URLSearchParams(props.location.search).get("page"));
		// const sortQuery = parseInt(new URLSearchParams(props.location.search).get("sort"));
		// const categoryQuery = parseInt(new URLSearchParams(props.location.search).get("cat"));
		// setPage(pageQuery);
		const payload = {
			limit,
			page: pageQuery,
			category,
			sort,
			keyword,
			min,
			max,
		};
		console.log(page);
		console.log(payload);

		dispatch(getProductsAction(payload));
	}, [page, sort, category, filter]);

	// console.log(sort, category);

	const handlerFilterBtn = () => {
		const keywordQuery = parseInt(new URLSearchParams(props.location.search).get("keyword"));
		const maxQuery = parseInt(new URLSearchParams(props.location.search).get("max"));
		const minQuery = parseInt(new URLSearchParams(props.location.search).get("min"));
		if (keyword) {
			let str = History.location.search
				.replace(`keyword=${keywordQuery}`, `keyword=${keyword}`)
				.replace(`min=${minQuery}`, `min=${min}`)
				.replace(`max=${maxQuery}`, `max=${max}`);
			History.push({
				pathname: "/products",
				search: str,
			});
		} else {
			let search = `?page=${page}`;
			if (keyword !== "") search += `&keyword=${keyword}`;
			if (min !== 0) search += `&min=${min}`;
			if (max !== 0) search += `&max=${max}`;
			search += `&cat=${category}&sort=${sort}`;
			History.push({
				pathname: "/products",
				search,
			});
		}
		setFilter((prev) => !prev);
	};

	const handleOnChangePage = (pageNum) => {
		const pageQuery = parseInt(new URLSearchParams(props.location.search).get("page"));
		if (pageQuery) {
			let str = History.location.search.replace(`page=${page}`, `page=${pageNum}`);
			History.push({
				pathname: "/products",
				search: str,
			});
		} else {
			let search = `?page=${pageNum}`;
			if (keyword !== "") search += `&keyword=${keyword}`;
			if (min !== 0) search += `&min=${min}`;
			if (max !== 0) search += `&max=${max}`;
			search += `&cat=${category}&sort=${sort}`;
			History.push({
				pathname: "/products",
				search,
			});
		}
		setPage(parseInt(pageNum));
	};

	const handleCategory = (cat) => {
		const categoryQuery = parseInt(new URLSearchParams(props.location.search).get("cat"));
		if (categoryQuery) {
			let str = History.location.search.replace(`cat=${category}`, `cat=${cat}`);
			History.push({
				pathname: "/products",
				search: str,
			});
		} else {
			let search = `?page=${page}`;
			if (keyword !== "") search += `&keyword=${keyword}`;
			if (min !== 0) search += `&min=${min}`;
			if (max !== 0) search += `&max=${max}`;
			search += `&cat=${cat}&sort=${sort}`;
			History.push({
				pathname: "/products",
				search,
			});
		}
		setCategory(cat);
	};

	const handleSort = (e) => {
		const sortQuery = parseInt(new URLSearchParams(props.location.search).get("sort"));
		if (sortQuery) {
			let str = History.location.search.replace(`sort=${sort}`, `sort=${e.value}`);
			History.push({
				pathname: "/products",
				search: str,
			});
		} else {
			let search = `?page=${page}`;
			if (keyword !== "") search += `&keyword=${keyword}`;
			if (min !== 0) search += `&min=${min}`;
			if (max !== 0) search += `&max=${max}`;
			search += `&cat=${category}&sort=${e.value}`;
			History.push({
				pathname: "/products",
				search,
			});
		}
		setSort(e.value);
	};

	const renderCard = () => {
		return products.map((value) => {
			return (
				<div
					key={value.id}
					style={{
						width: "24%",
						maxHeight: "24%",
						marginInline: 2,
						marginBottom: 4,
					}}
				>
					<CardProduct
						userId={id}
						id={value.id}
						name={value.name}
						price={value.price}
						stock={value.stock}
						image={value.image[0].imagepath}
					/>
				</div>
			);
		});
	};

	const renderCategory = () => {
		return categories.map((value) => {
			return (
				<div key={value.value} onClick={() => handleCategory(value.value)}>
					<div
						style={{
							lineHeight: 2.5,
							borderBottom: "1px solid rgba(0,0,0,0.1)",
							cursor: "pointer",
						}}
					>
						<div style={{ textTransform: "uppercase" }}>{value.label}</div>
					</div>
				</div>
			);
		});
	};

	const renderShow = () => {
		let floor = page * limit - limit + 1;
		let ceil;
		let total;
		if (category !== 0 || keyword !== "" || min !== 0 || max !== 0) {
			console.log("ea");
			total = products.length;
			if (products.length <= limit) {
				ceil = products.length;
			} else if (page * limit < products.length) {
				ceil = page * limit;
			} else {
				ceil = limit + products.length;
			}
			if (products.length === 0) floor = 0;
		} else {
			total = totalProducts;
			if (totalProducts <= limit) {
				ceil = totalProducts;
			} else if (page * limit < totalProducts) {
				ceil = page * limit;
			} else {
				ceil = limit + products.length;
			}
		}
		let show = `Showing ${floor} - ${ceil} of ${total}`;

		{
			/* Showing {page * limit - limit + 1} -{" "}
							{totalProducts > limit ? products.length < : category === 0 ? totalProducts : products.length} of{" "}
							{products.length} results */
		}
		return show;
	};

	return (
		<>
			<Header />
			<div style={{ paddingBlock: 50, paddingInline: 200 }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: 30,
					}}
				>
					<div>Home / Shop</div>
					<div
						style={{
							width: "50%",
							display: "flex",
							justifyContent: "flex-end",
							alignItems: "center",
						}}
					>
						<div className="mr-4">{renderShow()}</div>
						<div style={{ width: "50%" }}>
							<Select
								isSearchable={false}
								options={sortBy}
								defaultValue={{ value: 1, label: "Default sort" }}
								onChange={(e) => handleSort(e)}
							/>
						</div>
					</div>
				</div>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<div
						style={{
							width: "25%",
							minHeight: "500px",
						}}
					>
						<div style={{ marginBottom: 30 }}>
							<InputGroup>
								<Input
									placeholder="search"
									style={{ paddingInline: 20 }}
									onChange={(e) => setKeyword(e.target.value)}
								/>
								<InputGroupAddon addonType="append">
									<InputGroupText
										onClick={handlerFilterBtn}
										style={{
											backgroundColor: accentColor,
											borderWidth: 0,
											cursor: "pointer",
										}}
									>
										<i className="bi bi-search"></i>
									</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</div>
						<div style={{ marginBottom: 30 }}>
							<div style={{ marginBottom: 10 }}>
								<div
									style={{
										textTransform: "uppercase",
										fontSize: 18,
										fontWeight: "bold",
									}}
								>
									filter by price
								</div>
							</div>
							<div className="d-flex justify-content-end" style={{ marginBottom: 20 }}>
								<div
									style={{
										backgroundColor: "rgba(0,0,0,0.3)",
										width: "75%",
										height: 3,
									}}
								></div>
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									marginBottom: 10,
								}}
							>
								<div>
									<Input placeholder="min" type="number" onChange={(e) => setMin(e.target.value)} />
								</div>
								<div style={{ marginInline: 10 }}>
									<div>to</div>
								</div>
								<div>
									<Input placeholder="max" type="number" onChange={(e) => setMax(e.target.value)} />
								</div>
							</div>
							<div>
								<Button
									onClick={handlerFilterBtn}
									style={{
										width: "100%",
										backgroundColor: accentColor,
										borderWidth: 0,
									}}
								>
									filter
								</Button>
							</div>
						</div>
						<div>
							<div style={{ marginBottom: 10 }}>
								<div
									style={{
										textTransform: "uppercase",
										fontSize: 18,
										fontWeight: "bold",
									}}
								>
									categories
								</div>
							</div>
							<div className="d-flex justify-content-end" style={{ marginBottom: 20 }}>
								<div
									style={{
										backgroundColor: "rgba(0,0,0,0.3)",
										width: "75%",
										height: 3,
									}}
								></div>
							</div>
							<div style={{ marginBottom: 30 }}>{renderCategory()}</div>
						</div>
					</div>
					<div
						style={{
							width: "72%",
						}}
					>
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								justifyContent: "flex-end",
								marginBottom: 50,
								minHeight: 580,
							}}
						>
							{renderCard()}
						</div>
						<Pagination
							limit={limit}
							total={category === 0 ? totalProducts : products.length}
							neighbours={1}
							curPage={page}
							firstEvent={handleOnChangePage}
						/>
					</div>
				</div>
			</div>
			<UserFooter />
		</>
	);
};

const useStyles = makeStyles({
	link: {
		color: "black",
		"&:hover": {
			textDecoration: "none",
		},
	},
});

export default ProductPage;
