package com.video.videostreamerapp.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;

public interface FileService {
    String uploadFile(MultipartFile file) throws IOException;
}
