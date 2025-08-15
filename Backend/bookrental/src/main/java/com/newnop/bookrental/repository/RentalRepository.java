package com.newnop.bookrental.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newnop.bookrental.model.Book;
import com.newnop.bookrental.model.Rental;
import com.newnop.bookrental.model.User;

public interface RentalRepository extends JpaRepository<Rental,Long>{

    List<Rental> findByUser(User user);
    List<Rental> findByBook(Book book);
    List<Rental> findByUserAndIsReturnedFalse(User user);
    List<Rental> findByIsReturnedFalse();

}
