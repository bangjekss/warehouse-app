import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import {
	ProductPage,
	ChangePasswordPage,
	ForgetPasswordPage,
	RedirectPage,
	CartPage,
	DetailProductPage,
	EmailRedirectPage,
	CheckoutPage,
	ProfilePage,
	LoginPage,
	NotFoundPage,
	RegisterPage,
	HomePage,
} from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { keepLoginAction } from "./redux/actions";

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(keepLoginAction());
	}, []);

	return (
		<div>
			<Route path="/" exact component={HomePage} />
			<Route path="/register" component={RegisterPage} />
			<Route path="/login" component={LoginPage} />
			<Route path="/forget-password" component={ForgetPasswordPage} />
			<Route path="/change-password" component={ChangePasswordPage} />
			<Route path="/redirect" component={RedirectPage} />
			<Route path="/email-verification" component={EmailRedirectPage} />
			<Route path="/products" component={ProductPage} />
			<Route path="/cart" component={CartPage} />
			<Route path="/detail" component={DetailProductPage} />
			<Route path="/profile" component={ProfilePage} />
			<Route path="/checkout" component={CheckoutPage} />
		</div>
	);
};

export default App;
