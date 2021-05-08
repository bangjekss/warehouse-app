import { makeStyles } from "@material-ui/styles";
import React from "react";
import Loader from "react-loader-spinner";
import { Button } from "reactstrap";
import {
	surfaceColor,
	secondSurfaceColor,
	accentColor,
	secondAccentColor,
	secondPrimaryColor,
	primaryColor,
} from "../helpers";

function ButtonPrimary({
	px,
	py,
	pl,
	pr,
	pt,
	pb,
	mx,
	my,
	ml,
	mr,
	mt,
	mb,
	id,
	width,
	height,
	disabled,
	onClick,
	text,
	fontSize,
	isLoading,
	color,
	fontColor,
}) {
	const styles = useStyles();
	return (
		<div
			style={{
				marginInline: mx || 0,
				marginBlock: my || 0,
				marginLeft: 0 || ml,
				marginRight: mr || 0,
				marginTop: mt || 0,
				marginBottom: mb || 0,
			}}
		>
			<Button
				color={"warning"}
				className={styles.button}
				disabled={disabled ? disabled : null}
				onClick={onClick ? onClick : null}
				style={{
					height: height || "100%",
					width: width || "100%",
					paddingInline: px || 0,
					paddingBlock: py || 0,
					paddingLeft: pl || 20,
					paddingRight: pr || 20,
					paddingTop: pt || 10,
					paddingBottom: pb || 10,
				}}
			>
				{disabled && isLoading ? (
					<Loader type="ThreeDots" color="white" height="auto" width={50} />
				) : (
					<div
						className={styles.childButton}
						style={{ fontSize: fontSize ? fontSize : null, color: fontColor ? fontColor : null }}
					>
						{text}
					</div>
				)}
			</Button>
		</div>
	);
}

const useStyles = makeStyles({
	button: {
		backgroundColor: primaryColor,
		borderWidth: 0,
		paddingBlock: 10,
		borderRadius: 5,
		"&:hover": {
			backgroundColor: secondPrimaryColor,
		},
		"&:focus": {
			backgroundColor: secondPrimaryColor,
		},
	},
	childButton: {
		color: "black",
	},
});

export default ButtonPrimary;
