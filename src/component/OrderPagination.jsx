import React, { useState } from "react";

const OrderPagination = ({
  itemPerPage,
  totalItems,
  onPageChange,
  currentPage,
  onRowsPerPageChange
}) => {
  const [rowPerPage, setRowsPerPage] = useState(itemPerPage);
  const pageNumber = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumber.push(i);
  };

  const handleRowPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    onRowsPerPageChange(newRowsPerPage);
  }
  return (
    <>
      <div className="row align-items-center mx-0 justify-content-between mt-3">
        <div className="col-lg-3 col-md-6 col-6 text-start OrderProductTotal">
          <b>Total Items:</b> {totalItems}
        </div>
        <div className="col-lg-3 col-md-6 col-6  OrderProductRowPage">
          <div className="row_page d-flex align-items-center justify-content-end justify-content-md-end justify-content-between">
            <h6 className="mb-0 me-2 me-md-2 me-lg-2">Row Per Page</h6>
            {/* Row Per Page */}
            <select
              className="form-select"
              aria-label="Rows per page selector"
              value={rowPerPage}
              onChange={handleRowPerPageChange}
              // style={{
              //   width: "30%",
              //   padding: ".175rem 1.3rem .175rem .55rem",
              //   backgroundPosition: "right .35rem center",
              // }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={totalItems}>All</option>
            </select>
          </div>
        </div>
        <div className="col-lg-4 col-12">
          <div className="Orderpagination d-flex align-items-center justify-content-lg-end justify-content-center">
          <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
            <div className="OrderPagination-list d-flex">
              {pageNumber.map((number, index) => {
                return (
                  <button
                    key={index}
                    className={`OrderPagination_button page-item ${currentPage === number ? "active" : ""
                      }`}
                    onClick={() => onPageChange(number)}
                  >
                    {number}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pageNumber.length}
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPagination;
