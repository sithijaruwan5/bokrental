package com.newnop.bookrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newnop.bookrental.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
    public Book findByTitle(String title);
    public Book findByIsbn(String isbn);

}
