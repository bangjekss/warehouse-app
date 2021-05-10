import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import reducer from "./redux/reducers";
import { History } from "./components";

const store = configureStore({
	devTools: true,
	reducer,
});

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter history={History}>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
