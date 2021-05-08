import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import {
	LoginPage,
	NotFoundPage,
	AdminDashboard,
	AdminProductPage,
	ProfileAdminPage,
	AdminTransactionPage,
	NewProductPage,
} from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { keepLoginAction } from "./redux/actions";
import { AdminSidebar, Header, LoaderPage } from "./components";

const App = () => {
	const dispatch = useDispatch();
	const { isLogin, isLoading } = useSelector((state) => state.authReducer);

	useEffect(() => {
		dispatch(keepLoginAction());
	}, []);

	if (!isLogin) {
		if (isLoading) {
			return (
				<>
					<Route component={LoaderPage} />
				</>
			);
		}
		return (
			<>
				<Route component={LoginPage} />
			</>
		);
	}

	return (
		<>
			<div style={{ display: isLogin ? "block" : "none" }}>
				<Route component={Header} />
			</div>
			<div className="d-flex justify-content-between" style={{ minHeight: "100vh" }}>
				<div>
					<Route component={AdminSidebar} />
				</div>
				<div style={{ width: "100%" }}>
					<Switch>
						<Route path="/admin/dashboard" component={AdminDashboard} />
						<Route path="/admin/products" component={AdminProductPage} />
						<Route path="/admin/add-product" component={NewProductPage} />
						<Route path="/admin/transactions" component={AdminTransactionPage} />
						<Route path="/admin/profile" component={ProfileAdminPage} />
					</Switch>
				</div>
			</div>
		</>
	);
};

export default App;
