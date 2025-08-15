package com.newnop.bookrental.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.newnop.bookrental.model.Book;
import com.newnop.bookrental.repository.BookRepository;

@Service
public class BookService {

    @Autowired
    BookRepository bookRepository;

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

    public List<Book> getAllBooks() {
        try {
            return bookRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching books: " + e.getMessage());
        }
    }

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

    public void deleteBook(Long id) {
        if(id == null) {
            throw new RuntimeException("Book ID missing");
        }
        if (bookRepository.findById(id).isEmpty()) {
            throw new RuntimeException("Book not found");
        }
        try {
            bookRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting book: " + e.getMessage());
        }
    }
    
}
