package com.video.videostreamerapp.repository;

import com.video.videostreamerapp.model.Video;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface VideoRepository extends MongoRepository<Video, String> {
}
