import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
	Button,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	UncontrolledDropdown,
} from "reactstrap";
import { makeStyles } from "@material-ui/styles";
import { Badge } from "@material-ui/core";
import { accentColor, primaryColor, surfaceColor } from "../helpers";
import { Fade } from "react-reveal";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/actions";
import Swal from "sweetalert2";

const Header = () => {
	const dispatch = useDispatch();
	const styles = useStyles();
	const { isLogin, username } = useSelector((state) => state.authReducer);
	const { cart } = useSelector((state) => state.cartReducer);

	const [showSearchInput, setShowSearchInput] = useState(false);

	const handleLogoutBtn = () => {
		Swal.fire({
			title: "Logout",
			text: "You will be returned to home page",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sure",
		}).then((result) => {
			if (result.isConfirmed) {
				dispatch(logoutAction());
				return <Redirect to="/" />;
			}
		});
	};

	if (isLogin) {
		return (
			<div className={styles.container}>
				<div className="mr-4" style={{ cursor: "pointer" }}>
					<Link to="/">
						<img src="https://i.imgur.com/eKvfJEW.png" height="50" width="50" />
					</Link>
				</div>
				<div className={styles.navContainer}>
					<div className={styles.navLeftContainer}>
						<Link to="/products" className={styles.navItemContainer}>
							<div className={styles.textLink}>shop</div>
						</Link>
					</div>
					<div className="d-flex align-items-center">
						<div
							style={{
								borderRight: "1px solid rgba(0,0,0,0.1)",
								paddingInline: 10,
							}}
						>
							<InputGroup>
								<Fade left when={showSearchInput}>
									<Input placeholder="search" style={{ borderRadius: 50, paddingInline: 20 }} />
								</Fade>
								<InputGroupAddon addonType="prepend">
									<InputGroupText
										onClick={() => setShowSearchInput(!showSearchInput)}
										style={{
											backgroundColor: "rgba(0, 0, 0, 0)",
											borderWidth: 0,
											cursor: "pointer",
										}}
									>
										<i className="bi bi-search"></i>
									</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</div>
						<div
							className="d-flex align-items-center"
							style={{
								borderRight: "1px solid rgba(0,0,0,0.1)",
								paddingInline: 10,
							}}
						>
							<Link to="/cart">
								<div className={styles.cartBtn}>
									<Badge badgeContent={cart.length === 0 ? null : cart.length} color="error" max={9} overlap="circle">
										<i className="bi bi-cart3" style={{ fontSize: 22, color: "black" }}></i>
									</Badge>
								</div>
							</Link>
						</div>
						<div
							className="d-flex align-items-center"
							style={{
								borderRight: "1px solid rgba(0,0,0,0.1)",
								paddingLeft: 20,
								paddingRight: 5,
							}}
						>
							<div>{username}</div>
							<UncontrolledDropdown inNavbar>
								<DropdownToggle nav>
									<img src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg" height="45" />
								</DropdownToggle>
								<DropdownMenu right>
									<Link to="/profile" className={styles.link}>
										<DropdownItem>Profile</DropdownItem>
									</Link>
									<DropdownItem divider />
									<DropdownItem onClick={handleLogoutBtn}>Logout</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className="mr-4">
				<Link to="/">
					<img src="https://i.imgur.com/eKvfJEW.png" height="50" width="50" />
				</Link>
			</div>
			<div className={styles.navContainer}>
				<div className={styles.navLeftContainer}>
					<Link to="/" className={styles.navItemContainer}>
						<div className={styles.textLink}>home</div>
					</Link>
					<Link to="/products" className={styles.navItemContainer}>
						<div className={styles.textLink}>products</div>
					</Link>
				</div>
				<div className="d-flex">
					<div
						style={{
							borderRight: "1px solid rgba(0,0,0,0.1)",
							marginRight: "20px",
							paddingInline: 10,
						}}
					>
						<InputGroup>
							<Fade left when={showSearchInput}>
								<Input placeholder="search" style={{ borderRadius: 50, paddingInline: 20 }} />
							</Fade>
							<InputGroupAddon addonType="prepend">
								<InputGroupText
									onClick={() => setShowSearchInput(!showSearchInput)}
									style={{
										backgroundColor: "rgba(0, 0, 0, 0)",
										borderWidth: 0,
										cursor: "pointer",
									}}
								>
									<i className="bi bi-search"></i>
								</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
					</div>
					<div>
						<Link to="/login">
							<Button style={{ backgroundColor: surfaceColor, borderWidth: 0 }}>sign in</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

const useStyles = makeStyles({
	container: {
		backgroundColor: primaryColor,
		height: "70px",
		maxHeight: "70px",
		paddingInline: "50px",
		boxShadow: "1px 0 12px 1px rgba(0,0,0,0.3)",
		display: "flex",
		alignItems: "center",
		zIndex: 2,
		position: "relative",
	},
	navContainer: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
	navLeftContainer: {
		display: "flex",
		height: "100%",
	},
	navItemContainer: {
		paddingInline: "10px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		"&:hover": {
			background: "rgba(0,0,0,0.1)",
			textDecoration: "none",
			borderBottom: `3px solid ${surfaceColor}`,
		},
	},
	textLink: {
		fontWeight: 600,
		textTransform: "uppercase",
		color: surfaceColor,
	},
	containerAdmin: {
		backgroundColor: primaryColor,
		maxHeight: "70px",
		height: 70,
		boxShadow: "1px 0 12px 1px rgba(0,0,0,0.3)",
		display: "flex",
		alignItems: "center",
		zIndex: 2,
		position: "relative",
	},
	leftContainerAdmin: {
		width: "30%",
		maxWidth: "300px",
		backgroundColor: primaryColor,
		height: "70px",
		maxHeight: "70px",
		paddingInline: 20,
		boxShadow: "1px 0 12px 1px rgba(0,0,0,0.1)",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	brandLink: {
		fontWeight: "bolder",
		fontSize: 22,
		textTransform: "uppercase",
		"&:hover": {
			textDecoration: "none",
		},
	},
	leftContainerContent2: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		borderRadius: 100,
		width: 40,
		height: 40,
		"&:hover": {
			backgroundColor: "rgba(97, 177, 90, 0.2)",
		},
	},
	rightContainerAdmin: {
		marginInline: 20,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
	rightContainerContent1: {
		width: "100%",
	},
	searchInputBtn: {
		backgroundColor: "rgba(97, 177, 90, 0.5)",
		borderWidth: 0,
		cursor: "pointer",
		borderRadius: 50,
		"&:hover": {
			backgroundColor: "rgba(97, 177, 90, 0.7)",
		},
	},
	link: {
		"&:hover": {
			textDecoration: "none",
		},
	},
	cartBtn: {
		cursor: "pointer",
		width: 40,
		height: 40,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		"&:hover": {
			borderRadius: 50,
			backgroundColor: "rgba(97, 177, 90,0.3)",
		},
	},
});

export default Header;
