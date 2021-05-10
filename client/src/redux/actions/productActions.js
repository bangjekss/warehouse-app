import axios from "axios";
import { apiUrl_product } from "../../helpers";
import {
	API_LOADING_ERROR,
	API_LOADING_START,
	API_LOADING_SUCCESS,
	GET_PRODUCTS,
	GET_PRODUCTS_ID,
	NULLIFY_ERROR,
	RESET_TRANSACTION,
} from "../types";

const getProductsAction = (payload) => {
	return async (dispatch) => {
		try {
			dispatch({ type: RESET_TRANSACTION });
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			// keyword, minPrice, maxPrice, sort, limit, currentPage
			let query = `limit=${payload.limit ? payload.limit : 8}&page=${payload.page ? payload.page : 1}`;
			if (payload.keyword) query += `&keyword=${payload.keyword}`;
			if (payload.min && payload.min !== 0) query += `&min=${payload.min}`;
			if (payload.max && payload.max !== 0) query += `&max=${payload.max}`;
			if (payload.sort) query += `&sort=${payload.sort}`;
			if (payload.category && payload.category !== 0) query += `&category=${payload.category}`;
			// console.log(payload);
			const response = await axios.get(`${apiUrl_product}/search?${query}`);
			// console.log(query);
			// console.log(response.data);
			dispatch({
				type: GET_PRODUCTS,
				payload: response.data,
			});
			dispatch({ type: API_LOADING_SUCCESS });
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};
const getProductById = (id) => {
	return async (dispatch) => {
		try {
			dispatch({ type: NULLIFY_ERROR });
			dispatch({ type: API_LOADING_START });
			const response = await axios.get(`${apiUrl_product}/${id}`);
			dispatch({ type: GET_PRODUCTS_ID, payload: response.data });
			dispatch({ type: API_LOADING_SUCCESS });
		} catch (err) {
			if (!err.response) return dispatch({ type: API_LOADING_ERROR });
			dispatch({ type: API_LOADING_ERROR, payload: err.response.data.message });
		}
	};
};

export { getProductsAction, getProductById };
