package com.newnop.bookrental.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.newnop.bookrental.dto.RentalRequest;
import com.newnop.bookrental.dto.RentalResponse;
import com.newnop.bookrental.model.Rental;
import com.newnop.bookrental.service.RentalService;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    @Autowired
    private RentalService rentalService;



    @PostMapping("/rent")
    public ResponseEntity<?> createRental(@RequestBody RentalRequest rentalRequest) {
        try {
            Rental rental = rentalService.createRental(rentalRequest);
            return new ResponseEntity<>(toResponse(rental), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/return/{rentalId}")
    public ResponseEntity<?> returnRental(@PathVariable Long rentalId) {
        try {
            Rental rental = rentalService.returnRental(rentalId);
            return new ResponseEntity<>(toResponse(rental), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllRentals() {
        try {
            List<RentalResponse> rentalResponses = rentalService.getAllRentals()
                .stream()
                .map(this::toResponse) 
                .toList();
            return new ResponseEntity<>(rentalResponses, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/extenddate/{rentalId}")
    public ResponseEntity<?> extendRentalDate(@PathVariable Long rentalId) {
        try {
            Rental rental = rentalService.extendRental(rentalId);
            return new ResponseEntity<>(toResponse(rental), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private RentalResponse toResponse(Rental rental) {
        return new RentalResponse(
            rental.getId(),
            rental.getBook(),
            rental.getUser().getId(),
            rental.getUser().getName(),
            rental.getRentalDate(),
            rental.getReturnDate(),
            rental.isReturned()
        );
    }
}
