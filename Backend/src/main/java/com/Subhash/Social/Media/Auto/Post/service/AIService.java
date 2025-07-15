package com.Subhash.Social.Media.Auto.Post.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

@Service
public class AIService {

    @Value("${google.gemini.url}")
    private String geminiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .defaultHeader("Content-Type", "application/json")
            .build();

    public List<String> generateComments(String title, String tone, int length) {
        // Construct prompt
        String prompt = String.format(
                "Generate 3 %s comments for the title: '%s'. Each comment should be approximately %d characters long. Return them as a Python list.",
                tone, title, length
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        String fullUrl = geminiUrl + "?key=" + apiKey;
        System.out.println("Calling Gemini API → " + fullUrl);

        try {
            Map response = webClient.post()
                    .uri(fullUrl)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.value() == 401,
                            res -> {
                                System.out.println("❌ Gemini API responded with 401 Unauthorized");
                                return Mono.error(new RuntimeException("Unauthorized"));
                            })
                    .bodyToMono(Map.class)
                    .block(); // Blocking for sync result

            if (response != null) {
                List<Map> candidates = (List<Map>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map content = (Map) candidates.get(0).get("content");
                    List<Map> parts = (List<Map>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String text = (String) parts.get(0).get("text");
                        System.out.println("✅ Gemini raw text:\n" + text);

                        // Parse actual comments from text inside the [ ] array
                        return extractCommentsFromGeminiText(text, title, tone);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("❌ Error calling Gemini API: " + e.getMessage());
        }

        // Fallback if Gemini fails
        return List.of(
                tone + " comment 1 for: " + title,
                tone + " comment 2 for: " + title,
                tone + " comment 3 for: " + title
        );
    }

    private List<String> extractCommentsFromGeminiText(String text, String title, String tone) {
        List<String> cleanedComments = new ArrayList<>();
        boolean insideArray = false;

        for (String line : text.split("\n")) {
            line = line.trim();

            // Handle cases like: variableName = [ ... ]
            if (line.contains("["))
                insideArray = true;
            else if (line.contains("]"))
                insideArray = false;
            else if (insideArray && line.startsWith("\"")) {
                line = line.replaceAll("[\",]", "").trim();
                if (!line.isEmpty()) {
                    cleanedComments.add(line);
                }
            }
        }

        return cleanedComments.isEmpty()
                ? List.of(
                tone + " comment 1 for: " + title,
                tone + " comment 2 for: " + title,
                tone + " comment 3 for: " + title
        )
                : cleanedComments;
    }

}
