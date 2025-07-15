package com.Subhash.Social.Media.Auto.Post.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    @Id
    private ObjectId id;
    @Indexed(unique = true)
@NonNull
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
@NonNull
    private String password;
    @Indexed(unique = true)
    @NonNull
    private String email;


    @JsonProperty("id")
 public String getIdAsString() {
 return id != null ? id.toHexString() : null;
 }

}
