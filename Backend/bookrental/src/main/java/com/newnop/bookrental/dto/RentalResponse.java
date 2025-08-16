package com.newnop.bookrental.dto;

import com.newnop.bookrental.model.Book;

import lombok.Data;

@Data
public class RentalResponse {
    
    private Long rentalId;
    private Book book;
    private Long userId;
    private String userName;

    private String rentalDate;
    private String returnDate;
    private boolean isReturned;

    public RentalResponse(Long rentalId, Book book, Long userId, String userName, String rentalDate, String returnDate, boolean isReturned) {
        this.rentalId = rentalId;
        this.book = book;
        this.userId = userId;
        this.userName = userName;
        this.rentalDate = rentalDate;
        this.returnDate = returnDate;
        this.isReturned = isReturned;
    }
}
