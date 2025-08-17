package com.newnop.bookrental.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.newnop.bookrental.exception.CustomException;
import com.newnop.bookrental.model.Book;
import com.newnop.bookrental.model.Rental;
import com.newnop.bookrental.model.User;
import com.newnop.bookrental.repository.BookRepository;
import com.newnop.bookrental.repository.RentalRepository;
import com.newnop.bookrental.repository.UserRepository;

@Service
public class RentalService {

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    // Method to create a new rental
    public Rental createRental(Long userId, Long bookId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException ("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException("Book not found"));

        if (!book.isAvailable()) {
            throw new CustomException("Book is not available");
        }

        List<Rental> activeRentals = rentalRepository.findByUserAndIsReturnedFalse(user);
        if (!activeRentals.isEmpty()) {
            throw new CustomException("You already have an active rental");
        }

        Rental rental = new Rental();
        rental.setBook(book);
        rental.setUser(user);
        rental.setRentalDate(java.time.LocalDate.now().toString());
        rental.setReturnDate(java.time.LocalDate.now().plusWeeks(3).toString());
        rental.setReturned(false);
        book.setAvailable(false);

        try {
            bookRepository.save(book);
            return rentalRepository.save(rental);
        } catch (Exception e) {
            throw new CustomException("Failed to create rental: " + e.getMessage());
        }
    }

    // Method to get all rentals
    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    // Method to get active rentals
    public List<Rental> getActiveRentals() {
        return rentalRepository.findByIsReturnedFalse();
    }

    // Method to get rentals by user
    public List<Rental> getRentalsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));
        return rentalRepository.findByUser(user);
    }

    // Method to get rentals by book
    public List<Rental> getRentalsByBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException("Book not found"));
        return rentalRepository.findByBook(book);
    }

    // Method to return a rental
    public Rental returnRental(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new CustomException("Rental not found"));

        if (rental.isReturned()) {
            throw new CustomException("Rental already returned");
        }

        Book book = rental.getBook();
        book.setAvailable(true);
        rental.setReturned(true);

        try {
            bookRepository.save(book);
            return rentalRepository.save(rental);
        } catch (Exception e) {
            throw new CustomException("Failed to return rental: " + e.getMessage());
        }
    }

    // Method to extend a rental duedate
    public Rental extendRental(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new CustomException("Rental not found"));

        if (rental.isReturned()) {
            throw new CustomException("Rental already returned");
        }

        rental.setReturnDate(java.time.LocalDate.parse(rental.getReturnDate()).plusWeeks(1).toString());

        try {
            return rentalRepository.save(rental);
        } catch (Exception e) {
            throw new CustomException("Failed to extend rental: " + e.getMessage());
        }
    }
}
