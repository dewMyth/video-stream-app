package com.video.videostreamerapp.controller;


import com.video.videostreamerapp.dto.VideoDto;
import com.video.videostreamerapp.model.Video;
import com.video.videostreamerapp.service.FileService;
import com.video.videostreamerapp.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @CrossOrigin
    public String uploadVideo(@RequestParam("file") MultipartFile file) throws IOException {
        System.out.println("Starting upload files....");
        return videoService.uploadVideo(file);
    }

    @PutMapping("edit")
    @ResponseStatus(HttpStatus.OK)
    @CrossOrigin
    public Video editVideo(@RequestBody VideoDto videoDto){
        return videoService.editVideo(videoDto);
    }

}
