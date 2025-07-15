package com.Subhash.Social.Media.Auto.Post.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;


@Data
@Document(collection = "post_history")

public class PostHistory {
    @Id()
    private ObjectId id;

    private ObjectId userId;
    private String comment;
    private String tone;
    private List<String> platforms;
    private LocalDateTime timestamp;

    @JsonProperty("id")
    public String getIdAsString() {
        return id != null ? id.toHexString() : null;
    }

    @JsonProperty("userId")
    public String getUserIdAsString() {
        return userId != null ? userId.toHexString() : null;
    }

}