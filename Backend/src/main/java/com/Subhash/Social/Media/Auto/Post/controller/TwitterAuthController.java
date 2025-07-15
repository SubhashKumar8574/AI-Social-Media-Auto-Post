package com.Subhash.Social.Media.Auto.Post.controller;

import com.Subhash.Social.Media.Auto.Post.service.TwitterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@RequestMapping("/api/twitter")
@RequiredArgsConstructor
public class TwitterAuthController {

    private final TwitterService twitterService;

    @GetMapping("/auth")
    public ResponseEntity<?> getAuthUrl() {
        // Optional: you can serve a dynamic state/code_challenge generator here
        return ResponseEntity.ok(Map.of("message", "Use client to initiate OAuth"));
    }

    @GetMapping("/callback")
    public RedirectView callback(@RequestParam String code) {
        return new RedirectView("http://localhost:5173/twitter-success?code=" + code);
    }

    @PostMapping("/exchange-token")
    public ResponseEntity<?> exchangeToken(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String verifier = payload.get("verifier");

        String accessToken = twitterService.exchangeCodeForAccessToken(code, verifier);
        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    @PostMapping("/tweet")
    public ResponseEntity<?> tweet(@RequestBody Map<String, String> payload) {
        String comment = payload.get("comment");
        String token = payload.get("accessToken");

        twitterService.postTweet(comment, token);
        return ResponseEntity.ok(Map.of("message", "Tweet posted successfully"));
    }
}
