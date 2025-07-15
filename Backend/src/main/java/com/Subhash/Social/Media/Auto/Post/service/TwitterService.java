package com.Subhash.Social.Media.Auto.Post.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TwitterService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${twitter.client.id}")
    private String clientId;

    @Value("${twitter.client.secret}")
    private String clientSecret;

    @Value("${twitter.redirect.uri}")
    private String redirectUri;

    public String exchangeCodeForAccessToken(String code, String verifier) {
        String tokenUrl = "https://api.twitter.com/2/oauth2/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Form data body
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", redirectUri);
        body.add("client_id", clientId); // NO client secret
        body.add("code_verifier", verifier);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return (String) response.getBody().get("access_token");
        } else {
            throw new RuntimeException("Failed to exchange code for token: " + response);
        }
    }



    public void postTweet(String comment, String accessToken) {
        String tweetUrl = "https://api.twitter.com/2/tweets";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of("text", comment);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(tweetUrl, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to post tweet: " + response.getBody());
        }
    }
}
