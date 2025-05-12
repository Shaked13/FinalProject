import { useState } from "react";

const UsePaginationCrm = (searchCards: any) => {

    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 10;
    const onPageChange = (page: number) => setCurrentPage(page);


    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const allCards = searchCards();
    const currentCards = allCards.slice(indexOfFirstCard, indexOfLastCard);
    const totalPages = Math.ceil(allCards.length / cardsPerPage);

    return { cardsPerPage, onPageChange, currentCards, totalPages, currentPage, setCurrentPage, indexOfLastCard, indexOfFirstCard }
};

export default UsePaginationCrm;