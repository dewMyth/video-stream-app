package com.video.videostreamerapp.service;

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
    public void uploadVideo(MultipartFile multipartFile) throws IOException {
        // Upload file to Firebase Bucket
        String videoUrl = firebaseService.uploadFile(multipartFile);

        // Save the URL in mongo
        var video = new Video();
        video.setVideoUrl(videoUrl);

        videoRepository.save(video);
    }
}
