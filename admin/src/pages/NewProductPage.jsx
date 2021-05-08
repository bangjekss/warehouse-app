import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import Swal from "sweetalert2";
import { product_default } from "../assets";
import {
	ButtonColor,
	ButtonPrimary,
	ButtonSurface,
	CustomModal,
	InputForm,
	InputSelect,
	LoaderPage,
} from "../components";
import { apiUrl_admin, secondSurfaceColor, surfaceColor } from "../helpers";
import { addNewProduct, addNewCategoryAction, getCategories, getWarehouses } from "../redux/actions";

// const useComponentWillMount = (func) => {
// 	const willMount = useRef(true);
// 	if (willMount.current) {
// 		func();
// 	}
// 	useComponentDidMount(() => {
// 		willMount.current = false;
// 	});
// };

const NewProductPage = () => {
	const dispatch = useDispatch();
	const styles = useStyles();
	const { productCategories, warehouses } = useSelector((state) => state.adminReducer);

	const [files, setFiles] = useState([]);
	const [images, setImages] = useState([]);
	// const [categories, setCategories] = useState([]);
	// const [warehouse, setWarehouse] = useState([]);
	const [category, setCategory] = useState(null);
	const [name, setName] = useState(null);
	const [description, setDescription] = useState(null);
	const [weight, setWeight] = useState(null);
	const [price, setPrice] = useState(null);
	const [stock, setStock] = useState([]);
	const [isFinished, setIsFinished] = useState(null);
	const [isAddCategory, setIsAddCategory] = useState(false);
	const [openAddCategory, setOpenAddCategory] = useState(false);
	const [newCategory, setNewCategory] = useState("");

	useEffect(async () => {
		dispatch(getWarehouses());
		dispatch(getCategories());
	}, []);

	// console.log(warehouses);
	// useComponentWillMount(() => {
	// });

	// useEffect(async () => {
	// 	const response = await axios.get(`${apiUrl_admin}/product-categories-and-warehouse`);
	// 	setCategories(response.data.categories);
	// 	setWarehouse(response.data.warehouse);
	// 	setIsFinished(false);
	// }, [isAddCategory]);

	useEffect(() => {
		const maxItems = 5;
		if (images.length > maxItems || files.length > 5) {
			setImages((images) => images.filter((img, index) => index < maxItems));
			setFiles((files) => files.filter((file, index) => index < maxItems));
			return Swal.fire({
				title: "Max upload 5 items",
			});
		}
	}, [images]);

	const handleImages = (e) => {
		if (e.target.files) {
			const maxItems = 5;
			const arr = Array.from(e.target.files).map((value) => URL.createObjectURL(value));
			setImages((images) => images.concat(arr));
			if (images.length + 1 > maxItems) {
				setImages((images) => images.filter((img, index) => index < maxItems));
				setFiles((files) => files.filter((file, index) => index < maxItems));
				return Swal.fire({
					title: "Max upload 5 items",
				});
			} else {
				setFiles((files) => files.concat(...e.target.files));
			}
			Array.from(e.target.files).map(
				(value) => URL.revokeObjectURL(value) // avoid memory leak
			);
		}
	};

	const handleClearAllImages = () => {
		setImages([]);
		setFiles([]);
	};

	const handleStock = (e, index, warehouseId, id) => {
		let el = document.getElementById(id).value;
		const payload = {
			stock: parseInt(el),
			warehouseId,
		};
		let isExists = false;
		stock.forEach((value) => {
			if (value.warehouseId === warehouseId) {
				isExists = true;
			}
		});
		if (isExists) {
			const idx = stock.findIndex((value) => value.warehouseId === warehouseId);
			const existStock = stock;
			existStock[idx] = { ...existStock[idx], stock: parseInt(el) };
			return setStock(existStock);
		}
		setStock((stock) => [...stock, payload]);
	};

	const handleUploadBtn = () => {
		if (stock.length === 0 || !category || !name || !description || !weight || files.length === 0) {
			return Swal.fire({
				icon: "error",
				title: "Ooppss..!!",
				text: "Make sure the fields which you filled correctly",
			});
		}
		const payload = {
			categoryId: category.value,
			name,
			description,
			weight,
			price,
			files,
			stock,
		};
		dispatch(addNewProduct(payload));
		setIsFinished(true);
	};

	const renderImages = () => {
		const dummy = [0, 1, 2, 3, 4];
		if (images.length !== 0) {
			return dummy.map((value, index) => {
				const opacity = images[index] ? null : 0.1;
				const width = images[index] ? "100%" : 75;
				const objectFit = images[index] ? "cover" : "contain";
				return (
					<div
						key={value}
						style={{
							marginInline: 1,
							borderRadius: 5,
							// padding: 5,
							border: images[index] ? null : "1px solid rgba(0,0,0,0.15)",
							width: "100%",
							height: 190,
							display: "grid",
							placeItems: "center",
						}}
					>
						<img
							src={images[index] ? images[index] : product_default}
							style={{ opacity: opacity, width: width, height: 190, objectFit: objectFit, borderRadius: 5 }}
						/>
					</div>
				);
			});
		}
		return dummy.map((value, index) => {
			return (
				<div
					key={index}
					style={{
						marginInline: 1,
						borderRadius: 5,
						padding: 5,
						border: "1px solid rgba(0,0,0,0.15)",
						width: "100%",
						height: 190,
						display: "grid",
						placeItems: "center",
					}}
				>
					<img
						src={product_default}
						style={{
							width: 75,
							opacity: 0.15,
							objectFit: "cover",
						}}
					/>
				</div>
			);
		});
	};

	const renderButtonImage = () => {
		if (images.length > 0) {
			return (
				<div className="mt-4 d-flex justify-content-between">
					<div style={{ width: "91.5%" }}>
						<input type="file" multiple id="file" style={{ display: "none" }} onChange={(e) => handleImages(e)} />
						<label className={styles.fileInput} htmlFor="file">
							<div>+ select images</div>
							{/* <i className="bi bi-eye"></i> */}
						</label>
					</div>
					<div style={{ width: "8%" }}>
						<ButtonColor color="danger" onClick={handleClearAllImages} icon="bi bi-trash" />
					</div>
				</div>
			);
		}
		return (
			<div className="mt-4">
				<div>
					<input type="file" multiple id="file" style={{ display: "none" }} onChange={(e) => handleImages(e)} />
					<label htmlFor="file" className={styles.fileInput}>
						<div>+ select images</div>
					</label>
				</div>
			</div>
		);
	};

	const renderInventory = () => {
		return warehouses.map((value, index) => {
			return (
				<div key={value.id} className="d-flex justify-content-between mb-1 align-items-center">
					<InputForm
						type="number"
						min={1}
						placeholder="stock"
						width="90%"
						onChange={(e) => handleStock(e, index, value.id, value.warehouse)}
						id={value.warehouse}
					/>
					<div>{value.warehouse}</div>
				</div>
			);
		});
	};

	const handleAddNewCategory = () => {
		dispatch(addNewCategoryAction(newCategory));
		setIsAddCategory((prev) => !prev);
	};

	console.log(productCategories);
	console.log(warehouses);

	// if (productCategories.length === 0) return <LoaderPage />;
	if (isFinished) return <Redirect to="/admin/products?page=1" />;
	return (
		<div className={styles.container}>
			<div>
				<CustomModal
					isOpen={openAddCategory}
					toggleEvent={() => setOpenAddCategory((prev) => !prev)}
					title="Add New Category"
					firstEvent={(e) => setNewCategory(e.target.value)}
					secondEvent={handleAddNewCategory}
				/>
			</div>
			<div>
				<div className="d-flex justify-content-between">{renderImages(images)}</div>
			</div>
			<div className="mb-5">
				<div>{renderButtonImage()}</div>
			</div>
			<div>
				<div>
					<div className="d-flex justify-content-between mb-2 align-items-center">
						<div>Category</div>
						<ButtonPrimary
							text="+ add category"
							fontSize={12}
							px={5}
							py={2}
							fontColor={"gray"}
							onClick={() => setOpenAddCategory((prev) => !prev)}
						/>
					</div>
					<InputSelect options={productCategories} placeholder="select category" onChange={(e) => setCategory(e)} />
				</div>
				<div>
					<InputForm label="Name" mt={30} placeholder="product name" onChange={(e) => setName(e.target.value)} />
				</div>
				<div>
					<InputForm
						label="Description"
						mt={30}
						placeholder="description"
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<div>
					<InputForm
						label="Weight"
						mt={30}
						placeholder="weight (gram)"
						type="number"
						min={1}
						onChange={(e) => setWeight(e.target.value)}
					/>
				</div>
				<div>
					<InputForm
						label="Price"
						mt={30}
						placeholder="price"
						type="number"
						min={1}
						onChange={(e) => setPrice(e.target.value)}
					/>
				</div>
				<div className="mt-4">
					<div className="mb-2">Inventory</div>
					<div>
						<div>{renderInventory()}</div>
					</div>
				</div>
				<ButtonSurface mt={50} text="upload product" onClick={handleUploadBtn} />
			</div>
		</div>
	);
};

const useStyles = makeStyles({
	container: {
		paddingInline: 150,
		paddingBlock: 75,
	},
	fileInput: {
		borderRadius: 5,
		height: 42.5,
		width: "100%",
		backgroundColor: surfaceColor,
		color: "white",
		display: "grid",
		placeItems: "center",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: secondSurfaceColor,
		},
	},
});

export default NewProductPage;
