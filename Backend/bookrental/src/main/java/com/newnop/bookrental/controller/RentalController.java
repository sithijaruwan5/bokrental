package com.newnop.bookrental.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.newnop.bookrental.config.CustomUserDetails;
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
    public ResponseEntity<RentalResponse> createRental(@RequestBody RentalRequest rentalRequest, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getId();
        Rental rental = rentalService.createRental(userId, rentalRequest.getBookId());
        return new ResponseEntity<>(toResponse(rental), HttpStatus.CREATED);
    }

    @PostMapping("/return/{rentalId}")
    public ResponseEntity<RentalResponse> returnRental(@PathVariable Long rentalId) {
        Rental rental = rentalService.returnRental(rentalId);
        return new ResponseEntity<>(toResponse(rental), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RentalResponse>> getAllRentals() {
        List<RentalResponse> rentalResponses = rentalService.getAllRentals()
                .stream()
                .map(this::toResponse)
                .toList();
        return new ResponseEntity<>(rentalResponses, HttpStatus.OK);
    }

    @PostMapping("/extenddate/{rentalId}")
    public ResponseEntity<RentalResponse> extendRentalDate(@PathVariable Long rentalId) {
        Rental rental = rentalService.extendRental(rentalId);
        return new ResponseEntity<>(toResponse(rental), HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<RentalResponse>> getRentalsByUser(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getId();
        List<RentalResponse> rentalResponses = rentalService.getRentalsByUser(userId)
                .stream()
                .map(this::toResponse)
                .toList();
        return new ResponseEntity<>(rentalResponses, HttpStatus.OK);
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
