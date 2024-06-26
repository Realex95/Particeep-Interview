import React from 'react';
import './Pagination.css';
import {  faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
}) => {
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onItemsPerPageChange(Number(e.target.value));
    };

    return (
        <div className="container">
            <div className='pagination'>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}> 
                     <FontAwesomeIcon icon={faAngleLeft} />
                 </button>
                <span> Page {currentPage} sur {totalPages} </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}> 
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>
            
            <div>
                <label> Nombre de films par page :
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default Pagination;
