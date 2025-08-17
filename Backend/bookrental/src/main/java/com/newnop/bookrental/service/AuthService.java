package com.newnop.bookrental.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.newnop.bookrental.config.JwtUtils;
import com.newnop.bookrental.exception.CustomException;
import com.newnop.bookrental.model.User;
import com.newnop.bookrental.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils; 

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    //User registration method
    public User userRegister(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new CustomException("Email already exists");
        }
        //encrypt the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        //set default role
        user.setRole("USER");

        try {
            userRepository.save(user);
            return user;
        } catch (Exception e) {
            logger.error("Error registering user: {}", e.getMessage(), e);
            throw new CustomException("Registration failed. Try again!");
        }
    }

    //User login method
    public User loginUser(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (!existingUser.isPresent()) {
            throw new CustomException("Email or password is incorrect");
        }

        User existingUserObj = existingUser.get();
        if (!passwordEncoder.matches(user.getPassword(), existingUserObj.getPassword())) {
            throw new CustomException("Email or password is incorrect");
        }

        return existingUserObj;
    }

    public String generateToken(User user) {
        return jwtUtils.generateToken(user.getEmail());
    }
}
