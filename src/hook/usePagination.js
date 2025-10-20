import React, { useState } from 'react';

const usePagination = (data, initialItemsPerPage = 9) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    React.useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

    return {
        currentItems,
        currentPage,
        itemsPerPage,
        totalItems: data.length,
        handlePageChange,
        handleItemsPerPageChange
    };
};

export default usePagination;