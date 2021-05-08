import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { accentColor } from "../helpers";

// const columns = [
// 	{ id: "name", label: "Name", minWidth: 0 },
// 	{ id: "code", label: "ISO Code", minWidth: 0 },
// 	{
// 		id: "population",
// 		label: "Population",
// 		minWidth: 0,
// 		align: "right",
// 		format: (value) => value.toLocaleString(),
// 	},
// 	{
// 		id: "size",
// 		label: "Size (km\u00b2)",
// 		minWidth: 0,
// 		align: "right",
// 		format: (value) => value.toLocaleString(),
// 	},
// 	{
// 		id: "density",
// 		label: "Density",
// 		minWidth: 0,
// 		align: "right",
// 		format: (value) => value.toFixed(2),
// 	},
// ];

// function createData(name, code, population, size) {
// 	const density = population / size;
// 	return { name, code, population, size, density };
// }

// const rows = [
// 	createData("United States", "US", 327167434, 9833520),
// 	createData("Canada", "CA", 37602103, 9984670),
// 	createData("Australia", "AU", 25475400, 7692024),
// 	createData("Germany", "DE", 83019200, 357578),
// 	createData("Ireland", "IE", 4857000, 70273),
// 	createData("Mexico", "MX", 126577691, 1972550),
// 	createData("Japan", "JP", 126317000, 377973),
// 	createData("France", "FR", 67022000, 640679),
// 	createData("United Kingdom", "GB", 67545757, 242495),
// 	createData("Russia", "RU", 146793744, 17098246),
// 	createData("Nigeria", "NG", 200962417, 923768),
// 	createData("Brazil", "BR", 210147125, 8515767),
// ];

const useStyles = makeStyles({});

function TableCustom({ columnData, rowData }) {
	const styles = useStyles();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<div>
			<TableContainer>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{columnData.map((value) => (
								<TableCell
									key={value.columnId}
									align={value.align}
									style={{ minWidth: value.minWidth }}
								>
									<div style={{ fontWeight: 600 }}>{value.label}</div>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rowData.map((row) => {
							return (
								<TableRow hover style={{ cursor: "pointer" }}>
									{columnData.map((col, index) => {
										const value = row[col.id];
										//row.name//row.code//row.population//etc
										if (value === row.image) {
											return (
												<TableCell
													key={index}
													align={col.align ? col.align : "left"}
												>
													<img
														src={value}
														style={{
															width: 75,
															height: 75,
															backgroundColor: accentColor,
														}}
													/>
												</TableCell>
											);
										}
										return (
											<TableCell
												key={index}
												align={col.align ? col.align : "left"}
											>
												{col.format && typeof value === "number"
													? col.format(value)
													: value}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			{/* <TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/> */}
		</div>
	);
}

export default TableCustom;
