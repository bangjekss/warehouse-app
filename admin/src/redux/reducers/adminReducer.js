import {
	API_LOADING_ERROR,
	API_LOADING_START,
	API_LOADING_SUCCESS,
	FILL_TRANSACTION_DATA,
	GET_DASHBOARD,
	MONITORING,
	GET_ADMIN_PRODUCTS,
	NULLIFY_ERROR,
	GET_WAREHOUSE,
	GET_PRODUCTS,
	GET_CATEGORIES,
} from "../types";

const INITIAL_STATE = {
	isLoading: false,
	isError: false,
	errorMessage: false,
	dashboard: {},
	products: {},
	productCategories: [],
	changePage: false,
	monitoring: [],
	transactionData: [],
	warehouses: [],
	Warehouse1: null,
	Warehouse2: null,
	Warehouse3: null,
};

const adminReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case API_LOADING_START:
			return {
				...state,
				isLoading: true,
			};
		case API_LOADING_SUCCESS:
			return {
				...state,
				isLoading: false,
			};
		case API_LOADING_ERROR:
			return {
				...state,
				isLoading: false,
				isError: true,
				errorMessage: action.payload,
			};
		case NULLIFY_ERROR:
			return {
				...state,
				isError: false,
				errorMessage: "",
			};
		case GET_DASHBOARD:
			return {
				...state,
				dashboard: action.payload,
			};
		case GET_PRODUCTS:
			return {
				...state,
				products: action.payload,
			};
		case FILL_TRANSACTION_DATA:
			return {
				...state,
				transactionData: action.payload,
			};
		case GET_ADMIN_PRODUCTS:
			return {
				...state,
				...action.payload,
			};
		case GET_WAREHOUSE:
			return {
				...state,
				warehouses: action.payload,
			};
		case GET_CATEGORIES:
			return {
				...state,
				productCategories: action.payload,
			};
		case "CHANGE_PAGE":
			return {
				...state,
				changePage: !state.changePage,
			};
		default:
			return state;
	}
};

export { adminReducer };
