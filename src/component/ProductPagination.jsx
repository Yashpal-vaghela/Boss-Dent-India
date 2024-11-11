import React from "react";

const ProductPagination = ({
  totalProducts,
  productsPerPage,
  currentPage,
  onPageChange,
}) => {
  //   console.log(
  //     "totalProducts",
  //     totalProducts,
  //     "productsPerPage",
  //     productsPerPage,
  //     "currentPage",
  //     currentPage,
  //     "onPage",
  //     onPageChange
  //   );
  // Calculate total pages based on total products
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const renderPagination = () => {
    const paginationButtons = [];

    if (totalProducts == 170) {
      if (totalPages <= 1) return paginationButtons; // No need to show pagination if there's only one page
      // Always show the first page
      paginationButtons.push(
        <button
          key={1}
          className={`paginate_button page-item ${
            currentPage === 1 ? "active" : ""
          }`}
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );

      // If current page is 1, show pages 1-4 and an ellipsis
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          paginationButtons.push(
            <button
              key={i}
              className={`paginate_button page-item ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </button>
          );
        }
        if (totalPages > 5) {
          paginationButtons.push(
            <span key="end-ellipsis" className="ellipsis">
              ...
            </span>
          );
        }
      }
      // If current page is near the end, show pages around the end
      else if (currentPage > totalPages - 3) {
        if (totalPages > 5) {
          paginationButtons.push(
            <span key="start-ellipsis" className="ellipsis">
              ...
            </span>
          );
        }
        for (let i = totalPages - 3; i < totalPages; i++) {
          paginationButtons.push(
            <button
              key={i}
              className={`paginate_button page-item ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </button>
          );
        }
      }
      // For other cases, show the current page, previous, and next page
      else {
        paginationButtons.push(
          <span key="start-ellipsis" className="ellipsis">
            ...
          </span>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          paginationButtons.push(
            <button
              key={i}
              className={`paginate_button page-item ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </button>
          );
        }
        paginationButtons.push(
          <span key="end-ellipsis" className="ellipsis">
            ...
          </span>
        );
      }

      console.log(
        "Pagination",
        paginationButtons,
        "totalPages",
        totalPages
        //   paginationButtons[totalPages].key,
      );
      paginationButtons.push(
        <button
          key={totalPages}
          className={`paginate_button page-item ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
      // Always show the last page
      return paginationButtons;
    } else {
      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === currentPage ||
          i === totalPages ||
          (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
          paginationButtons.push(
            <button
              key={i}
              className={`paginate_button page-item ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </button>
          );
        } else if (i === currentPage - 2 || i === currentPage + 2) {
          // Add ellipsis for skipped pages
          paginationButtons.push(
            <span key={`ellipsis-${i}`} className="ellipsis">
              ...
            </span>
          );
        }
      }
      console.log("page", paginationButtons);
      return paginationButtons;
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <div className="pagination-list">{renderPagination()}</div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default ProductPagination;
