package com.Subhash.Social.Media.Auto.Post.repository;

import com.Subhash.Social.Media.Auto.Post.model.PostHistory;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PostHistoryRepository extends MongoRepository<PostHistory, ObjectId> {
 List<PostHistory> findByUserId(ObjectId userId);
}

