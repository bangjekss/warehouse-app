import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Input, Label } from "reactstrap";
import { focusColor, primaryColor } from "../helpers";

function InputForm({
	px,
	py,
	pl,
	pr,
	pt,
	pb,
	label,
	placeholder,
	onChange,
	type,
	isPassword,
	isInputGroup,
	mx,
	my,
	ml,
	mr,
	mt,
	mb,
	id,
	autoComplete,
	width,
	value,
	color,
	size,
	min,
}) {
	const styles = useStyles();
	return (
		<div
			style={{
				width: width || "100%",
				marginInline: mx || 0,
				marginBlock: my || 0,
				marginLeft: 0 || ml,
				marginRight: mr || 0,
				marginTop: mt || 0,
				marginBottom: mb || 0,
			}}
		>
			{label ? <Label>{label}</Label> : null}
			<Input
				defaultValue={value || ""}
				id={id ? id : null}
				autoComplete={autoComplete || "null"}
				className={styles.inputForm}
				type={type || "text"}
				min={min || null}
				placeholder={placeholder}
				onChange={onChange}
				style={{
					paddingInline: px || null,
					paddingBlock: py || null,
					paddingLeft: pl || null,
					paddingRight: pr || null,
					paddingTop: pt || null,
					paddingBottom: pb || null,
					backgroundColor: color || null,
					fontSize: size || null,
				}}
			/>
		</div>
	);
}

const useStyles = makeStyles({
	inputForm: {
		borderRadius: 10,
		paddingInline: 20,
		paddingBlock: 25,
		// borderWidth: 1,
		border: "1px solid rgba(0,0,0,0.1)",
		backgroundColor: primaryColor,
		boxShadow: "0 0 5px 1px rgba(0, 0, 0, 0.1)",
		// "&:focus": {
		// 	backgroundColor: focusColor,
		// },
	},
});

export default InputForm;
