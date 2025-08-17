package com.newnop.bookrental.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.newnop.bookrental.model.Book;
import com.newnop.bookrental.repository.BookRepository;
import com.newnop.bookrental.repository.RentalRepository;

import jakarta.transaction.Transactional;

@Service
public class BookService {

    @Autowired
    BookRepository bookRepository;

    @Autowired
    RentalRepository rentalRepository;

    // Method to create a new book
    public Book createBook(Book book) {
       
       if(bookRepository.findByIsbn(book.getIsbn()) != null) {
            throw new RuntimeException("Book with this ISBN already exists");
        }
        book.setAvailable(true);
        try {
            return bookRepository.save(book);
        } catch (Exception e) {
            throw new RuntimeException("Error creating book: " + e.getMessage());
        }
    }
    // Method to get a book by ID
    public List<Book> getAllBooks() {
        try {
            return bookRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching books: " + e.getMessage());
        }
    }

    // Method to get a book by ID
    public Book updateBook(Book book) {
        if(book.getId() == null) {
            throw new RuntimeException("Book ID missing");
        }
        if (bookRepository.findById(book.getId()).isEmpty()) {
            throw new RuntimeException("Book not found");
        }
        book.setAvailable(true);
        try {
            return bookRepository.save(book);
        } catch (Exception e) {
            throw new RuntimeException("Error updating book: " + e.getMessage());
        }
    }

    // Method to delete a book by ID
    @Transactional
    public void deleteBook(Long id) {
        if (id == null) {
            throw new RuntimeException("Book ID missing");
        }
    
        var book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        //delete book references in rentals
        rentalRepository.deleteAllByBookId(id);
        //delete book
        bookRepository.delete(book);
    }
    
}
