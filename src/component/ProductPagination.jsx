import React from "react";

const ProductPagination = ({ totalProducts, productsPerPage, currentPage, onPageChange }) => {

    // Calculate total pages based on total products
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const renderPagination = () => {
        const paginationButtons = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // Always show the first page
                i === currentPage || // Show the current page
                i === totalPages || // Always show the last page
                (i >= currentPage - 1 && i <= currentPage + 1) // Show surrounding pages
            ) {
                paginationButtons.push(
                    <button
                        key={i}
                        className={`paginate_button page-item ${currentPage === i ? "active" : ""}`}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </button>
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                // Add ellipsis for skipped pages
                paginationButtons.push(
                    <span key={`ellipsis-${i}`} className="ellipsis">...</span>
                );
            }
        }
        return paginationButtons;
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
