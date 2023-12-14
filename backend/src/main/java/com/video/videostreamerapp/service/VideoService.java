package com.video.videostreamerapp.service;

import com.video.videostreamerapp.dto.VideoDto;
import com.video.videostreamerapp.model.Video;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.video.videostreamerapp.repository.VideoRepository;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final FirebaseService firebaseService;
    private final VideoRepository videoRepository;
    public String uploadVideo(MultipartFile multipartFile) throws IOException {
        // Upload file to Firebase Bucket
        String videoUrl = firebaseService.uploadFile(multipartFile);

        // Save the URL in mongo
        var video = new Video();
        video.setVideoUrl(videoUrl);

        videoRepository.save(video);

        return "Successfully uploaded the video to firebase => " + videoUrl;
    }

    public Video editVideo(VideoDto videoDto) {
        // Find the video by videoId
        Video savedVideo = videoRepository.findById(videoDto.getId()).orElseThrow(() -> new IllegalArgumentException(
                "Cannot find video by id - " + videoDto.getId()
        ));

        // Map the videoDto fields to video
        savedVideo.setTitle(videoDto.getTitle());
        savedVideo.setDescription(videoDto.getDescription());
        savedVideo.setTags(videoDto.getTags());
        savedVideo.setThumbnailUrl(videoDto.getThumbnailUrl());
        savedVideo.setVideoStatus(videoDto.getVideoStatus());

        // Save to mongo doc
        videoRepository.save(savedVideo);
        return savedVideo;
    }
}
