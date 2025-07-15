package com.Subhash.Social.Media.Auto.Post.model;

import lombok.Data;
import lombok.NonNull;

import java.util.List;

@Data
public class PostRequest {

 @NonNull
 private String title;

 @NonNull
 private String tone;

 @NonNull
 private List<String> platforms;
}
