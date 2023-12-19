package com.video.videostreamerapp.service;

import com.video.videostreamerapp.dto.UploadVideoResponse;
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

    public UploadVideoResponse uploadVideo(MultipartFile multipartFile) throws IOException {
        // Upload file to Firebase Bucket
        String videoUrl = firebaseService.uploadFile(multipartFile);

        // Save the URL in mongo
        var video = new Video();
        video.setVideoUrl(videoUrl);

        var savedVideo = videoRepository.save(video);

        return new UploadVideoResponse(savedVideo.getId(), savedVideo.getVideoUrl());
    }

    public Video uploadThumbnail(MultipartFile image, String videoId) throws IOException {
        // Find the video by videoId
        Video savedVideo = videoRepository.findById(videoId).orElseThrow(() -> new IllegalArgumentException(
                "Cannot find video by id - " + videoId
        ));

        String thumbnailUrl = firebaseService.uploadFile(image);

        savedVideo.setThumbnailUrl(thumbnailUrl);
        videoRepository.save(savedVideo);

        return savedVideo;
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
        savedVideo.setVideoStatus(videoDto.getVideoStatus());

        // Save to mongo doc
        videoRepository.save(savedVideo);
        return savedVideo;
    }

    public Video getVideoById(String videoId) {

        return videoRepository.findById(videoId).orElseThrow(() -> new IllegalArgumentException(
                "Cannot find video for id - " + videoId
        ));
    }
}
