package com.Subhash.Social.Media.Auto.Post.controller;

import com.Subhash.Social.Media.Auto.Post.model.PostHistory;
import com.Subhash.Social.Media.Auto.Post.repository.UserRepository;
import com.Subhash.Social.Media.Auto.Post.service.AIService;
import com.Subhash.Social.Media.Auto.Post.service.PostHistoryService;
import com.Subhash.Social.Media.Auto.Post.service.UserService;
import com.Subhash.Social.Media.Auto.Post.model.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired private AIService aiService;
    @Autowired private PostHistoryService postHistoryService;
    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;

    // Generate AI comments
    @PostMapping("/generate")
    public ResponseEntity<?> generateComments(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.get("title");
        String tone = (String) payload.get("tone");
        int length = payload.get("length") != null ? (int) payload.get("length") : 100;
        List<String> comments = aiService.generateComments(title, tone, length);
        return ResponseEntity.ok(Map.of("suggestions", comments));
    }

    // 🆕 Preview Tweet Link (no save)
    @PostMapping("/preview")
    public ResponseEntity<?> previewPost(@RequestBody Map<String, Object> payload) {
        String comment = (String) payload.get("comment");
        List<String> platforms = (List<String>) payload.get("platforms");

        String tweetLink = platforms.contains("twitter") ? postHistoryService.generateTweetLink(comment) : null;
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Preview link generated");
        if (tweetLink != null) response.put("tweetLink", tweetLink);

        return ResponseEntity.ok(response);
    }

    // 🆕 Save only after confirmation
    @PostMapping("/save")
    public ResponseEntity<?> savePost(@RequestBody Map<String, Object> payload) {
        String userIdStr = (String) payload.get("userId");
        String comment = (String) payload.get("comment");
        String tone = (String) payload.get("tone");
        List<String> platforms = (List<String>) payload.get("platforms");

        ObjectId userId = new ObjectId(userIdStr);
        Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        PostHistory history = postHistoryService.postToPlatforms(userId, comment, tone, platforms);
        return ResponseEntity.ok(Map.of("message", "Post saved", "postId", history.getIdAsString()));
    }
}
