import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getProductsAdmin } from "../redux/actions";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

function Pagination(props) {
	const dispatch = useDispatch();
	const { firstEvent } = props;
	const neighbours = typeof props.neighbours === "number" ? Math.max(0, Math.min(props.neighbours, 2)) : 0;
	const limit = typeof props.limit === "number" ? props.limit : 0;
	const total = typeof props.total === "number" ? props.total : 0;
	const totalPages = Math.ceil(total / limit);

	// const [currentPage, setCurrentPage] = useState(props.curPage ? props.curPage : 1);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		if (props.curPage) {
			handleGotoPage(props.curPage);
		} else {
			handleGotoPage(1);
		}
	}, []);

	const rangeNeighbours = (from, to) => {
		const range = [];
		while (from <= to) {
			range.push(from);
			from++;
		}
		return range;
	};

	const handleGotoPage = (page) => {
		setCurrentPage(page);
		if (currentPage !== page) {
			dispatch({ type: "CHANGE_PAGE" });
		}
		// dispatch(firstEvent(limit, page));
		// console.log(page);
		// return props.firstEvent();
		// props.firstEvent();
		// dispatch(getProductsAdmin(limit, page));
	};

	const handleMoveLeft = () => {
		handleGotoPage(currentPage - neighbours * 2);
	};

	const handleMoveRight = () => {
		handleGotoPage(currentPage + neighbours * 2);
	};

	const pageBlocks = () => {
		const totalNumbers = neighbours * 2 + 3;
		const totalBlocks = totalNumbers + 2;

		if (totalPages > totalBlocks) {
			const startPage = Math.max(2, currentPage - neighbours);
			const endPage = Math.min(totalPages - 1, currentPage + neighbours);
			let pages = rangeNeighbours(startPage, endPage);
			const isLeftSpill = startPage > 2;
			const isRightSpill = totalPages - endPage > 1;
			const spillOffset = totalNumbers - (pages.length + 1);

			switch (true) {
				case isLeftSpill && !isRightSpill: {
					const extraPages = rangeNeighbours(startPage - spillOffset, startPage - 1);
					pages = [LEFT_PAGE, ...extraPages, ...pages];
					// console.log(pages);
					break;
				}
				case !isLeftSpill && isRightSpill: {
					const extraPages = rangeNeighbours(endPage + 1, endPage + spillOffset);
					pages = [...pages, ...extraPages, RIGHT_PAGE];
					// console.log(pages);
					break;
				}
				default: {
					pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
					// console.log(pages);
					break;
				}
			}
			return [1, ...pages, totalPages];
		}
		return rangeNeighbours(1, totalPages);
	};

	const pages = pageBlocks();

	return (
		<div>
			<nav>
				<ul className="pagination">
					{pages.map((page, index) => {
						if (page === LEFT_PAGE)
							return (
								<li key={index} className="page-item">
									<a className="page-link" href="#" aria-label="Previous" onClick={handleMoveLeft}>
										<span aria-hidden="true">&laquo;</span>
										<span className="sr-only">Previous</span>
									</a>
								</li>
							);

						if (page === RIGHT_PAGE)
							return (
								<li key={index} className="page-item">
									<a className="page-link" href="#" aria-label="Next" onClick={handleMoveRight}>
										<span aria-hidden="true">&raquo;</span>
										<span className="sr-only">Next</span>
									</a>
								</li>
							);

						return (
							<li
								key={index}
								className={`page-item${currentPage === page ? " active" : ""}`}
								onClick={props.secondEvent}
							>
								<Link to={`/admin/products?page=${page}`} className="page-link" onClick={() => handleGotoPage(page)}>
									<div>{page}</div>
									{/* <a className="page-link" href="#" onClick={() => handleGotoPage(page)}>
										{page}
									</a> */}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}

export default Pagination;
