import {
	API_LOADING_START,
	NULLIFY_ERROR,
	API_LOADING_SUCCESS,
	API_LOADING_ERROR,
	GET_DASHBOARD,
	MONITORING,
	FILL_TRANSACTION_DATA,
	GET_ADMIN_PRODUCTS,
	GET_WAREHOUSE,
	GET_PRODUCTS,
	GET_CATEGORIES,
} from "../types";
import axios from "axios";
import { apiUrl_admin, apiUrl_transaction } from "../../helpers";
import Swal from "sweetalert2";

const addNewCategoryAction = (newCategory) => {
	return async (dispatch) => {
		try {
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			await axios.post(`${apiUrl_admin}/add-new-category`, { newCategory });
			dispatch({ type: API_LOADING_SUCCESS });
			dispatch(getCategories());
			Swal.fire({
				icon: "success",
				title: `Successfully add '${newCategory}' as category`,
			});
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};

const getCategories = () => {
	return async (dispatch) => {
		try {
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			const response = await axios.get(`${apiUrl_admin}/categories`);
			dispatch({ type: API_LOADING_SUCCESS });
			dispatch({ type: GET_CATEGORIES, payload: response.data });
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};

const getWarehouses = () => {
	return async (dispatch) => {
		try {
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			const response = await axios.get(`${apiUrl_admin}/warehouses`);
			dispatch({ type: API_LOADING_SUCCESS });
			dispatch({ type: GET_WAREHOUSE, payload: response.data });
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};

const deleteMultipleProduct = (payload) => {
	return async (dispatch) => {
		try {
			console.log(payload);
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			await axios.patch(`${apiUrl_admin}/products`, payload);
			await dispatch(getProductsAdmin(payload.limit, payload.pageQuery));
			Swal.fire({
				icon: "success",
				title: "Successfully delete product",
			});
			dispatch({ type: API_LOADING_SUCCESS });
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};

const addNewProduct = (payload) => {
	return async (dispatch) => {
		try {
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			const { files } = payload;
			let form = new FormData();
			const headers = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};
			files.forEach((file, index) => {
				form.append("image", files[index]);
			});
			form.append("data", JSON.stringify(payload));
			console.log(payload.files);
			await axios.post(`${apiUrl_admin}/products`, form, headers);
			console.log("eaea21");
			dispatch(getProductsAdmin());
			Swal.fire({
				icon: "success",
				title: "Successfully add product",
			});
			dispatch({ type: API_LOADING_SUCCESS });
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};

const getProductsAdmin = (limit = 4, currentPage = 1) => {
	return async (dispatch) => {
		try {
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			const payload = {
				limit,
				currentPage,
			};
			const response = await axios.put(`${apiUrl_admin}/products`, payload);
			dispatch({ type: GET_PRODUCTS, payload: response.data });
			dispatch({ type: API_LOADING_SUCCESS });
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};

const getDashboard = () => {
	return async (dispatch) => {
		try {
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			const response = await axios.get(`${apiUrl_admin}/dashboard`);
			dispatch({ type: GET_DASHBOARD, payload: response.data });
			dispatch({ type: API_LOADING_SUCCESS });
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};

const monitoringAction = () => {
	return async (dispatch) => {
		try {
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			const response = await axios.get(`${apiUrl_admin}/monitoring`);
			dispatch({ type: MONITORING, payload: response.data });
			dispatch({ type: API_LOADING_SUCCESS });
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};

const getAllTransaction = (payload) => {
	const { clickLoad } = payload;
	return async (dispatch) => {
		try {
			// console.log(clickLoad);

			dispatch({
				type: NULLIFY_ERROR,
			});

			dispatch({
				type: API_LOADING_START,
			});

			const response = await axios.get(`${apiUrl_transaction}/get-all-transaction/${clickLoad}`);

			dispatch({
				type: FILL_TRANSACTION_DATA,
				payload: response.data,
			});

			dispatch({
				type: API_LOADING_SUCCESS,
			});
		} catch (err) {
			dispatch({
				type: API_LOADING_ERROR,
				payload: err.response,
			});
		}
	};
};

const approveBukti = (payload) => {
	const { transactionId, clickLoad } = payload;
	return async (dispatch) => {
		try {
			dispatch({
				type: NULLIFY_ERROR,
			});

			dispatch({
				type: API_LOADING_START,
			});

			await axios.patch(`${apiUrl_admin}/approve-bukti/${transactionId}`);

			console.log(clickLoad);

			dispatch(getAllTransaction({ clickLoad }));
		} catch (err) {
			dispatch({
				type: API_LOADING_ERROR,
				payload: err.response,
			});
		}
	};
};

const rejectBukti = (payload) => {
	const { transactionId, clickLoad } = payload;
	return async (dispatch) => {
		try {
			dispatch({
				type: NULLIFY_ERROR,
			});

			dispatch({
				type: API_LOADING_START,
			});

			await axios.patch(`${apiUrl_admin}/reject-bukti/${transactionId}`);

			dispatch(getAllTransaction({ clickLoad }));
		} catch (err) {
			dispatch({
				type: API_LOADING_ERROR,
				payload: err.response,
			});
		}
	};
};

const kirimBarang = (payload) => {
	const { transactionId, stockData, clickLoad } = payload;
	return async (dispatch) => {
		try {
			dispatch({
				type: NULLIFY_ERROR,
			});

			dispatch({
				type: API_LOADING_START,
			});

			await axios.patch(`${apiUrl_admin}/kirim-barang/${transactionId}`, stockData);

			dispatch(getAllTransaction({ clickLoad }));
		} catch (err) {
			dispatch({
				type: API_LOADING_ERROR,
				payload: err.response,
			});
		}
	};
};

export {
	deleteMultipleProduct,
	getProductsAdmin,
	getDashboard,
	monitoringAction,
	getAllTransaction,
	approveBukti,
	rejectBukti,
	kirimBarang,
	addNewProduct,
	addNewCategoryAction,
	getCategories,
	getWarehouses,
};
