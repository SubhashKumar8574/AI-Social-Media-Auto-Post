package com.Subhash.Social.Media.Auto.Post.repository;

import com.Subhash.Social.Media.Auto.Post.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
 Optional<User> findByUsername(String username);
 Optional<User> findByEmail(String email);
}
