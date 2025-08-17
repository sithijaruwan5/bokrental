package com.newnop.bookrental.controller;

import org.springframework.web.bind.annotation.*;

import com.newnop.bookrental.dto.AuthResponse;
import com.newnop.bookrental.model.User;
import com.newnop.bookrental.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody User user) {
        User registeredUser = authService.userRegister(user);
        String token = authService.generateToken(registeredUser);

        return new AuthResponse(
                registeredUser.getId(),
                registeredUser.getEmail(),
                registeredUser.getName(),
                token,
                registeredUser.getRole()
        );
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody User user) {
        User loggedInUser = authService.loginUser(user);
        String token = authService.generateToken(loggedInUser);

        return new AuthResponse(
                loggedInUser.getId(),
                loggedInUser.getEmail(),
                loggedInUser.getName(),
                token,
                loggedInUser.getRole()
        );
    }
}
