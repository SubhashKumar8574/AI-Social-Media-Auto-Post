package com.Subhash.Social.Media.Auto.Post.service;

import com.Subhash.Social.Media.Auto.Post.model.PostHistory;
import com.Subhash.Social.Media.Auto.Post.repository.PostHistoryRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PostHistoryService {

    @Autowired
    private PostHistoryRepository postHistoryRepository;

    public PostHistory postToPlatforms(ObjectId userId, String comment, String tone, List<String> platforms) {
        for (String platform : platforms) {
            if (platform.equalsIgnoreCase("twitter")) {
                String tweetLink = generateTweetLink(comment);
                System.out.println("🧭 Open this link to tweet manually: " + tweetLink);
            } else {
                System.out.println("ℹ️ Simulated posting to: " + platform + " -> " + comment);
            }
        }

        PostHistory history = new PostHistory();
        history.setUserId(userId);
        history.setComment(comment);
        history.setTone(tone);
        history.setPlatforms(platforms);
        history.setTimestamp(LocalDateTime.now());

        return postHistoryRepository.save(history);
    }

    public String generateTweetLink(String comment) {
        String encodedText = URLEncoder.encode(comment, StandardCharsets.UTF_8);
        return "https://twitter.com/intent/tweet?text=" + encodedText;
    }
}
