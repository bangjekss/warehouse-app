import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { accentColor, apiUrl, focusColor } from "../helpers";
import { ButtonAccent, ButtonColor, InputForm, Pagination } from ".";
import { Input } from "reactstrap";

const useStyles = makeStyles({
	iconWrapper: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: 35,
		height: 35,
		borderRadius: 50,
		"&:hover": {
			backgroundColor: "rgba(0,0,0,0.2)",
		},
	},
});

function AdminTable({
	pagination,
	columnData,
	rowData,
	editIndex,
	firstEvent,
	secondEvent,
	thirdEvent,
	firstIcon,
	secondIcon,
	productId,
	firstToggle,
}) {
	// const styles = useStyles();
	// const [page, setPage] = useState(0);
	// const [limit, setLimit] = useState(10);

	// const handleChangePage = (event, newPage) => {
	// 	setPage(newPage);
	// };

	// const handleChangeLimit = (event) => {
	// 	setLimit(event.target.value);
	// 	setPage(0);
	// };

	const [outStock, setOutStock] = useState(false);

	if (firstToggle) {
		return (
			<div>
				<TableContainer>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell align="center">#</TableCell>
								{columnData.map((value) => (
									<TableCell key={value.columnId} align={value.align} style={{ minWidth: value.minWidth }}>
										<div style={{ fontWeight: 600 }}>{value.label}</div>
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rowData.map((row) => {
								return (
									<TableRow>
										<TableCell align="center">
											<input
												type="checkbox"
												onClick={(e) => firstEvent(e, row.id)}
												id={row.id}
												style={{ cursor: "pointer" }}
											/>
										</TableCell>
										<TableCell>
											<img
												src={`${apiUrl}${row.image[0].imagepath}`}
												style={{ width: 75, height: 75, objectFit: "contain" }}
											/>
										</TableCell>
										<TableCell>
											<div>{row.name}</div>
										</TableCell>
										<TableCell>
											<div>{row.category.category}</div>
										</TableCell>
										<TableCell>
											<div>{row.description}</div>
										</TableCell>
										<TableCell align="right">
											<div>{row.weight.toLocaleString()}</div>
										</TableCell>
										<TableCell align="right">
											<div>{row.price.toLocaleString()}</div>
										</TableCell>
										<TableCell align="right">
											<div>{row.inventory[0].stock}</div>
										</TableCell>
										<TableCell align="right">
											<div>{row.inventory[1].stock}</div>
										</TableCell>
										<TableCell align="right">
											<div>{row.inventory[2].stock}</div>
										</TableCell>
										<TableCell>
											<ButtonAccent text="Edit" px={10} py={5} fontSize={12} />
											{/* {row.inventory.forEach((value) => {
												if (value.stock === 0) setOutStock(true);
											})} */}
											{/* {outStock ? <i class="bi bi-exclamation-triangle"></i> : null} */}
											{/* <div className="d-flex justify-content-center"> */}
											{/* <ButtonColor color="danger" icon="bi bi-trash" px={10} py={5} fontSize={12} /> */}
											{/* </div> */}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		);
	}

	return (
		<div>
			<TableContainer>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{columnData.map((value) => (
								<TableCell key={value.columnId} align={value.align} style={{ minWidth: value.minWidth }}>
									<div style={{ fontWeight: 600 }}>{value.label}</div>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rowData.map((row) => {
							console.log(row);
							const nullStock = [];
							row.inventory.forEach((value) => {
								if (value.stock === 0) nullStock.push(value);
							});
							return (
								<TableRow style={{ opacity: nullStock.length === row.inventory.length ? 0.5 : 1 }}>
									<TableCell>
										<img
											src={`${apiUrl}${row.image[0].imagepath}`}
											style={{ width: 75, height: 75, objectFit: "contain" }}
										/>
									</TableCell>
									<TableCell>
										<div>{row.name}</div>
									</TableCell>
									<TableCell>
										<div>{row.category.category}</div>
									</TableCell>
									<TableCell>
										<div>{row.description}</div>
									</TableCell>
									<TableCell align="right">
										<div>{row.weight.toLocaleString()}</div>
									</TableCell>
									<TableCell align="right">
										<div>{row.price.toLocaleString()}</div>
									</TableCell>
									<TableCell align="right">
										<div>{row.inventory[0].stock}</div>
									</TableCell>
									<TableCell align="right">
										<div>{row.inventory[1].stock}</div>
									</TableCell>
									<TableCell align="right">
										<div>{row.inventory[2].stock}</div>
									</TableCell>
									<TableCell>
										<ButtonAccent text="Edit" px={10} py={5} fontSize={12} />
										{/* {row.inventory.forEach((value) => {
											if (value.stock === 0) setOutStock(true);
										})} */}
										{/* {outStock ? <i class="bi bi-exclamation-triangle"></i> : null} */}
										{/* <div className="d-flex justify-content-center"> */}
										{/* <ButtonColor color="danger" icon="bi bi-trash" px={10} py={5} fontSize={12} /> */}
										{/* </div> */}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default AdminTable;
