package com.Subhash.Social.Media.Auto.Post.controller;

import com.Subhash.Social.Media.Auto.Post.model.User;
import com.Subhash.Social.Media.Auto.Post.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // Signup endpoint
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);

            Map<String, Object> userData = Map.of(
                    "_id", registeredUser.getIdAsString(),
                    "username", registeredUser.getUsername(),
                    "email", registeredUser.getEmail()
            );

            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "token", "basic-auth", // ✅ Dummy token so frontend works
                    "user", userData
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> userOpt = userService.verifyUserCredentials(username, password);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            Map<String, Object> userData = Map.of(
                    "_id", user.getIdAsString(),
                    "username", user.getUsername(),
                    "email", user.getEmail()
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", "basic-auth", // ✅ Dummy token
                    "user", userData
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }
}
